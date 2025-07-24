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
    static async getSubclass(req, res) {
        const className = req.params.name;
        const subclassName = req.params.subclass;
        const currentClass = await ClassController.getCls(className);
        const subclass = currentClass?.Subclasses.find((sub) => sub.Id.toLowerCase() === subclassName.toLowerCase());
        if (currentClass && subclass) {
            res.render("subclass", {
                currentClass: currentClass,
                subclass: subclass,
                renderMarkdown: util_1.Util.renderMarkdown,
            });
        }
        else {
            res.status(404).send("Unterklasse nicht gefunden");
        }
    }
    static async getAddFeatureForm(req, res) {
        res.render("add-class.ejs", { className: req.params.name });
    }
    static async getAddSubclassFeatureForm(req, res) {
        res.render("add-class.ejs", {
            className: req.params.name,
            subclass: req.params.subclass,
        });
    }
    static async addClassFeature(req, res) {
        ClassController.addFeature(req, res, false);
    }
    static async addSubclassFeature(req, res) {
        ClassController.addFeature(req, res, true);
    }
    static async addFeature(req, res, subclass = false) {
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
                if (subclass) {
                    cls.Subclasses.forEach((sub) => {
                        if (sub.Name.toLowerCase() === req.params.subclass.toLowerCase()) {
                            sub.Features.push(classFeature);
                        }
                    });
                }
                else {
                    cls.Features.push(classFeature);
                }
            }
        });
        await util_1.Util.writeJsonFile(classesData, ClassController.jsonFilepath);
        res.statusCode = 303;
        if (subclass) {
            res.setHeader("Location", `/class/${req.params.name}/${req.params.subclass}/add`);
        }
        else {
            res.setHeader("Location", "/class/" + req.body.Klasse + "/add");
        }
        res.end();
    }
    static async editSubclassFeatureForm(req, res) {
        const className = req.params.name;
        const subclassName = req.params.subclass;
        const featureName = req.params.feature;
        const cls = await ClassController.getCls(className);
        const subclass = cls?.Subclasses.find((sub) => sub.Name.toLowerCase() === subclassName.toLowerCase());
        const feature = subclass?.Features.find((f) => f.Name.toLowerCase() === featureName.toLowerCase());
        if (cls && subclass && feature) {
            res.render("edit-class", { feature: feature });
        }
        else {
            res.status(404).send("Unterklasse oder Feature nicht gefunden");
        }
    }
    static async editSubclassFeature(req, res) {
        console.log("Edit Subclass Feature");
        ClassController.editFeature(req, res, true);
    }
    static async editClassFeature(req, res) {
        ClassController.editFeature(req, res, false);
    }
    static async editFeature(req, res, subclass = false) {
        const className = req.params.name;
        const featureName = req.params.feature;
        const { Stufe, HöhereStufe, Referenz, Text } = req.body;
        const classesData = await util_1.Util.readJsonFile(ClassController.jsonFilepath);
        classesData.forEach((cls) => {
            let feature;
            if (cls.Name.toLowerCase() === className.toLowerCase()) {
                if (subclass) {
                    cls.Subclasses.forEach((sub) => {
                        if (sub.Id.toLowerCase() === req.params.subclass.toLowerCase()) {
                            feature = sub.Features.find((f) => f.Name.toLowerCase() === featureName.toLowerCase());
                        }
                    });
                }
                else {
                    feature = cls.Features.find((f) => f.Name.toLowerCase() === featureName.toLowerCase());
                }
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
    static async getEditFeatureForm(req, res) {
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
    static async getSubclassEditFeatureForm(req, res) {
        const className = req.params.name;
        const subclassName = req.params.subclass;
        const featureName = req.params.feature;
        const cls = await ClassController.getCls(className);
        const subclass = cls?.Subclasses.find((sub) => sub.Id.toLowerCase() === subclassName.toLowerCase());
        const feature = subclass?.Features.find((f) => f.Name.toLowerCase() === featureName.toLowerCase());
        if (cls && feature) {
            res.render("edit-class", { feature: feature, subclass: subclass });
        }
        else {
            res.status(404).send("Klasse nicht gefunden");
        }
    }
}
exports.ClassController = ClassController;
ClassController.jsonFilepath = path_1.default.join(__dirname, "../../assets/classes.json");
//# sourceMappingURL=classController.js.map