import fs from 'fs';

const appCode = fs.readFileSync('src/App.tsx', 'utf8');

let newAppCode = appCode.replace(
  /interface Message \{\n\s*role: string;\n\s*content: string;\n/,
  "interface Message {\n  role: string;\n  content: string;\n  content_html?: string;\n"
);

const regex = /<div className="prose[^"]*">[\s\S]*?<ReactMarkdown[\s\S]*?\{msg\.content\}[\s\S]*?<\/ReactMarkdown>[\s\S]*?<\/div>/m;
const match = regex.exec(newAppCode);

if (match) {
  newAppCode = newAppCode.replace(match[0], 
    '<div ' +
      'className="prose dark:prose-invert max-w-none text-sm leading-relaxed prose-p:my-2 prose-pre:my-3 prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-800 prose-pre:text-zinc-900 dark:prose-pre:text-zinc-100 prose-img:max-h-32 prose-img:object-contain prose-img:rounded-md prose-img:my-2 overflow-x-auto" ' +
      'dangerouslySetInnerHTML={{ __html: msg.content_html || msg.content }} ' +
    '/>');
} else {
  console.log("Failed to match react markdown block.");
}

fs.writeFileSync('src/App.tsx', newAppCode);
console.log("Updated App.tsx");
