const AdmZip = require('adm-zip');
const fs = require('fs');

function betterExtract(xml) {
    const paragraphs = xml.split('</w:p>');
    const result = [];
    for (const p of paragraphs) {
        const simpleRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
        let pText = '';
        let match;
        while ((match = simpleRegex.exec(p)) !== null) {
            pText += match[1];
        }
        if (pText) result.push(pText.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    }
    return result.join('\n');
}

const zip = new AdmZip(process.argv[2]);
const xml = zip.readAsText('word/document.xml');
fs.writeFileSync(process.argv[3], betterExtract(xml), 'utf8');
