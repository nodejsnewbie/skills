const fs = require("fs");

function betterExtract(xmlPath) {
  const xml = fs.readFileSync(xmlPath, "utf8");
  const paragraphs = xml.split("</w:p>");
  const result = [];
  for (const p of paragraphs) {
    const regex = /<w:t[ >][\s\S]*?<\/w:t>|<w:t>([\s\S]*?)<\/w:t>/g;
    const simpleRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
    let pText = "";
    let match;
    while ((match = simpleRegex.exec(p)) !== null) {
      pText += match[1];
    }
    if (pText)
      result.push(
        pText
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">"),
      );
  }
  return result.join("\n");
}

console.log(betterExtract(process.argv[2]));
