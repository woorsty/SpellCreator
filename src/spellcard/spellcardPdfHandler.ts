import express, { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { Spell } from "../spell/spellModel";

export function generateCardPDF(spells: Spell[], res: Response): void {
  const doc = new PDFDocument({
    size: "A4",
    margin: 20,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=zauberkarten.pdf");
  doc.pipe(res);

  const cardWidth = 179; // ≈ 63 mm
  const cardHeight = 252; // ≈ 88 mm
  const gapX = 10;
  const gapY = 10;

  const cardsPerRow = 3;
  const cardsPerCol = 3;
  const cardsPerPage = cardsPerRow * cardsPerCol;

  spells.forEach((spell, index) => {
    const pageIndex = Math.floor(index / cardsPerPage);
    const positionInPage = index % cardsPerPage;

    const row = Math.floor(positionInPage / cardsPerRow);
    const col = positionInPage % cardsPerRow;

    if (positionInPage === 0 && index > 0) {
      doc.addPage();
    }

    const x = 20 + col * (cardWidth + gapX);
    const y = 20 + row * (cardHeight + gapY);

    const parts = drawCardMultiPage(doc, spell, x, y, cardWidth, cardHeight);
  });

  doc.end();
}

function drawCard(
  doc: PDFKit.PDFDocument,
  spell: Spell,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  doc.rect(x, y, w, h).stroke();

  const padding = 6;
  const innerX = x + padding;
  const innerY = y + padding;
  const innerW = w - 2 * padding;

  doc.fontSize(11).font("Helvetica-Bold").text(spell.Name, innerX, innerY, {
    width: innerW,
    align: "center",
  });

  doc.moveDown(0.2);
  doc
    .fontSize(8)
    .font("Helvetica")
    .text(`Stufe: ${spell.Stufe} — ${spell.Schule}`, innerX, doc.y, {
      width: innerW,
      align: "center",
    });

  doc.moveDown(0.3);
  doc
    .fontSize(7)
    .text(
      `Zeit: ${spell.Zeitaufwand}\nReichweite: ${spell.Reichweite}\nDauer: ${spell.Dauer}`,
      innerX,
      doc.y,
      { width: innerW }
    );

  if (spell.Material) {
    doc.text(`Material: ${spell.Material}`, innerX, doc.y, { width: innerW });
  }

  doc.moveDown(0.2);
  doc.font("Helvetica-Oblique").text(cleanText(spell.Text), innerX, doc.y, {
    width: innerW,
  });

  if (spell.HöhereLevel) {
    doc.moveDown(0.2);
    doc
      .font("Helvetica-Bold")
      .text("Auf höheren Stufen:", innerX, doc.y, { width: innerW });
    doc.font("Helvetica").text(spell.HöhereLevel, innerX, doc.y, {
      width: innerW,
    });
  }
}

function cleanText(text: string): string {
  return text
    .replace(/\r\n|\r/g, "\n") // Windows/mac Zeilenumbrüche → Unix
    .replace(/[^\x00-\x7FäöüÄÖÜßéèêáàâîïçñëÉÊÀÂÇÑ]/g, "") // „Ð“ u.ä. raus
    .trim();
}

function drawCardMultiPage(
  doc: PDFKit.PDFDocument,
  spell: Spell,
  x: number,
  y: number,
  w: number,
  h: number
): number {
  const padding = 6;
  const innerX = x + padding;
  const innerY = y + padding;
  const innerW = w - 2 * padding;
  const innerH = h - 2 * padding;

  // Fester Textblock für Kopfbereich (Name, Stufe, Dauer, etc.)
  const headerLines = [
    { text: spell.Name, font: "Helvetica-Bold", size: 11, align: "center" },
    {
      text: `Stufe: ${spell.Stufe} — ${spell.Schule}`,
      font: "Helvetica",
      size: 8,
      align: "center",
    },
    {
      text: `Zeit: ${spell.Zeitaufwand}`,
      font: "Helvetica",
      size: 7,
      align: "left",
    },
    {
      text: `Reichweite: ${spell.Reichweite}`,
      font: "Helvetica",
      size: 7,
      align: "left",
    },
    {
      text: `Dauer: ${spell.Dauer}`,
      font: "Helvetica",
      size: 7,
      align: "left",
    },
    spell.Material && {
      text: `Material: ${spell.Material}`,
      font: "Helvetica",
      size: 7,
      align: "left",
    },
  ].filter(Boolean) as {
    text: string;
    font: string;
    size: number;
    align: "left" | "center";
  }[];

  // Text vorbereiten
  const clean = (s: string) =>
    s
      .replace(/\r\n|\r/g, "\n")
      .replace(/[^\x00-\x7FäöüÄÖÜßéèêáàâîïçñëÉÊÀÂÇÑ]/g, "")
      .trim();

  const fullText =
    clean(spell.Text) +
    (spell.HöhereLevel
      ? `\n\nAuf höheren Stufen:\n${clean(spell.HöhereLevel)}`
      : "");

  const partTexts: string[] = [];

  // 1. Zeichne Header einmal & berechne seine Höhe
  doc.save(); // Reset später
  doc.fontSize(11).font("Helvetica-Bold");
  let currentY = innerY;
  for (const line of headerLines) {
    doc.font(line.font).fontSize(line.size);
    const h = doc.heightOfString(line.text, { width: innerW });
    currentY += h;
  }
  doc.restore();

  const availableHeight = innerH - (currentY - innerY);

  // 2. Text aufteilen
  const words = fullText.split(" ");
  let currentPart = "";
  let part = 1;
  doc.font("Helvetica-Oblique").fontSize(7);

  for (let i = 0; i < words.length; i++) {
    const test = currentPart + words[i] + " ";
    const h = doc.heightOfString(test, { width: innerW });

    if (h > availableHeight) {
      partTexts.push(currentPart.trim());
      currentPart = words[i] + " ";
      part++;
    } else {
      currentPart = test;
    }
  }
  if (currentPart.trim().length > 0) partTexts.push(currentPart.trim());

  // 3. Zeichne Karten für jeden Teil
  for (let i = 0; i < partTexts.length; i++) {
    if (i > 0) doc.addPage();
    doc.rect(x, y, w, h).stroke();

    let cursorY = innerY;

    for (const line of headerLines) {
      doc.font(line.font).fontSize(line.size);
      doc.text(line.text, innerX, cursorY, {
        width: innerW,
        align: line.align,
      });
      cursorY = doc.y;
    }

    // Teilnummer anzeigen, wenn mehrere Seiten
    if (partTexts.length > 1) {
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .text(`Teil ${i + 1}/${partTexts.length}`, innerX, cursorY + 4, {
          width: innerW,
          align: "center",
        });
      cursorY = doc.y + 4;
    }

    doc.font("Helvetica-Oblique").fontSize(7);
    doc.text(partTexts[i], innerX, cursorY, {
      width: innerW,
    });
  }

  return partTexts.length; // wichtig für Positionierung
}
