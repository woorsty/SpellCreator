import type { Request, Response } from "express";
import { JsonService } from "@domain";
import { MarkdownService } from "@domain";
import { CHARACTERS_PATH } from "../api/apiRouter";
import { CharacterService } from "@domain";
import { CharacterSheet } from "@domain";

export class CharacterController {
  static getAll(req: Request, res: Response) {
    const allCharacters = CharacterController.getAllCharacters();
    res.render("character-list", {
      characters: allCharacters,
      renderMarkdown: MarkdownService.renderMarkdown,
    });
  }

  static async get(req: Request, res: Response) {
    const characterName = req.params.name as string;
    const allCharacters = await CharacterController.getAllCharacters();
    const currentCharacter = allCharacters.find(
      (character) =>
        character.name.toLowerCase() === characterName.toLowerCase(),
    );
    if (currentCharacter) {
      res.render("character-detail", {
        character: currentCharacter,
        renderMarkdown: MarkdownService.renderMarkdown,
      });
    } else {
      res.render("character-detail", {
        character: CharacterService,
        renderMarkdown: MarkdownService.renderMarkdown,
      });
    }
  }

  private static async getAllCharacters(): Promise<CharacterSheet[]> {
    const characterData =
      await JsonService.readJsonFilesInDirectory<CharacterSheet>(
        CHARACTERS_PATH,
      );
    return characterData;
  }

  static async openNewCharacterSheet(req: Request, res: Response) {
    res.redirect("/creator?step=0");
  }
}
