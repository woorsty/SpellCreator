export class MarkdownService {
  public static renderMarkdown(text: string) {
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
