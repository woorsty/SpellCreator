"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const spellRoute_1 = __importDefault(require("./spell/spellRoute"));
const invocationRoute_1 = __importDefault(require("./anrufung/invocationRoute"));
const spellcardRoute_1 = __importDefault(require("./spellcard/spellcardRoute"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "../views")); // Pfad zum 'views'-Ordner
app.get("/", (req, res) => {
    res.send('<a href="/spell">Zauber</a>' +
        "<br/>" +
        '<a href="/invocation/">Hexenmeister: Schauerliche Anrufung</a>' +
        "<br/>" +
        '<a href="/spellcard/">Zauberkarten</a>');
});
app.use(express_1.default.json());
app.use("/spell", spellRoute_1.default);
app.use("/invocation", invocationRoute_1.default);
app.use("/spellcard", spellcardRoute_1.default);
// app.use("/", express.static(path.join(__dirname, "../public"))); // Statischer Ordner
app.use("/", express_1.default.static(path_1.default.join(__dirname, "./main"))); // Statischer Ordner
app.listen(port, "::", () => {
    console.log(`Server läuft auf http://0.0.0.0:${port}`);
});
//# sourceMappingURL=server.js.map