"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterController = void 0;
const util_1 = require("../../util");
const charactersheet_1 = require("../../model/charactersheet");
class CharacterController {
    static getAll(req, res) {
        const allCharacters = CharacterController.getAllCharacters();
        res.render("character-list", {
            characters: allCharacters,
            renderMarkdown: util_1.Util.renderMarkdown,
        });
    }
    static async get(req, res) {
        const characterName = req.params.name;
        const allCharacters = await CharacterController.getAllCharacters();
        const currentCharacter = allCharacters.find((character) => character.name.toLowerCase() === characterName.toLowerCase());
        if (currentCharacter) {
            res.render("character-detail", {
                character: currentCharacter,
                renderMarkdown: util_1.Util.renderMarkdown,
            });
        }
        else {
            res.render("character-detail", {
                character: new charactersheet_1.CharacterSheet(),
                renderMarkdown: util_1.Util.renderMarkdown,
            });
        }
    }
    static async getAllCharacters() {
        const characterData = await util_1.Util.readJsonFile(charactersheet_1.JsonFilePath);
        return characterData;
    }
}
exports.CharacterController = CharacterController;
//# sourceMappingURL=characterController.js.map