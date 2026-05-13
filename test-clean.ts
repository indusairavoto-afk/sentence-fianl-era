import fs from 'fs';
import * as cheerio from 'cheerio';

const ALLOWED_TAGS = new Set([
  'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'ul', 'ol', 'li', 'strong', 'em', 'blockquote',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'span', 'div', 'a'
]);

function cleanHtml($, el: any) {
  let output = '';
  function walk(node: any) {
    if (node.type === 'text') {
      output += node.data.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    } else if (node.type === 'tag') {
      const tagName = node.name.toLowerCase();
      const isAllowed = ALLOWED_TAGS.has(tagName);
      if (isAllowed) {
        if (tagName === 'a' && node.attribs && node.attribs.href) {
           const href = node.attribs.href.replace(/"/g, '&quot;');
           output += '<' + tagName + ' href="' + href + '">';
        } else {
           output += '<' + tagName + '>';
        }
      }
      $(node).contents().each((_, child: any) => walk(child));
      if (isAllowed) {
        output += '</' + tagName + '>';
      }
    }
  }
  el.each((_: number, node: any) => walk(node));
  return output;
}

const html = `<html><body><div data-message-author-role="assistant"><div class="markdown"><table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody></table></div><div class="markdown"><p>Second paragraph!</p></div></div></body></html>`;

const $ = cheerio.load(html);
const target = $('[data-message-author-role]').find('.markdown');
console.log(cleanHtml($, target.length > 0 ? target : $('[data-message-author-role]')));
