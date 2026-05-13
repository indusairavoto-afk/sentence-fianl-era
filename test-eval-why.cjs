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
        let activeSelector = strictSelector;

        return elements.map(el => {
           let badParent = el.closest('nav, aside, [class*="sidebar"], [class*="menu"], header, [class*="header"], .drawer, .drawer-content');
           let badParentHtml = badParent ? badParent.outerHTML.substring(0, 150) : null;
           let tag = el.tagName;
           return { tag, badParentHtml };
        });
    });

    console.log(messagesData);
    await browser.close();
})();
