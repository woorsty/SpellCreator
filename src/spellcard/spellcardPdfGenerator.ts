import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Spell } from "../spell/spellModel";

export type Spellcard = {
  title: string;
  body: string;
  headerLines: string[];
};

const CARD_WIDTH = 63;
const CARD_HEIGHT = 88;
const PAGE_MARGIN_X = 10;
const PAGE_MARGIN_Y = 10;
const GAP_X = 0;
const GAP_Y = 0;

const MAX_CHARACTERS_PER_CARD = 700; // abhängig von Schriftgröße etc.

export function splitSpellIntoCards(spell: Spell): Spellcard[] {
  const headerLines = [
    `Stufe: ${spell.Stufe}`,
    `Schule: ${spell.Schule}`,
    `Zeitaufwand: ${spell.Zeitaufwand}`,
    `Reichweite: ${spell.Reichweite}`,
    `Dauer: ${spell.Dauer}`,
    `Komponenten: ${[
      spell.Verbal ? "V" : "",
      spell.Gestik ? "G" : "",
      spell.Material || "",
    ]
      .filter((x) => x)
      .join(", ")}`,
    `Klassen: ${spell.Klasse.join(", ")}`,
    spell.Konzentration ? "Konzentration" : "",
    spell.Ritual ? "Ritualzauber" : "",
  ].filter(Boolean);

  const clean = (s: string) =>
    s
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

  const cards: Spellcard[] = [];
  let currentBody = "";
  let part = 1;

  for (const sentence of paragraphs) {
    if (
      (currentBody + sentence).length > MAX_CHARACTERS_PER_CARD &&
      currentBody
    ) {
      cards.push({
        title: cards.length === 0 ? spell.Name : `${spell.Name} (Teil ${part})`,
        body: currentBody.trim(),
        headerLines,
      });
      part++;
      currentBody = "";
    }
    currentBody += sentence + " ";
  }

  if (currentBody.trim()) {
    cards.push({
      title: cards.length === 0 ? spell.Name : `${spell.Name} (Teil ${part})`,
      body: currentBody.trim(),
      headerLines,
    });
  }

  return cards;
}

export function generateCardPDF(spells: Spell[]): jsPDF {
  const doc = new jsPDF();

  const allCards: Spellcard[] = [];
  for (const spell of spells) {
    const parts = splitSpellIntoCards(spell);
    allCards.push(...parts);
  }

  allCards.forEach((card, i) => {
    const posInPage = i % 9;
    const pageIndex = Math.floor(i / 9);
    const row = Math.floor(posInPage / 3);
    const col = posInPage % 3;

    if (posInPage === 0 && i > 0) doc.addPage();

    const x = PAGE_MARGIN_X + col * (CARD_WIDTH + GAP_X);
    const y = PAGE_MARGIN_Y + row * (CARD_HEIGHT + GAP_Y);

    drawCard(doc, card, x, y, CARD_WIDTH, CARD_HEIGHT);
  });

  return doc;
}

function drawCard(
  doc: jsPDF,
  card: Spellcard,
  x: number,
  y: number,
  width: number,
  height: number
) {
  doc.setDrawColor(0);
  doc.rect(x, y, width, height);

  let cursorY = y + 5;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(card.title, x + width / 2, cursorY, { align: "center" });
  cursorY += 4;

  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  for (const line of card.headerLines) {
    doc.text(line, x + 2, cursorY);
    cursorY += 3;
  }

  cursorY += 1;

  const textLines = doc.splitTextToSize(card.body, width - 4);
  doc.setFontSize(6);
  doc.setFont("helvetica", "italic");
  doc.text(textLines, x + 2, cursorY);
}
