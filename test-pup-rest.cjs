const axios = require('axios');
async function run() {
  const browserlessToken = "2UUaQFRvjHXBtgr8fefbc37d4cfbd5740af20de1d8e200498";
  const proxyUrl = "https://chrome.browserless.io/content?token=" + browserlessToken;
  try {
    const res = await axios.post(proxyUrl, {
      url: "https://chatgpt.com/share/67cc6a00-ae60-8005-badf-a2e6f4044fd5",
      gotoOptions: { waitUntil: "networkidle2" }
    }, { validateStatus: () => true });
    console.log(res.status);
    console.log("length:", res.data.length);
    console.log("has message author role?", res.data.includes("data-message-author-role"));
  } catch(e) {
    console.error("Error:", e.message);
  }
}
run();
