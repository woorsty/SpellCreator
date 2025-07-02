"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvocationController = void 0;
const util_1 = require("../util");
const invocationModel_1 = require("./invocationModel");
const path_1 = __importDefault(require("path"));
const spellControler_1 = require("../spell/spellControler");
class InvocationController {
    static getEditForm(req, res) {
        throw new Error("Method not implemented.");
    }
    static edit(req, res) {
        throw new Error("Method not implemented.");
    }
    static async add(req, res) {
        const invocationData = await util_1.Util.readJsonFile(invocationModel_1.JsonFilePath);
        invocationData.push(req.body);
        await util_1.Util.writeJsonFile(invocationData, invocationModel_1.JsonFilePath);
        res.statusCode = 303;
        res.setHeader("Location", "/invocation/add");
        res.end();
    }
    static getAddForm(req, res) {
        res.sendFile(path_1.default.join(__dirname, "../../public/add-invocation.html"));
    }
    static async getAll(req, res) {
        const sortierung = req.query.sortierung;
        const invocationData = await util_1.Util.readJsonFile(invocationModel_1.JsonFilePath);
        for (const invocation of invocationData) {
            invocation.Zauber = await spellControler_1.SpellController.getSpellByName(invocation.Zauber);
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
            renderMarkdown: util_1.Util.renderMarkdown,
        });
    }
}
exports.InvocationController = InvocationController;
//# sourceMappingURL=invocationController.js.map