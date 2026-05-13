import axios from 'axios';
async function run() {
  try {
    const res = await axios.get("https://r.jina.ai/https://chatgpt.com/", {
      headers: { "X-Return-Format": "html" }
    });
    console.log(res.data.substring(0, 300));
  } catch(e) {
    console.log("Error:", e.message);
  }
}
run();
