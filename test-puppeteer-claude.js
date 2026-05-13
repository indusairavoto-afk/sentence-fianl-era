import puppeteer from 'puppeteer';

async function checkBody() {
  const browser = await puppeteer.launch({ headless: true, args: [
    "--no-sandbox", 
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-zygote"
  ] });
  try {
    const page = await browser.newPage();
    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['stylesheet', 'font', 'media'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    try {
      await page.goto('https://claude.ai/login', { waitUntil: "domcontentloaded", timeout: 25000 });
      console.log("Navigated");
      const text = await page.evaluate(() => document.body.innerText);
      console.log("Body length:", text.length, "Sample:", text.substring(0, 100));
    } catch(e) {
      console.log("goto error:", e);
    }
  } finally {
    await browser.close();
  }
}
checkBody().catch(console.error);
