import type { Request, Response } from "express";
import { JsonService } from "@domain";
import { MarkdownService } from "@domain";
import { CHARACTERS_PATH } from "../api/apiRouter";
import { CharacterService } from "@domain";
import { CharacterSheet } from "@domain";
import { Services } from "../../services";

export class CharacterController {
  constructor(private services: Services) {}

  getAll = async (req: Request, res: Response) => {
    const allCharacters = await this.getAllCharacters();
    console.log(allCharacters);
    res.render("character-list", {
      characters: allCharacters,
      renderMarkdown: MarkdownService.renderMarkdown,
    });
  };

  get = async (req: Request, res: Response) => {
    const characterName = req.params.name as string;
    const allCharacters = await this.getAllCharacters();
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
  };

  private getAllCharacters = async (): Promise<CharacterSheet[]> => {
    const characterData =
      await JsonService.readJsonFilesInDirectory<CharacterSheet>(
        CHARACTERS_PATH,
      );
    return characterData;
  };

  openNewCharacterSheet = async (req: Request, res: Response) => {
    res.redirect("/creator?step=0");
  };
}
