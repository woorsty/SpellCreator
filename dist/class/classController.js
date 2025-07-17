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
        const classData = await util_1.Util.readJsonFile(ClassController.jsonFilepath);
        res.render("class-list", {
            classes: classData,
            renderMarkdown: util_1.Util.renderMarkdown,
        });
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
    static async getAddForm(req, res) {
        res.render("add-class.ejs", { className: req.params.name });
    }
    static async add(req, res) {
        const { Stufe, Name, Text, HöhereStufe, Referenz } = req.body;
        const classFeature = {
            Name: Name,
            Stufe: Stufe,
            Description: Text,
            HöhereStufe: HöhereStufe,
            Reference: Referenz,
        };
        const classesData = await util_1.Util.readJsonFile(ClassController.jsonFilepath);
        classesData.forEach((cls) => {
            if (cls.Name.toLowerCase() === req.params.name.toLowerCase()) {
                cls.Features.push(classFeature);
            }
        });
        await util_1.Util.writeJsonFile(classesData, ClassController.jsonFilepath);
        res.statusCode = 303;
        res.setHeader("Location", "/class/" + req.body.Klasse + "/add");
        res.end();
    }
    static async edit(req, res) {
        const className = req.params.name;
        const featureName = req.params.feature;
        const { Stufe, HöhereStufe, Referenz, Text } = req.body;
        const classesData = await util_1.Util.readJsonFile(ClassController.jsonFilepath);
        classesData.forEach((cls) => {
            if (cls.Name.toLowerCase() === className.toLowerCase()) {
                const feature = cls.Features.find((f) => f.Name.toLowerCase() === featureName.toLowerCase());
                if (feature) {
                    feature.Description = Text;
                    feature.Stufe = Stufe;
                    feature.HöhereStufe = HöhereStufe;
                    feature.Reference = Referenz;
                }
            }
        });
        await util_1.Util.writeJsonFile(classesData, ClassController.jsonFilepath);
        res.statusCode = 303;
        res.setHeader("Location", `/class/${className}`);
        res.end();
    }
    static async getEditForm(req, res) {
        const className = req.params.name;
        const featureName = req.params.feature;
        const cls = await ClassController.getCls(className);
        const feature = cls?.Features.find((f) => f.Name.toLowerCase() === featureName.toLowerCase());
        if (cls && feature) {
            res.render("edit-class", { feature: feature });
        }
        else {
            res.status(404).send("Klasse nicht gefunden");
        }
    }
}
exports.ClassController = ClassController;
ClassController.jsonFilepath = path_1.default.join(__dirname, "../../assets/classes.json");
//# sourceMappingURL=classController.js.map