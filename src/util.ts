import * as fs from "fs/promises";
import { Model } from "./util/modelData";

export class Util {
  static async readJsonFile<TYPE extends Model>(
    jsonFilePath: string
  ): Promise<TYPE[]> {
    try {
      const fileContent = await fs.readFile(jsonFilePath, "utf-8");
      return JSON.parse(fileContent) as TYPE[];
    } catch (error) {
      console.error("Fehler beim Lesen der JSON-Datei:", error);
      return [];
    }
  }

  static async writeJsonFile(
    data: Model[],
    jsonFilePath: string
  ): Promise<void> {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(jsonFilePath, jsonData, "utf-8");
      console.log("JSON-Datei erfolgreich aktualisiert.");
    } catch (error) {
      console.error("Fehler beim Schreiben der JSON-Datei:", error);
    }
  }

  static renderMarkdown(text: string) {
    const lines = text.split("\n");
    let output = "<div>";
    let inList = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("- ")) {
        if (!inList) {
          output += "<ul>";
          inList = true;
        }
        const parts = trimmedLine.substring(2).split(" ");
        const strongWord =
          parts.length > 0 ? `<strong>${parts[0]}</strong>` : "";
        const restOfLine = parts.slice(1).join(" ");
        output += `<li>${strongWord} ${restOfLine}</li>`;
      } else if (trimmedLine === "") {
        if (inList) {
          output += "</ul>";
          inList = false;
        }
      } else if (trimmedLine.startsWith("# ")) {
        if (inList) {
          output += "</ul>";
          inList = false;
        }
        output += `<h3>${trimmedLine.substring(2)}</h3>`;
      } else if (trimmedLine.startsWith("> ")) {
        if (inList) {
          output += "</ul>";
          inList = false;
        }
        output += `<blockquote>${trimmedLine.substring(2)}</blockquote>`;
      } else {
        const formattedLine = trimmedLine
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>");
        if (inList) {
          output += `<p>${formattedLine}</p>`; // Absätze innerhalb von Listenpunkten
        } else {
          output += `<p>${formattedLine}</p>`;
        }
      }
    }

    if (inList) {
      output += "</ul>";
    }

    output += "</div>";
    return output
      .replace(/^<div><p><\/p>/, "<div>")
      .replace(/<p><\/p><\/div>$/, "</div>"); // Entferne leere <p> am Anfang/Ende
  }
}
