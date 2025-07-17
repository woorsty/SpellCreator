"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassController = void 0;
const util_1 = require("../util");
const path_1 = __importDefault(require("path"));
class ClassController {
    static async getCls(name) {
        const classData = await util_1.Util.readJsonFile(this.jsonFilepath);
        return classData.find((cls) => cls.Name.toLowerCase() === name.toLowerCase());
    }
    static async getAll(req, res) {
        const classData = await util_1.Util.readJsonFile(this.jsonFilepath);
    }
    static async get(req, res) {
        const className = req.params.name;
        const currentClass = await ClassController.getCls(className);
        if (currentClass) {
            res.render("class", {
                currentClass: currentClass,
                renderMarkdown: util_1.Util.renderMarkdown,
            });
        }
        else {
            res.status(404).send("Klasse nicht gefunden");
        }
    }
    static async getAddForm(req, res) { }
    static async add(req, res) { }
    static async edit(req, res) { }
    static async getEditForm(req, res) {
        const className = req.params.name;
        const cls = ClassController.getCls(className);
        if (cls) {
            res.render("edit-class", { class: cls });
        }
        else {
            res.status(404).send("Klasse nicht gefunden");
        }
    }
}
exports.ClassController = ClassController;
ClassController.jsonFilepath = path_1.default.join(__dirname, "../../assets/classes.json");
//# sourceMappingURL=classController.js.map