import fs from 'fs';

const serverCode = fs.readFileSync('server.ts', 'utf8');

const newFunction = `
import axios from 'axios';

const ALLOWED_TAGS = new Set([
  'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'ul', 'ol', 'li', 'strong', 'em', 'blockquote',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'span', 'div', 'a'
]);

// Helper to clean HTML while preserving structure
function cleanHtml($, el) {
  let output = '';
  
  function walk(node) {
    if (node.type === 'text') {
      output += node.data.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    } else if (node.type === 'tag') {
      const tagName = node.name.toLowerCase();
      const isAllowed = ALLOWED_TAGS.has(tagName);
      
      if (isAllowed) {
        // preserve href for a tags?
        if (tagName === 'a' && node.attribs && node.attribs.href) {
           const href = node.attribs.href.replace(/"/g, '&quot;');
           output += '<' + tagName + ' href="' + href + '">';
        } else {
           output += '<' + tagName + '>';
        }
      }
      
      $(node).contents().each((_, child) => walk(child));
      
      if (isAllowed) {
        output += '</' + tagName + '>';
      }
    }
  }
  
  $(el).contents().each((_, child) => walk(child));
  return output.trim();
}

async function extractChatViaAxios(url: string) {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    },
    timeout: 30000 
  });

  const $ = cheerio.load(data);
  const title = $('title').text() || 'Extracted Chat';
  const messages: any[] = [];

  $('[data-message-author-role]').each((i, el) => {
    let role = $(el).attr('data-message-author-role');
    if (role !== 'user' && role !== 'assistant') {
       role = 'assistant';
    }
    
    // Some ChatGPT pages nest .markdown inside the element
    let target = $(el).find('.markdown');
    if (target.length === 0) {
      target = $(el); // fallback
    } else {
      target = target.first();
    }
    
    const contentHtml = cleanHtml($, target);
    
    messages.push({
      role: role,
      content_html: contentHtml
    });
  });

  return { title, messages };
}
`;

let newServerCode = serverCode.replace(/import \{ gfm \} from "turndown-plugin-gfm";/, 'import { gfm } from "turndown-plugin-gfm";\n' + newFunction);

newServerCode = newServerCode.replace(
  /const \{ title, messages \} = \(await Promise\.race\(\[\s*extractChatWithImages\(url, extractImages\),\s*timeoutPromise\s*\]\)\) as \{ title: string, messages: any\[\] \};/m, 
  "const { title, messages } = (await Promise.race([ extractChatViaAxios(url), timeoutPromise ])) as { title: string, messages: any[] };"
);

newServerCode = newServerCode.replace(
  /const formattedMessages = messages\.map\(\(m, index\) => \(\{[\s\S]*?\}\)\);/m, 
  "const formattedMessages = messages.map((m, index) => ({ role: m.role, content_html: m.content_html, content: m.content_html || '', timestamp: new Date(now - (messages.length - index) * 60000).toISOString() }));"
);

fs.writeFileSync('server.ts', newServerCode);
console.log('Replaced');
