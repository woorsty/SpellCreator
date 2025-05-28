import { Request, Response } from "express";
import { Util } from "../util";
import { Invocation, JsonFilePath } from "./invocationModel";
import path from "path";
import { SpellController } from "../spell/spellControler";

export class InvocationController {
  static getEditForm(req: Request, res: Response) {
    throw new Error("Method not implemented.");
  }

  static edit(req: Request, res: Response) {
    throw new Error("Method not implemented.");
  }

  static async add(req: Request, res: Response) {
    const invocationData = await Util.readJsonFile<Invocation>(JsonFilePath);
    invocationData.push(req.body as Invocation);
    await Util.writeJsonFile(invocationData, JsonFilePath);
    res.statusCode = 303;
    res.setHeader("Location", "/invocation/add");
    res.end();
  }

  static getAddForm(req: Request, res: Response) {
    res.sendFile(path.join(__dirname, "../../public/add-invocation.html"));
  }

  static async getAll(req: Request, res: Response) {
    const sortierung = req.query.sortierung as string | undefined;

    const invocationData = await Util.readJsonFile<Invocation>(JsonFilePath);

    for (const invocation of invocationData) {
      invocation.Zauber = await SpellController.getSpellByName(
        invocation.Zauber as string
      );
    }

    let filteredInvocation = [...invocationData];

    if (sortierung) {
      switch (sortierung) {
        case "name_asc":
          filteredInvocation.sort((a, b) => a.Name.localeCompare(b.Name));
          break;
        case "name_desc":
          filteredInvocation.sort((a, b) => b.Name.localeCompare(a.Name));
          break;
        case "stufe_asc":
          filteredInvocation.sort((a, b) => a.Stufe - b.Stufe);
          break;
        case "stufe_desc":
          filteredInvocation.sort((a, b) => b.Stufe - a.Stufe);
          break;
      }
    }

    res.render("invocations", {
      invocations: filteredInvocation,
      sortierung: sortierung,
      renderMarkdown: Util.renderMarkdown,
    });
  }
}
