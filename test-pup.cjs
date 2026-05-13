const puppeteer = require('puppeteer-core');
async function run() {
  const browserlessToken = "2UUaQFRvjHXBtgr8fefbc37d4cfbd5740af20de1d8e200498";
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
