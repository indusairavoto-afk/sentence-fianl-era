const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

(async () => {
  const browserlessToken = "2UUaQFRvjHXBtgr8fefbc37d4cfbd5740af20de1d8e200498";
  const browser = await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessToken}`
  });
  
  try {
    const page2 = await browser.newPage();
    await page2.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    await page2.goto("https://chatgpt.com/share/672eb7d8-eb10-800e-ad6d-e9714fe0edc3", { waitUntil: "networkidle2", timeout: 45000 });
    console.log("Screenshot Link Title:", await page2.title());
    const html = await page2.content();
    require('fs').writeFileSync('chatgpt-test2.html', html);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await browser.close();
  }
})();
