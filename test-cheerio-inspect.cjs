const fs = require('fs');
const html = fs.readFileSync('chatgpt-test.html', 'utf8');
const cheerio = require('cheerio');
const $ = cheerio.load(html);

console.log("Title:", $('title').text());
const txt = $('body').text().replace(/\s+/g, ' ');
console.log("Body text length:", txt.length);
console.log("Body sample:", txt.substring(0, 1000));


