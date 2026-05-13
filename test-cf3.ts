import axios from 'axios';
async function run() {
  const proxyUrl = "https://chrome.browserless.io/content?token=2UUaQFRvjHXBtgr8fefbc37d4cfbd5740af20de1d8e200498";
  const res = await axios.post(proxyUrl, {
    url: "https://chatgpt.com/share/67cc6a00-ae60-8005-badf-a2e6f4044fd5",
    gotoOptions: { waitUntil: "networkidle2" }
  }, { validateStatus: () => true });
  console.log(res.status);
  console.log(res.data.substring(0, 500));
}
run();
