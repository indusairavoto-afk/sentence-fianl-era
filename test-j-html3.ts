import axios from 'axios';
async function run() {
  try {
    const res = await axios.get("https://r.jina.ai/https://chatgpt.com/", {
      headers: { "X-Return-Format": "html" }
    });
    console.log(res.data.includes('__NEXT_DATA__') || res.data.includes('__remixContext'));
    console.log(res.data.includes('data-message-author-role'));
  } catch(e) {
    console.log("Error:", e.message);
  }
}
run();
