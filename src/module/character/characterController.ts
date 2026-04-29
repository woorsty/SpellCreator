import express, { Request, Response } from "express";
import { Util } from "../../util";
import { CharacterSheet, JsonFilePath } from "../../model/charactersheet";
import path from "path";

export class CharacterController {
  static getAll(req: Request, res: Response) {
    const allCharacters = CharacterController.getAllCharacters();
    res.render("character-list", {
      characters: allCharacters,
      renderMarkdown: Util.renderMarkdown,
    });
  }

  static async get(req: Request, res: Response) {
    const characterName = req.params.name;
    const allCharacters = await CharacterController.getAllCharacters();
    const currentCharacter = allCharacters.find(
      (character) =>
        character.name.toLowerCase() === characterName.toLowerCase(),
    );
    if (currentCharacter) {
      res.render("character-detail", {
        character: currentCharacter,
        renderMarkdown: Util.renderMarkdown,
      });
    } else {
      res.render("character-detail", {
        character: CharacterSheet.getTestCharacter(),
        renderMarkdown: Util.renderMarkdown,
      });
    }
  }

  private static async getAllCharacters(): Promise<CharacterSheet[]> {
    const characterData = await Util.readJsonFile<CharacterSheet>(JsonFilePath);
    return characterData;
  }

  static async openNewCharacterSheet(req: Request, res: Response) {
    res.render("character-create/view", {
      character: new CharacterSheet(),
      renderMarkdown: Util.renderMarkdown,
    });
  }
}
