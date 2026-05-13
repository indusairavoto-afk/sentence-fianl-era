const fs = require('fs');
const fetch = require('node-fetch').default || require('node-fetch');

(async () => {
    const html = `
    <html><body>
        <main>
        <article data-testid="message"><div data-message-author-role="user">Hello!</div></article>
        <article data-testid="message"><div data-message-author-role="assistant">Hi there!</div></article>
        <article data-testid="message"><div data-message-author-role="user">How are you?</div></article>
        <article data-testid="message"><div data-message-author-role="assistant">Good.</div></article>
        <article data-testid="message"><div data-message-author-role="user">Bye.</div></article>
        <article data-testid="message"><div data-message-author-role="assistant">Bye bye!</div></article>
        </main>
    </body></html>
    `;
    const res = await fetch('http://localhost:3000/api/extract-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html })
    });
    console.log(await res.text());
})();
