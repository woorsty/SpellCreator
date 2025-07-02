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
const MAX_LINES_PER_CARD = 19;
const MAX_LINES_PER_CARD_WITHOUT_HEADER = 24;
function splitSpellIntoCards(spell) {
    const fullText = spell.Text +
        (spell.HöhereLevel
            ? "\r\nAuf höheren Stufen: " + (spell.HöhereLevel || "")
            : "");
    const lines = fullText.split(/(?<=\n)/);
    const cards = [];
    addCardLines(cards, lines, spell);
    return cards;
}
function addCardLines(cards, paragraphs, spell) {
    let currentBody = "";
    let part = 1;
    for (const line of paragraphs) {
        const newBody = currentBody + line;
        const lineCount = estimateRenderedLineCount(newBody); // wie vorher
        if (((part === 1 && lineCount > MAX_LINES_PER_CARD) ||
            lineCount > MAX_LINES_PER_CARD_WITHOUT_HEADER) &&
            currentBody.trim()) {
            cards.push({
                title: cards.length === 0 ? spell.Name : `${spell.Name} Teil ${part}`,
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
        currentBody += line;
    }
    if (currentBody.trim()) {
        cards.push({
            title: cards.length === 0 ? spell.Name : `${spell.Name} Teil ${part}`,
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
}
function estimateRenderedLineCount(text, maxLineLength = 50) {
    const lines = text.split("\n");
    let totalLines = 0;
    for (const line of lines) {
        const words = line.trim().split(/\s+/);
        let currentLength = 0;
        for (const word of words) {
            if (currentLength + word.length + 1 > maxLineLength) {
                totalLines++;
                currentLength = word.length;
            }
            else {
                currentLength += word.length + 1;
            }
        }
        totalLines++; // Für die aktuelle Zeile oder Leerzeile
    }
    return totalLines;
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
    const titleText = card.title;
    const tileLines = doc.splitTextToSize(titleText, width - 4);
    for (const line of tileLines) {
        doc.text(line, x + width / 2, cursorY, { align: "center" });
        cursorY += 4;
    }
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(card.stufe == 0
        ? `Zaubertrick der ${card.schule}`
        : `${card.schule}zauber ${card.stufe}. Grades`, x + width / 2, cursorY, { align: "center" });
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
    x;
    if (card.index == 1) {
        doc.setFontSize(6);
        cursorY += 4;
        const rangeIcon = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../assets/icons/25px-Range_icon.png"));
        doc.addImage(rangeIcon, "PNG", x + 10, cursorY - 3, 4, 4);
        doc.text(card.reichweite, x + 14, cursorY);
        const durationIcon = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../assets/icons/25px-Duration_icon.png"));
        doc.addImage(durationIcon, "PNG", x + width / 2 - 2, cursorY - 3, 4, 4);
        doc.text(card.dauer, x + width / 2 + 2, cursorY);
        cursorY += 5;
        const imagePositions3 = [
            x + width / 2 - 9,
            x + width / 2 - 3,
            x + width / 2 + 3,
        ];
        const imagePositions2 = [x + width / 2 - 6, x + width / 2];
        const imagePositions1 = [imagePositions3[1]];
        const imagePositions = [imagePositions1, imagePositions2, imagePositions3];
        let componentCounter = -1;
        componentCounter += card.komponenten.verbal ? 1 : 0;
        componentCounter += card.komponenten.gestik ? 1 : 0;
        componentCounter += card.komponenten.material ? 1 : 0;
        let counter = 0;
        if (card.komponenten.verbal) {
            addHorizontalIcon(doc, "../assets/icons/Persuasion_Icon.png", imagePositions[componentCounter][counter++], cursorY);
        }
        if (card.komponenten.gestik) {
            addHorizontalIcon(doc, "../assets/icons/Intimidation_Icon.png", imagePositions[componentCounter][counter++], cursorY);
        }
        if (card.komponenten.material) {
            addHorizontalIcon(doc, "../assets/icons/Medicine_Icon.png", imagePositions[componentCounter][counter++], cursorY);
            doc.setFontSize(6);
            cursorY += 3;
            const componentLines = doc.splitTextToSize(card.komponenten.material, width - 4);
            for (const line of componentLines) {
                doc.text(line, x + width / 2, cursorY, { align: "center" });
                cursorY += 3;
            }
            cursorY += 2;
        }
        else {
            cursorY += 5;
        }
    }
    else {
        cursorY += 6;
    }
    doc.setFontSize(7);
    const textLines = doc.splitTextToSize(card.body, width - 4);
    doc.setFont("helvetica", "italic");
    doc.text(textLines, x + 2, cursorY);
    printPropertyLine(doc, card, x + 2, y + height - 2, width);
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
    else if (card.zeitaufwand === "Reaktion") {
        addHorizontalIcon(doc, "../assets/icons/23px-Reaction_Icon.png", coursorX, y);
        addHorizontalText(doc, "Reaktion", coursorX + 4, y);
    }
    else {
        addHorizontalText(doc, card.zeitaufwand, coursorX, y);
    }
    coursorX += card.zeitaufwand.length * 1 + 2;
    if (card.ritual) {
        addHorizontalIcon(doc, "../assets/icons/Ritual_Spell_Icon.png", x + width / 2 - 11, y);
        addHorizontalText(doc, "Ritual", x + width / 2 - 6, y);
    }
    if (card.konzentration) {
        addHorizontalIcon(doc, "../assets/icons/25px-Concentration_Icon.png", x + width - 25, y);
        addHorizontalText(doc, "Konzentration", x + width - 20, y);
    }
}
function addHorizontalIcon(doc, iconPath, x, y) {
    const icon = fs_1.default.readFileSync(path_1.default.resolve(__dirname, iconPath));
    doc.addImage(icon, "PNG", x, y - 3, 4, 4);
}
function addHorizontalText(doc, text, x, y) {
    doc.text(text, x, y);
}
//# sourceMappingURL=spellcardPdfGenerator.js.map