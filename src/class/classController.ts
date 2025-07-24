import { Util } from "../util";
import { Class, ClassFeature } from "./class";
import express, { Request, Response } from "express";
import path from "path";

export class ClassController {
  private static jsonFilepath = path.join(
    __dirname,
    "../../assets/classes.json"
  );

  private static async getCls(name: string): Promise<Class | undefined> {
    const classData = await Util.readJsonFile<Class>(this.jsonFilepath);

    return classData.find(
      (cls) => cls.Name.toLowerCase() === name.toLowerCase()
    );
  }

  static async getAll(req: Request, res: Response) {
    const classData = await Util.readJsonFile<Class>(
      ClassController.jsonFilepath
    );
    res.render("class-list", {
      classes: classData,
      renderMarkdown: Util.renderMarkdown,
    });
  }

  static async get(req: Request, res: Response) {
    const className = req.params.name;
    const currentClass = await ClassController.getCls(className);
    if (currentClass) {
      res.render("class", {
        currentClass: currentClass,
        renderMarkdown: Util.renderMarkdown,
      });
    } else {
      res.status(404).send("Klasse nicht gefunden");
    }
  }

  static async getAddFeatureForm(req: Request, res: Response) {
    res.render("add-class.ejs", { className: req.params.name });
  }

  static async getAddSubclassFeatureForm(req: Request, res: Response) {
    res.render("add-class.ejs", {
      className: req.params.name,
      subclass: req.params.subclass,
    });
  }

  static async addClassFeature(req: Request, res: Response) {
    ClassController.addFeature(req, res, false);
  }

  static async addSubclassFeature(req: Request, res: Response) {
    ClassController.addFeature(req, res, true);
  }

  static async addFeature(
    req: Request,
    res: Response,
    subclass: boolean = false
  ) {
    const { Stufe, Name, Text, HöhereStufe, Referenz } = req.body as any;

    const classFeature: ClassFeature = {
      Name: Name,
      Stufe: Stufe,
      Description: Text,
      HöhereStufe: HöhereStufe,
      Reference: Referenz,
    };

    const classesData = await Util.readJsonFile<Class>(
      ClassController.jsonFilepath
    );

    classesData.forEach((cls) => {
      if (cls.Name.toLowerCase() === req.params.name.toLowerCase()) {
        if (subclass) {
          cls.Subclasses.forEach((sub) => {
            if (sub.Name.toLowerCase() === req.params.subclass.toLowerCase()) {
              sub.Features.push(classFeature);
            }
          });
        } else {
          cls.Features.push(classFeature);
        }
      }
    });
    await Util.writeJsonFile(classesData, ClassController.jsonFilepath);
    res.statusCode = 303;
    if (subclass) {
      res.setHeader(
        "Location",
        `/class/${req.params.name}/${req.params.subclass}/add`
      );
    } else {
      res.setHeader("Location", "/class/" + req.body.Klasse + "/add");
    }
    res.end();
  }

  static async editSubclassFeature(req: Request, res: Response) {
    ClassController.editFeature(req, res, true);
  }

  static async editClassFeature(req: Request, res: Response) {
    ClassController.editFeature(req, res, false);
  }

  static async editFeature(
    req: Request,
    res: Response,
    subclass: boolean = false
  ) {
    const className = req.params.name;
    const featureName = req.params.feature;
    const { Stufe, HöhereStufe, Referenz, Text } = req.body as any;

    const classesData = await Util.readJsonFile<Class>(
      ClassController.jsonFilepath
    );

    classesData.forEach((cls) => {
      let feature: ClassFeature | undefined;
      if (cls.Name.toLowerCase() === className.toLowerCase()) {
        if (subclass) {
          cls.Subclasses.forEach((sub) => {
            if (sub.Name.toLowerCase() === req.params.subclass.toLowerCase()) {
              feature = sub.Features.find(
                (f) => f.Name.toLowerCase() === featureName.toLowerCase()
              );
            }
          });
        } else {
          feature = cls.Features.find(
            (f) => f.Name.toLowerCase() === featureName.toLowerCase()
          );
        }

        if (feature) {
          feature.Description = Text;
          feature.Stufe = Stufe;
          feature.HöhereStufe = HöhereStufe;
          feature.Reference = Referenz;
        }
      }
    });

    await Util.writeJsonFile(classesData, ClassController.jsonFilepath);
    res.statusCode = 303;
    res.setHeader("Location", `/class/${className}`);
    res.end();
  }

  static async getEditFeatureForm(req: Request, res: Response) {
    const className = req.params.name;
    const featureName = req.params.feature;
    const cls = await ClassController.getCls(className);
    const feature = cls?.Features.find(
      (f) => f.Name.toLowerCase() === featureName.toLowerCase()
    );
    if (cls && feature) {
      res.render("edit-class", { feature: feature });
    } else {
      res.status(404).send("Klasse nicht gefunden");
    }
  }
}
