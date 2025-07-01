"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitSpellIntoCards = splitSpellIntoCards;
exports.generateCardPDF = generateCardPDF;
const jspdf_1 = require("jspdf");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const CARD_WIDTH = 63;
const CARD_HEIGHT = 88;
const PAGE_MARGIN_X = 10;
const PAGE_MARGIN_Y = 10;
const GAP_X = 0;
const GAP_Y = 0;
const MAX_CHARACTERS_PER_CARD = 800; // abhängig von Schriftgröße etc.
const MAX_CHARACTERS_PER_CARD_WITHOUT_HEADER = 1250; // für Karten ohne Header
function splitSpellIntoCards(spell) {
    const clean = (s) => s
        .replace(/\r\n|\r/g, "\n")
        .replace(/[^.replace(/[^\x00-\x7FäöüÄÖÜßéèêáàâîïçñëÉÊÀÂÇÑ]/g, "")
        .trim();
    const fullText = [
        clean(spell.Text),
        spell.HöhereLevel ? `Auf höheren Stufen: ${clean(spell.HöhereLevel)}` : "",
    ]
        .filter(Boolean)
        .join("\n\n");
    const paragraphs = fullText.replace(/\r?\n/g, " ").split(/(?<=\.|\!|\?)\s+/);
    const cards = [];
    let currentBody = "";
    let part = 1;
    for (const sentence of paragraphs) {
        const fullLength = currentBody.length + sentence.length;
        if (((part === 1 && fullLength > MAX_CHARACTERS_PER_CARD) ||
            fullLength > MAX_CHARACTERS_PER_CARD_WITHOUT_HEADER) &&
            currentBody) {
            cards.push({
                title: cards.length === 0 ? spell.Name : `${spell.Name} (Teil ${part})`,
                index: part,
                body: currentBody.trim(),
                stufe: spell.Stufe,
                komponenten: {
                    verbal: spell.Verbal,
                    gestik: spell.Gestik,
                    material: spell.Material || "",
                },
                klasse: spell.Klasse,
                konzentration: spell.Konzentration,
                ritual: spell.Ritual,
                schule: spell.Schule,
                zeitaufwand: spell.Zeitaufwand,
                reichweite: spell.Reichweite,
                dauer: spell.Dauer,
            });
            part++;
            currentBody = "";
        }
        currentBody += sentence + " ";
    }
    if (currentBody.trim()) {
        cards.push({
            title: cards.length === 0 ? spell.Name : `${spell.Name} (Teil ${part})`,
            index: part,
            body: currentBody.trim(),
            stufe: spell.Stufe,
            komponenten: {
                verbal: spell.Verbal,
                gestik: spell.Gestik,
                material: spell.Material || "",
            },
            klasse: spell.Klasse,
            konzentration: spell.Konzentration,
            ritual: spell.Ritual,
            schule: spell.Schule,
            zeitaufwand: spell.Zeitaufwand,
            reichweite: spell.Reichweite,
            dauer: spell.Dauer,
        });
    }
    return cards;
}
function generateCardPDF(spells) {
    const doc = new jspdf_1.jsPDF();
    const allCards = [];
    for (const spell of spells) {
        const parts = splitSpellIntoCards(spell);
        allCards.push(...parts);
    }
    allCards.forEach((card, i) => {
        const posInPage = i % 9;
        const pageIndex = Math.floor(i / 9);
        const row = Math.floor(posInPage / 3);
        const col = posInPage % 3;
        if (posInPage === 0 && i > 0)
            doc.addPage();
        const x = PAGE_MARGIN_X + col * (CARD_WIDTH + GAP_X);
        const y = PAGE_MARGIN_Y + row * (CARD_HEIGHT + GAP_Y);
        drawCard(doc, card, x, y, CARD_WIDTH, CARD_HEIGHT);
    });
    return doc;
}
function drawCard(doc, card, x, y, width, height) {
    doc.setDrawColor(0);
    doc.rect(x, y, width, height);
    let cursorY = y + 5;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(card.title, x + width / 2, cursorY, { align: "center" });
    cursorY += 4;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text((card.stufe == 0 ? "Zaubertrick der " : `Stufe ${card.stufe} `) +
        card.schule, x + width / 2, cursorY, { align: "center" });
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    const classesText = card.klasse.join(", ");
    const classLines = doc.splitTextToSize(classesText, width - 4);
    for (const line of classLines) {
        cursorY += 3;
        doc.text(line, x + width / 2, cursorY, { align: "center" });
    }
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    x += 2;
    if (card.index == 1) {
        x -= 2;
        cursorY += 3;
        let subline3 = "";
        if (card.ritual) {
            subline3 += "Ritual";
        }
        if (card.konzentration) {
            if (subline3.length > 0) {
                subline3 += ", ";
            }
            subline3 += "Konzentration";
        }
        if (subline3.length === 0) {
            cursorY += 3;
            doc.text(subline3, x + width / 2, cursorY, { align: "center" });
        }
        x += 2;
        doc.setFontSize(6);
        cursorY += 3;
        const rangeIcon = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../assets/icons/25px-Range_icon.png"));
        doc.addImage(rangeIcon, "PNG", x, cursorY - 3, 4, 4);
        doc.text(card.reichweite, x + 4, cursorY);
        cursorY += 3;
        doc.text("Dauer: " + card.dauer, x, cursorY);
        cursorY += 3;
        doc.text("Komponenten:", x, cursorY);
        let componentsText = card.komponenten.verbal ? "Verbal" : "";
        if (componentsText.length > 0) {
            componentsText += ", ";
        }
        componentsText += card.komponenten.gestik ? "Gestik" : "";
        if (componentsText.length > 0) {
            componentsText += ", ";
        }
        componentsText += card.komponenten.material
            ? card.komponenten.material
            : "";
        const componentLines = doc.splitTextToSize(componentsText, width - 4);
        for (const line of componentLines) {
            cursorY += 3;
            doc.text(line, x, cursorY);
        }
    }
    cursorY += 5;
    doc.setFontSize(7);
    const textLines = doc.splitTextToSize(card.body, width - 4);
    doc.setFont("helvetica", "italic");
    doc.text(textLines, x, cursorY);
    printPropertyLine(doc, card, x, y + height - 2, width);
}
function printPropertyLine(doc, card, x, y, width) {
    let coursorX = x;
    if (card.zeitaufwand === "Aktion") {
        addHorizontalIcon(doc, "../assets/icons/34px-Action_Icon.png", coursorX, y);
        addHorizontalText(doc, "Aktion", coursorX + 4, y);
    }
    else if (card.zeitaufwand === "Bonusaktion") {
        addHorizontalIcon(doc, "../assets/icons/34px-Bonus_Action_Icon.png", coursorX, y);
        addHorizontalText(doc, "Bonusaktion", coursorX + 4, y);
    }
    else {
        addHorizontalText(doc, card.zeitaufwand, coursorX + 4, y);
    }
    coursorX += card.zeitaufwand.length * 1 + 2;
    if (card.ritual) {
        addHorizontalIcon(doc, "../assets/icons/Ritual_Spell_Icon.png", x + width / 2 - 10, y);
        addHorizontalText(doc, "Ritual", x + width / 2 - 6, y);
    }
    if (card.konzentration) {
        addHorizontalIcon(doc, "../assets/icons/25px-Concentration_Icon.png", x + width - 24, y);
        addHorizontalText(doc, "Konzentration", x + width - 20, y);
    }
}
function addHorizontalIcon(doc, iconPath, x, y) {
    const icon = fs_1.default.readFileSync(path_1.default.resolve(__dirname, iconPath));
    doc.addImage(icon, "PNG", x, y - 3, 4, 4);
    x += 4;
}
function addHorizontalText(doc, text, x, y) {
    doc.text(text, x, y);
}
