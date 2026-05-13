import fs from 'fs';

const html = fs.readFileSync('chatgpt-test.html', 'utf8');

const regex = /"parts"/g;
let count = 0;
while (regex.exec(html) !== null) {
  count++;
}
console.log("Found 'parts':", count);

const firstMatch = html.indexOf('"parts"');
if (firstMatch > -1) {
  console.log(html.substring(firstMatch - 50, firstMatch + 500));
}

