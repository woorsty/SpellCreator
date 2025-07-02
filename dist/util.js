"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const fs = __importStar(require("fs/promises"));
class Util {
    static async readJsonFile(jsonFilePath) {
        try {
            const fileContent = await fs.readFile(jsonFilePath, "utf-8");
            return JSON.parse(fileContent);
        }
        catch (error) {
            console.error("Fehler beim Lesen der JSON-Datei:", error);
            return [];
        }
    }
    static async writeJsonFile(data, jsonFilePath) {
        try {
            const jsonData = JSON.stringify(data, null, 2);
            await fs.writeFile(jsonFilePath, jsonData, "utf-8");
            console.log("JSON-Datei erfolgreich aktualisiert.");
        }
        catch (error) {
            console.error("Fehler beim Schreiben der JSON-Datei:", error);
        }
    }
    static renderMarkdown(text) {
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
                const strongWord = parts.length > 0 ? `<strong>${parts[0]}</strong>` : "";
                const restOfLine = parts.slice(1).join(" ");
                output += `<li>${strongWord} ${restOfLine}</li>`;
            }
            else if (trimmedLine === "") {
                if (inList) {
                    output += "</ul>";
                    inList = false;
                }
            }
            else if (trimmedLine.startsWith("# ")) {
                if (inList) {
                    output += "</ul>";
                    inList = false;
                }
                output += `<h3>${trimmedLine.substring(2)}</h3>`;
            }
            else if (trimmedLine.startsWith("> ")) {
                if (inList) {
                    output += "</ul>";
                    inList = false;
                }
                output += `<blockquote>${trimmedLine.substring(2)}</blockquote>`;
            }
            else {
                const formattedLine = trimmedLine
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>");
                if (inList) {
                    output += `<p>${formattedLine}</p>`; // Absätze innerhalb von Listenpunkten
                }
                else {
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
exports.Util = Util;
//# sourceMappingURL=util.js.map