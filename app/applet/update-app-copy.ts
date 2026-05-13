import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// replace copyToClipboard
content = content.replace(
/const copyToClipboard = \(text: string, type: string\) => \{[\s\S]*?navigator\.clipboard\.writeText\(text\);[\s\S]*?setCopied\(type\);[\s\S]*?setTimeout\(\(\) => setCopied\(null\), 2000\);[\s\S]*?\};/,
`const copyToClipboard = (text: string, type: string) => {
    // try to cleanly parse HTML to text
    let parsedText = text;
    try {
      const div = document.createElement('div');
      div.innerHTML = text;
      parsedText = div.textContent || div.innerText || text;
    } catch (e) {}
    
    navigator.clipboard.writeText(parsedText);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };`
);

// replace formatAsMarkdown
content = content.replace(
/const formatAsMarkdown = \(data: ChatData\) => \{[\s\S]*?return \`# \$\{data\.title\}\\n\\n\` \+ data\.messages\.map\(m => \`### \$\{m\.role\.toUpperCase\(\)\}\\n\\n\$\{m\.content\}\\n\\n---\\n\`\)\.join\('\\n'\);\n\s*\};/,
`const formatAsMarkdown = (data: ChatData) => {
    return \`# \${data.title}\\n\\n\` + data.messages.map(m => {
       let parsedContent = m.content_html || m.content;
       try {
         const div = document.createElement('div');
         div.innerHTML = parsedContent;
         parsedContent = div.textContent || div.innerText || parsedContent;
       } catch(e) {}
       return \`### \${m.role.toUpperCase()}\\n\\n\${parsedContent}\\n\\n---\\n\`;
    }).join('\\n');
  };`
);

fs.writeFileSync('src/App.tsx', content);
