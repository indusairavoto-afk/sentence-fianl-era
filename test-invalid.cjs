const puppeteer = require('puppeteer-core');
async function run() {
  const browserlessToken = "INVALID_TOKEN";
  try {
    const browser = await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessToken}&stealth=true`
    });
    console.log("Connected!");
    await browser.close();
  } catch(e) {
    console.error("Error:", e.message);
  }
}
run();
