import axios from 'axios';
async function run() {
  const proxyUrl = "https://chrome.browserless.io/content?token=2UUaQFRvjHXBtgr8fefbc37d4cfbd5740af20de1d8e200498";
  const res = await axios.post(proxyUrl, {
    url: "https://chatgpt.com/",
    gotoOptions: { waitUntil: "networkidle2" }
  }, { validateStatus: () => true });
  console.log(res.status);
  console.log(res.data.substring(0, 500));
}
run();
