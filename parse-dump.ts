import fs from 'fs';
import * as cheerio from 'cheerio';

function extractMessagesFromHtml(html: string) {
  const $ = cheerio.load(html);

  const messages: {
    role: string;
    content: string;
    timestamp?: string;
    imagesUrls?: string[];
  }[] = [];
  let title = $("title").text() || "Extracted Chat";
  let isDeadLink = false;
  let deadLinkMessage = "Could not extract structured messages from this HTML file.";

  // ... (use my previous extractMessagesFromHtml)
  // Let me just read it from parse-test.ts and run it on chatgpt-dump.html
}
