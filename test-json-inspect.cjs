const fs = require('fs');
const html = fs.readFileSync('chatgpt-test2.html', 'utf8');
const cheerio = require('cheerio');
const $ = cheerio.load(html);

// Remove scripts and styles
$('script, style, noscript').remove();

const txt = $('body').text().replace(/\s+/g, ' ');
console.log("Clean body sample length:", txt.length);
console.log("Clean body sample:", txt.substring(0, 500));



