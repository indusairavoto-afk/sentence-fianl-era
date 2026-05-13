import axios from 'axios';
import fs from 'fs';

async function download() {
  const url = "https://chatgpt.com/share/6727284b-ddcc-800e-adea-b03a67d0f98e"; // I will use a different share link or the same one if it works
  const url2 = "https://chatgpt.com/share/6a0201c7-9b00-83e8-93af-68e2";
  const { data } = await axios.get(url2, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });
  fs.writeFileSync('chatgpt-test.html', data);
  console.log('Saved', data.length, 'bytes');
}
download();
