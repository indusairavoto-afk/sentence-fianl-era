import * as cheerio from "cheerio";

function extractMessagesFromHtml(html) {
  const $ = cheerio.load(html);
  const messages = [];
  
  $("script").each((_, el) => {
    const text = $(el).html();
    if (text && text.includes("streamController.enqueue")) {
      const regex = /enqueue\(\s*new\s*Uint8Array\(\s*\[(.*?)]\s*\)\s*\)|enqueue\(\s*new\s*TextEncoder\(\)\.encode\(\s*"((?:[^"\\]|\\.)*)"\s*\)\s*\)|enqueue\(\s*"((?:[^"\\]|\\.)*)"\s*\)/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
        try {
          let unescaped = '';
          if (match[1]) {
             // Uint8Array format
             const bytes = match[1].split(',').map(n => parseInt(n.trim(), 10));
             unescaped = Buffer.from(bytes).toString('utf-8');
          } else if (match[2]) {
             unescaped = match[2].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
          } else if (match[3]) {
             unescaped = match[3].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
          }
          if (unescaped) {
            const jsonData = JSON.parse(unescaped);
            console.log("PARSED CHUNK:", Object.keys(jsonData));
            
            const searchMessages = (obj) => {
              if (!obj) return;
              if (Array.isArray(obj)) {
                obj.forEach(searchMessages);
              } else if (typeof obj === "object") {
                if (obj.role && obj.content && typeof obj.content.parts !== "undefined") {
                  messages.push({ role: obj.role, content: obj.content.parts.join('\n') });
                } else if (obj.author && obj.author.role && obj.content && obj.content.parts) {
                   messages.push({ role: obj.author.role, content: obj.content.parts.join('\n') });
                } else {
                  Object.values(obj).forEach(searchMessages);
                }
              }
            };
            searchMessages(jsonData);
          }
        } catch (e) {
             console.error("JSON parse error:", e.message);
        }
      }
    }
  });

  return messages;
}

const mockHtml = `
<script>
window.__reactRouter = { streamController: { enqueue: function(d) { console.log(d) } } };
window.__reactRouter.streamController.enqueue("{\\"1\\":2,\\"2\\":\\"foo\\"}");
window.__reactRouter.streamController.enqueue("{\\"3\\":{\\"title\\":\\"Extracted Fake Chat\\",\\"currentNode\\":\\"node_a\\",\\"mapping\\":{\\"node_a\\":{\\"id\\":\\"node_a\\",\\"message\\":{\\"author\\":{\\"role\\":\\"assistant\\"},\\"content\\":{\\"parts\\":[\\"Hello\\\\nWorld!\\"]}}}}}}");

window.__reactRouter.streamController.enqueue(new Uint8Array([123,34,52,34,58,53,125]));
window.__reactRouter.streamController.enqueue(new TextEncoder().encode("{\\"5\\":{\\"message\\":{\\"author\\":{\\"role\\":\\"user\\"},\\"content\\":{\\"parts\\":[\\"Hi\\"]}}}}"));
</script>
`;

console.log("Extracted:", extractMessagesFromHtml(mockHtml));

