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
    const classData = await Util.readJsonFile<Class>(this.jsonFilepath);
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

  static async getAddForm(req: Request, res: Response) {
    res.render("add-class.ejs", { className: req.params.name });
  }

  static async add(req: Request, res: Response) {
    const { Stufe, Name, Text, HöhereLevel, Referenz } = req.body as any;

    const classFeature: ClassFeature = {
      Name: Name,
      Level: Stufe,
      Description: Text,
      HigherLevels: HöhereLevel,
      Reference: Referenz,
    };

    const classesData = await Util.readJsonFile<Class>(
      ClassController.jsonFilepath
    );

    classesData.forEach((cls) => {
      if (cls.Name.toLowerCase() === req.params.name.toLowerCase()) {
        cls.Features.push(classFeature);
      }
    });
    await Util.writeJsonFile(classesData, ClassController.jsonFilepath);
    res.statusCode = 303;
    res.setHeader("Location", "/class/" + req.body.Klasse + "/add");
    res.end();
  }

  static async edit(req: Request, res: Response) {}

  static async getEditForm(req: Request, res: Response) {
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
