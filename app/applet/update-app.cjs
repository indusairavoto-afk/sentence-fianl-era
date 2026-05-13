import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
      if (inputMode === 'file') {
        setUploadProgress({ phase: 'Initializing File Stream...', percent: 0 });
        
        const htmlText = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onprogress = (e) => {
            if (e.lengthComputable) {
              setUploadProgress({ phase: 'Reading Local File...', percent: Math.round((e.loaded / e.total) * 20) });
            }
          };
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error('Failed to read file block'));
          reader.readAsText(htmlFile!);
        });

        setUploadProgress({ phase: 'Preparing Payload...', percent: 25 });
        await new Promise(r => setTimeout(r, 150));
        payload = { html: htmlText };
        endpoint = '/api/extract-html';
      } else {
        setUploadProgress({ phase: 'Validating Link...', percent: 10 });
        await new Promise(r => setTimeout(r, 200));
        
        let htmlText = '';
        try {
          setUploadProgress({ phase: 'Fetching Remote Page (Direct)...', percent: 20 });
          const directRes = await fetch(shareLink);
          if (directRes.ok) {
            htmlText = await directRes.text();
          } else {
             throw new Error("Direct fetch failed");
          }
        } catch(e) {
          console.log("Direct fetch failed, trying proxy");
          setUploadProgress({ phase: 'Fetching Remote Page (Proxy)...', percent: 30 });
          const proxyRes = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(shareLink));
          if (proxyRes.ok) {
            htmlText = await proxyRes.text();
          } else {
            throw new Error("Proxy fetch failed");
          }
        }
        
        payload = { html: htmlText };
        endpoint = '/api/parse';
        setUploadProgress({ phase: 'Sending HTML to server...', percent: 40 });
      }
`;

content = content.replace(
/if \(inputMode === 'file'\) \{[\s\S]*?endpoint = '\/api\/extract';[\s\S]*?await new Promise\(r => setTimeout\(r, 200\)\);[\s\S]*?setUploadProgress\(\{ phase: 'Fetching Remote Page...', percent: 40 \}\);[\s\S]*?\}/,
replacement
);

fs.writeFileSync('src/App.tsx', content);
