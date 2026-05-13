import puppeteer from 'puppeteer-core';
import * as cheerio from 'cheerio';

async function test(url) {
  const browserlessToken = "2UUaQFRvjHXBtgr8fefbc37d4cfbd5740af20de1d8e200498";
  
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessToken}&stealth=true`
  });
  
  let data = "";
  try {
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    await page.setExtraHTTPHeaders({
       "Accept-Language": "en-US,en;q=0.9",
    });
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
    try {
      await page.waitForSelector('[data-message-author-role]', { timeout: 10000 });
    } catch(e) {
      console.log("Timeout waiting for selector");
    }
    data = await page.content();
    console.log("data length:", data.length);
    console.log("has auth-role?", data.includes('data-message-author-role'));
    console.log("Extracted roles:", cheerio.load(data)('[data-message-author-role]').length);
  } catch (error) {
    console.error("Puppeteer fetch failed:", error);
  } finally {
    await browser.close();
  }
}
test("https://chatgpt.com/share/672eb7d8-eb10-800e-ad6d-e9714fe0edc3");
