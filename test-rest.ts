import fetch from "node-fetch";

async function testREST() {
   const res = await fetch("https://chrome.browserless.io/content?token=2UUaQFRvjHXBtgr8fefbc37d4cfbd5740af20de1d8e200498", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
         url: "https://chatgpt.com/share/67cc6a00-ae60-8005-badf-a2e6f4044fd5"
      })
   });
   console.log(res.status);
   console.log((await res.text()).substring(0, 500));
}
testREST().catch(console.error);
