import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  /const formatAsPrompt = \(data: ChatData\) => \{[\s\S]*?return \`Below is a conversation history[\s\S]*?join\('\\n\\n'\);\n\s*\};/,
  "const formatAsPrompt = (data: ChatData) => {\n" +
  "    return 'Below is a conversation history. Please process it and continue the conversation as the assistant.\\n\\n' + \n" +
  "           data.messages.map(m => m.role.toUpperCase() + ': ' + (m.content_html || m.content).replace(/<[^>]*>?/gm, '')).join('\\n\\n');\n" +
  "  };"
);
fs.writeFileSync('src/App.tsx', content);
