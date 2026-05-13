import fs from "fs";
import * as cheerio from "cheerio";

async function fetchAndSearch() {
  const t = await fetch('https://chatgpt.com/share/672fc3ac-5758-800f-8fd6-2c5e533ba111').then(r => r.text()); // user's old share or any share
  // let's try the other share link from the screenshot
  // share link: https://chatgpt.com/share/6a007099-0528-83e9-90e5-a5aaeb86
  const t2 = await fetch('https://chatgpt.com/share/6a007099-0528-83e9-90e5-a5aaeb86').then(r => r.text());
  
  const searchForMessages = (text: string) => {
    const $ = cheerio.load(text);
    const scripts = $('script').map((_, el) => $(el).html()).get();
    let found = false;
    for (const script of scripts) {
      if (!script) continue;
      const regex = /enqueue\(\s*"((?:[^"\\]|\\.)*)"\s*\)/g;
      let match;
      while ((match = regex.exec(script)) !== null) {
        try {
          const unescaped = match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, '\n').trim();
          if (unescaped.includes('What is HTML')) {
             console.log("FOUND in stream enqueue: ", Math.min(unescaped.length, 500));
             found = true;
          }
        } catch(e) {}
      }
      
      // also just regex test the raw script
      if (script.includes("What is HTML")) {
         console.log("FOUND in raw script: length", script.length, "substring", script.substring(0, 100));
         found = true;
      }
    }
    
    // what if it's not even in a script tag?
    if (text.includes("What is HTML")) {
       console.log("FOUND in raw text but not scripts!");
    } else {
       console.log("Not found in raw text at all.");
    }
  };
  
  console.log("Testing 6a007099-0528-83e9-90e5-a5aaeb86:");
  // Looking for something that might be in the chat. But wait, I don't know what's in this chat.
  // Let's just output any chunk that contains "role" and "content"
  
  const printMessages = (text: string) => {
    let messageCount = 0;
    const $ = cheerio.load(text);
    const scripts = $('script').map((_, el) => $(el).html()).get();
    for (const script of scripts) {
      if (!script) continue;
      const regex = /enqueue\(\s*"((?:[^"\\]|\\.)*)"\s*\)/g;
      let match;
      while ((match = regex.exec(script)) !== null) {
        try {
          const unescaped = match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, '\n').trim();
          // parse it
          const jsonData = JSON.parse(unescaped);
          
          const search = (obj: any) => {
             if (!obj) return;
             if (Array.isArray(obj)) obj.forEach(search);
             else if (typeof obj === 'object') {
                if (obj.message && obj.message.author && obj.message.content) {
                   console.log("Found message:", obj.message.author.role, JSON.stringify(obj.message.content).substring(0, 50));
                   messageCount++;
                } else if (obj.role && obj.content && obj.content.parts) {
                   console.log("Found message direct:", obj.role, JSON.stringify(obj.content).substring(0, 50));
                   messageCount++;
                }
                Object.values(obj).forEach(search);
             }
          }
          search(jsonData);
        } catch(e) {}
      }
    }
    console.log("Total messages found:", messageCount);
  }
  
  printMessages(t2);
}
fetchAndSearch();
