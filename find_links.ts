import * as cheerio from "cheerio";

async function fetchAndFind() {
  const q = "https://x.com/search?q=%22chatgpt.com%2Fshare%2F%22&f=live";
  // X doesn't allow scraping without javascript, so we'll just parse https://nitter.net/search?q=%22chatgpt.com%2Fshare%2F%22
  console.log("skipping");
}
fetchAndFind();
