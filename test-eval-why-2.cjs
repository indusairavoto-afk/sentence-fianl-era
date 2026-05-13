const fs = require('fs');
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('file://' + __dirname + '/chatgpt-share-dump.html');
    
    const messagesData = await page.evaluate(() => {
        const strictSelector = '[data-message-author-role], [data-testid="message"], article, .font-claude-message, .font-user-message, .message-row, .message-bubble, user-query, model-response, .user-query, .model-response, response-container, message-content, .chat-message';
        let elements = Array.from(document.querySelectorAll(strictSelector));

        return elements.map(el => {
           let badParent = el.closest('nav, aside, [class*="sidebar"], [class*="menu"], header, [class*="header"], .drawer, .drawer-content');
           return { tag: badParent ? badParent.tagName : null, klass: badParent ? badParent.className : null };
        });
    });

    console.log(messagesData);
    await browser.close();
})();
