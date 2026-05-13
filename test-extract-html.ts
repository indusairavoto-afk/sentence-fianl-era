import { readFileSync } from 'fs';
// We need to test the extraction function so we'll just require it from server.ts compiled or we'll copy it.
// Actually, since server.ts is esm and has imports, I will just copy the extraction logic for testing.
// Or I can hit the api endpoint with the html directly!
const html = readFileSync('chatgpt-test2.html', 'utf8');

fetch('http://localhost:3000/api/extract-html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html })
})
.then(res => res.json().then(j => console.log(res.status, j)));
