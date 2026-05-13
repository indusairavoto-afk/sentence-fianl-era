import axios from 'axios';
async function run() {
  try {
    const res = await axios.get("https://r.jina.ai/https://chatgpt.com/", {
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "text/html" }
    });
    console.log(res.data.substring(0, 300));
  } catch(e) {
    console.log("Error:", e.message);
  }
}
run();
