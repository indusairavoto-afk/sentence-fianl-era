import axios from 'axios';
async function run() {
  const target = "https://chatgpt.com/share/67cc6a00-ae60-8005-badf-a2e6f4044fd5";
  const proxies = [
    "https://api.allorigins.win/raw?url=",
    "https://api.codetabs.com/v1/proxy?quest="
  ];
  for(const p of proxies) {
    const res = await axios.get(p + target, { validateStatus: () => true, headers: { "User-Agent": "Mozilla/5.0" }, responseType: 'text' });
    console.log(p, res.status);
    console.log(String(res.data).includes('__NEXT_DATA__') || String(res.data).includes('remixContext'));
    console.log(String(res.data).substring(0, 200));
  }
}
run();
