import express, { Request, Response } from "express";
import path from "path";
import bodyParser from "body-parser";
import ejs from "ejs";
import spellRoutes from "./spell/spellRoute";
import invocationRoutes from "./anrufung/invocationRoute";
import spellCardRoutes from "./spellcard/spellcardRoute";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views")); // Pfad zum 'views'-Ordner

app.get("/", (req: Request, res: Response) => {
  res.send(
    '<a href="/spell">Zauber</a>' +
      "<br/>" +
      '<a href="/invocation/">Hexenmeister: Schauerliche Anrufung</a>'
  );
});

app.use(express.json());
app.use("/spell", spellRoutes);
app.use("/invocation", invocationRoutes);
app.use("/spellcard", spellCardRoutes);
// app.use("/", express.static(path.join(__dirname, "../public"))); // Statischer Ordner
app.use("/", express.static(path.join(__dirname, "./main"))); // Statischer Ordner

app.listen(port, "::", () => {
  console.log(`Server läuft auf http://0.0.0.0:${port}`);
});
