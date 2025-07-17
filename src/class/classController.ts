import { Util } from "../util";
import { Class } from "./class";
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

  static async getAddForm(req: Request, res: Response) {}

  static async add(req: Request, res: Response) {}

  static async edit(req: Request, res: Response) {}

  static async getEditForm(req: Request, res: Response) {
    const className = req.params.name;
    const cls = ClassController.getCls(className);
    if (cls) {
      res.render("edit-class", { class: cls });
    } else {
      res.status(404).send("Klasse nicht gefunden");
    }
  }
}
