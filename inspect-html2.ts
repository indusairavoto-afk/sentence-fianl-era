import fs from 'fs';
const html = fs.readFileSync('chatgpt-test.html', 'utf8');

// The original URL was: https://chatgpt.com/share/6a0201c7-9b00-83e8-93af-68e2
// It was fetched and saved in chatgpt-test.html

// Let's search the HTML string for a known term from that chat, or just "message"
console.log("IndexOf 'message':", html.indexOf('message'));
console.log("IndexOf 'content':", html.indexOf('content'));
console.log("Does it contain data-message-author-role?", html.indexOf('data-message-author-role'));

// I'll grab some text from the end of the JSON to see if there's encoded data.
