import type { Request, Response } from "express";
import { JsonService } from "@repo/domain";
import { MarkdownService } from "@repo/domain";
import { CHARACTERS_PATH } from "../api/apiRouter";
import { CharacterService } from "@repo/domain";
import { CharacterSheet } from "@repo/domain";
import { Services } from "../../services";
import { Translator } from "@repo/i18n";

export class CharacterController {
  private translator: Translator;

  constructor(private services: Services) {
    this.translator = new Translator("characterViewer");
    console.log(this.translator.translate("test"));
  }

  getAll = async (req: Request, res: Response) => {
    const allCharacters = await this.getAllCharacters();
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
        translator: this.translator,
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
