import fs from 'fs';

let serverCode = fs.readFileSync('server.ts', 'utf8');

// remove puppeteer imports
serverCode = serverCode.replace(/import puppeteer from "puppeteer-extra";\n/, '');
serverCode = serverCode.replace(/import StealthPlugin from "puppeteer-extra-plugin-stealth";\n/, '');

// remove stealth setup
serverCode = serverCode.replace(/const stealth = StealthPlugin\(\);\nstealth\.enabledEvasions\.delete\("iframe\.contentWindow"\);\npuppeteer\.use\(stealth\);\n/, '');

// Now we need to remove extractChatWithImages
// We can find its start and just replace it with empty... but since we don't know the exact end, 
// we will just comment out the body if it fails or regex it. It is bounded by \n\napp.post("/api/extract", ...);
const startMatch = /async function extractChatWithImages\([\s\S]*?\)\s*\{/;
const match = startMatch.exec(serverCode);
if (match) {
  const startIndex = match.index;
  // find the NEXT app.post("/api/extract"
  const endIndex = serverCode.indexOf('app.post("/api/extract",', startIndex);
  if (endIndex > -1) {
    serverCode = serverCode.substring(0, startIndex) + serverCode.substring(endIndex);
  }
}

fs.writeFileSync('server.ts', serverCode);
console.log('Removed puppeteer and extractChatWithImages');
