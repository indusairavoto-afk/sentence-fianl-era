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

  // Check for known 404 or deleted chat signatures
  if (
    title.includes("404") || 
    title.includes("Unhandled Thrown Response") || 
    title.includes("Page not found") ||
    html.includes("Can't load shared conversation") ||
    html.includes("This conversation may have been deleted") ||
    html.includes("The conversation you requested could not be found")
  ) {
    isDeadLink = true;
    deadLinkMessage = "This ChatGPT share link is invalid, completely private, or has been deleted by the author.";
  }

  // 1. Try to find __NEXT_DATA__ (old ChatGPT)
  const nextData = $("#__NEXT_DATA__").html();
  if (nextData) {
    try {
      const jsonData = JSON.parse(nextData);
      // Deep search for messages
      const searchMessages = (obj: any) => {
        if (!obj) return;
        if (Array.isArray(obj)) {
          obj.forEach(searchMessages);
        } else if (typeof obj === "object") {
          let timestamp: string | undefined = undefined;
          if (obj.create_time) {
            const ts =
              typeof obj.create_time === "number"
                ? obj.create_time
                : parseFloat(obj.create_time);
            if (!isNaN(ts))
              timestamp = new Date(ts > 1e11 ? ts : ts * 1000).toISOString();
          } else if (obj.createdAt || obj.created_at || obj.timestamp) {
            const ts = obj.createdAt || obj.created_at || obj.timestamp;
            if (typeof ts === "number")
              timestamp = new Date(ts > 1e11 ? ts : ts * 1000).toISOString();
            else timestamp = new Date(ts).toISOString();
          }
          if (timestamp === "Invalid Date") timestamp = undefined;

          if (
            obj.role &&
            obj.content &&
            typeof obj.content === "object" &&
            obj.content.parts
          ) {
            messages.push({
              role: obj.role,
              content: obj.content.parts.join("\n"),
              timestamp,
            });
          } else {
            Object.values(obj).forEach(searchMessages);
          }
        }
      };
      searchMessages(jsonData);
    } catch (e) {
      console.error("Failed to parse __NEXT_DATA__", e);
    }
  }

  // Handle React Router streaming format (new ChatGPT format)
  if (messages.length === 0) {
    const scripts = $("script").map((_, el) => $(el).html()).get();
    for (const text of scripts) {
      if (text && text.includes("streamController.enqueue")) {
        console.log("Found streamController!");
        const regex = /enqueue\(\s*new\s*Uint8Array\(\s*\[(.*?)]\s*\)\s*\)|enqueue\(\s*new\s*TextEncoder\(\)\.encode\(\s*"((?:[^"\\]|\\.)*)"\s*\)\s*\)|enqueue\(\s*"((?:[^"\\]|\\.)*)"\s*\)/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
          try {
            let unescaped = '';
            if (match[1]) {
              const bytes = match[1].split(',').map((n: string) => parseInt(n.trim(), 10));
              unescaped = Buffer.from(bytes).toString('utf-8');
            } else if (match[2]) {
              unescaped = match[2].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            } else if (match[3]) {
              unescaped = match[3].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            }
            if (unescaped) {
              if (unescaped.includes("Made in korea review")) {
                console.log("Found our text in unescaped chunk:", unescaped);
              }
              if (unescaped.includes("parts")) {
                console.log("Found 'parts' in unescaped chunk:", unescaped);
              }
              // Try extracting parts more aggressively
              
              // search recursively just like __NEXT_DATA__
            }
          } catch (e) {
            // ignore parse errors for partial chunks
          }
        }
      }
    }
  }

  // Fallback to simpler regex for anything that looks like JSON messages
  if (messages.length === 0) {
    const allText = html;
    const regex = /\{[^{}]*"role"\s*:\s*"(user|assistant|system)"[^{}]*"content"\s*:\s*\{[^{}]*"parts"\s*:\s*\["([^"]*)"\][^{}]*\}/g;
    let match;
    while ((match = regex.exec(allText)) !== null) {
      messages.push({
        role: match[1],
        content: match[2].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\')
      });
    }
    
    // Check if we can find author format
    const regex2 = /\{[^{}]*"author"\s*:\s*\{"role"\s*:\s*"(user|assistant|system)"\}[^{}]*"content"\s*:\s*\{[^{}]*"parts"\s*:\s*\["([^"]*)"\][^{}]*\}/g;
    let match2;
    while ((match2 = regex2.exec(allText)) !== null) {
      messages.push({
        role: match2[1],
        content: match2[2].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\')
      });
    }
  }

  // 3. Fallback: Parse common DOM classes (ChatGPT / Claude web structure)
  if (messages.length === 0) {
    const messageElements = $(
      '[data-message-author-role], .prose, .message, [class*="message"]',
    );
    messageElements.each((_, el) => {
      const roleAttr = $(el).attr("data-message-author-role");
      let role = roleAttr || "unknown";

      // If no explicit role, try to guess from class or nested elements
      if (role === "unknown") {
        const htmlStr = $(el).html() || "";
        if (
          htmlStr.includes("User") ||
          $(el).hasClass("user-message") ||
          $(el).closest(".user-message").length
        ) {
          role = "user";
        } else if (
          htmlStr.includes("ChatGPT") ||
          htmlStr.includes("Claude") ||
          $(el).hasClass("assistant-message")
        ) {
          role = "assistant";
        }
      }

      // Find the actual text content - usually inside a .prose or similar container
      let contentEl = $(el).find(".prose").length
        ? $(el).find(".prose")
        : $(el);

      // Handle paragraphs to preserve some structure
      const paragraphs: string[] = [];
      contentEl.find("p").each((_, p) => {
        paragraphs.push($(p).text().trim());
      });

      let content = paragraphs.length
        ? paragraphs.join("\n\n")
        : contentEl.text().trim();

      // Look for images
      const imagesUrls: string[] = [];
      contentEl.find("img").each((_, img) => {
        const src = $(img).attr("src");
        if (src && !src.startsWith("data:") && src.length > 10) {
          imagesUrls.push(src);
        }
      });

      if (content || imagesUrls.length > 0) {
        // Prevent massive deduplication from generic broad selectors by checking if we already seen this content
        // This is a naive workaround since the selectors are very generic.
        const existing = messages.find(m => m.content === content && m.role === role);
        if (!existing) {
          messages.push({ role, content, imagesUrls });
        }
      }
    });

    // Remove garbage messages
    const cleanMessages = [];
    for (const m of messages) {
      if (m.content && m.content.length > 5) {
        cleanMessages.push(m);
      }
    }
    messages.length = 0;
    messages.push(...cleanMessages);
  }

  return { title, isDeadLink, deadLinkMessage, messages };
}

const file = process.argv[2] || 'chatgpt-share-dump.html';
console.log('Testing', file);
const res = extractMessagesFromHtml(fs.readFileSync(file, 'utf8'));
console.log('Result total messages =', res.messages.length);
if (res.messages.length) {
  console.log(res.messages[0]);
} else {
  console.log('No messages found');
}



