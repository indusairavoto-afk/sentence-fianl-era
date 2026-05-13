import fetch from "node-fetch";
import fs from "fs";

(async () => {
  const url = "https://chatgpt.com/share/672eb7d8-eb10-800e-ad6d-e9714fe0edc3";
  console.log('Fetching', url);
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "text/html"
    }
  });
  const html = await res.text();
  console.log('HTML length', html.length);
  fs.writeFileSync('live.html', html);
})();
