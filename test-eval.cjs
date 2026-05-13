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
        const genericSelector = '.message, .markdown, .prose, .ProseMirror';
        
        let elements = Array.from(document.querySelectorAll(strictSelector));
        let activeSelector = strictSelector;

        if (elements.length === 0) {
            elements = Array.from(document.querySelectorAll(genericSelector));
            activeSelector = genericSelector;
        }

       // Filter out nested matching elements to avoid duplicate extractions
        let topLevelElements = elements.filter((el) => {
          if (
            el.closest(
              'nav, aside, [class*="sidebar"], [class*="menu"], header, [class*="header"], .drawer, .drawer-content',
            )
          )
            return false;
          let parent = el.parentElement;
          while (parent) {
            if (parent.matches && parent.matches(activeSelector)) {
              return false;
            }
            parent = parent.parentElement;
          }
          return true;
        });

        return topLevelElements.map(el => {
           const classList = el.className;
           const text = (el.innerText || el.textContent || '').substring(0, 50).replace(/\n/g, ' ');
           
           let role = el.getAttribute("data-message-author-role");
            if (!role) {
              const childWithRole = el.querySelector(
                "[data-message-author-role]",
              );
              if (childWithRole) {
                role = childWithRole.getAttribute("data-message-author-role");
              }
            }
            
            if (!role) {
              const cls = typeof el.className === "string" ? el.className.toLowerCase() : "";
              const testId = (el.getAttribute("data-testid") || "").toLowerCase();
              
              if (cls.match(/(^|\s|-|_)(user|human|message-in|query|user-query)(\s|-|_|$)/i)) role = 'user';
              else if (cls.match(/(^|\s|-|_)(assistant|bot|ai|claude|prose|ProseMirror|message-out|model|model-response|gemini|chatgpt|response-container|message-content|grok)(\s|-|_|$)/i)) role = 'assistant';
            }

            if(!role){
              const tag = el.tagName.toLowerCase();
              if (tag === 'article' || tag.includes('message')) {
                // heuristic based on role missing but it is a top level...
              }
            }

           return { role, text, tag: el.tagName };
        });
    });

    console.log(messagesData);
    await browser.close();
})();
