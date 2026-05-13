import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('chatgpt-test.html', 'utf8');
const $ = cheerio.load(html);

$('script').each((i, el) => {
  const content = $(el).html() || '';
  if (content.startsWith('{"authStatus')) {
    try {
      const data = JSON.parse(content);
      const serverProps = data.serverResponse;
      
      // Let's do a deep search for messages in the json
      let messagesCount = 0;
      function findMessages(obj) {
         if (!obj || typeof obj !== 'object') return;
         if (obj.message && obj.message.content) {
            // console.log("Found message:", obj.message);
            messagesCount++;
            return;
         }
         for (let key in obj) {
            findMessages(obj[key]);
         }
      }
      findMessages(data);
      console.log("Found messages inside JSON:", messagesCount);
      
      fs.writeFileSync('parsed-data.json', JSON.stringify(data, null, 2));

    } catch(e) {
      console.error(e);
    }
  }
});

