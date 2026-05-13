import puppeteer from 'puppeteer-core';

async function test(url) {
  const browserlessToken = "2UUaQFRvjHXBtgr8fefbc37d4cfbd5740af20de1d8e200498";
  
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessToken}&stealth=true`
  });
  
  let data = "";
  try {
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 35000 });
    data = await page.content();
    console.log(data);
  } catch (error) {
    console.error("Puppeteer fetch failed:", error);
  } finally {
    await browser.close();
  }
}
test("https://chatgpt.com/share/672eb7d8-eb10-800e-ad6d-e9714fe0edc3");
