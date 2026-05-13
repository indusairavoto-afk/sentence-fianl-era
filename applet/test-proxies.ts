import axios from 'axios';
const urls = [
  "https://r.jina.ai/",
  "https://corsproxy.io/?url=",
  "https://api.allorigins.win/raw?url=",
  "https://api.codetabs.com/v1/proxy?quest="
];
const target = "https://chatgpt.com/";
async function run() {
  for (const proxy of urls) {
    try {
      const u = proxy.includes('?') ? proxy + encodeURIComponent(target) : proxy + target;
      const res = await axios.get(u, { validateStatus: () => true, headers: { "User-Agent": "Mozilla/5.0" } });
      console.log(proxy, res.status, res.data.length);
    } catch(e) {
      console.log(proxy, "Error:", e.message);
    }
  }
}
run();
