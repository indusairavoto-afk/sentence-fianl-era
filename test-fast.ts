import axios from 'axios';
import * as cheerio from 'cheerio';

const ALLOWED_TAGS = new Set([
  'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'ul', 'ol', 'li', 'strong', 'em', 'blockquote',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'span', 'div', 'a'
]);

function cleanHtml($, el) {
  // We want to create a clean HTML string keeping only semantic tags.
  // One way is to recursively walk the nodes.
  let output = '';
  
  function walk(node) {
    if (node.type === 'text') {
      output += node.data; // or escape HTML
    } else if (node.type === 'tag') {
      const tagName = node.name.toLowerCase();
      // Keep basic wrappers? 
      // If it's not in ALLOWED_TAGS, we just process its children (unwrap it)
      // Wait, we need to preserve structural divs if necessary, but ChatGPT wraps inner content in '.markdown'
      
      const isAllowed = ALLOWED_TAGS.has(tagName);
      if (isAllowed) {
        output += `<${tagName}>`;
      }
      
      $(node).contents().each((_, child) => walk(child));
      
      if (isAllowed) {
        output += `</${tagName}>`;
      }
    }
  }
  
  $(el).contents().each((_, child) => walk(child));
  return output;
}

async function extractFast(url: string) {
  console.log('Fetching URL:', url);
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });

  const $ = cheerio.load(data);
  const messages: any[] = [];
  
  const title = $('title').text() || 'Extracted Chat';

  $('[data-message-author-role]').each((i, el) => {
    const role = $(el).attr('data-message-author-role');
    
    // Find the actual markdown container if possible, to avoid copying avatar and username
    let contentContainer = $(el).find('.markdown').first();
    if (contentContainer.length === 0) {
      contentContainer = $(el); // fallback to full element
    }
    
    let rawHtml = contentContainer.html() || '';
    
    // But we need to clean wrapper divs/classes while keeping semantics
    messages.push({
      role,
      content_html: rawHtml,
    });
  });

  if (messages.length === 0) {
    // try claudia selector
    // ...
  }

  console.log(`Found ${messages.length} messages. Title: ${title}`);
  if (messages.length > 0) {
    console.log(messages[1].content_html.substring(0, 300));
  }
  return { title, messages };
}

extractFast("https://chatgpt.com/share/6a0201c7-9b00-83e8-93af-68e2").catch(console.error);
