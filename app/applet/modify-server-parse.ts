import fs from 'fs';

const code = fs.readFileSync('server.ts', 'utf8');

const parseRoute = `
app.post("/api/parse", (req, res) => {
  try {
    const { html } = req.body;
    if (!html) {
      return res.status(400).json({ error: "Missing html" });
    }

    const $ = cheerio.load(html);
    const title = $('title').text() || 'Extracted Chat';
    const messages: any[] = [];

    $('[data-message-author-role]').each((i, el) => {
      let role = $(el).attr('data-message-author-role');
      if (role !== 'user' && role !== 'assistant') {
        role = 'assistant';
      }
      
      let target = $(el).find('.markdown');
      if (target.length === 0) {
        target = $(el);
      } else {
        target = target.first();
      }
      
      const contentHtml = cleanHtml($, target);
      if (contentHtml.trim().length > 0) {
        messages.push({
          role: role,
          content_html: contentHtml
        });
      }
    });

    const now = Date.now();
    const formattedMessages = messages.map((m, index) => ({
      role: m.role,
      content_html: m.content_html,
      content: m.content_html || '',
      timestamp: new Date(now - (messages.length - index) * 60000).toISOString()
    }));

    return res.json({ title, messages: formattedMessages });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Parsng failed", details: error.message });
  }
});
`;

let newCode = code.replace(/app\.post\("\/api\/extract",/, parseRoute + '\napp.post("/api/extract",');
fs.writeFileSync('server.ts', newCode);
console.log('Modified server.ts');
