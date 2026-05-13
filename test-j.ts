import axios from 'axios';
async function run() {
  try {
    const res = await axios.get("https://r.jina.ai/https://chatgpt.com/", {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    console.log(res.data.substring(0, 200));
  } catch(e) {
    console.log("Error:", e.message);
  }
}
run();
