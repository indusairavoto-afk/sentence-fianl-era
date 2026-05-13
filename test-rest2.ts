import fetch from "node-fetch";
async function testREST() {
   const res = await fetch("https://chrome.browserless.io/content?token=2UUaQFRvjHXBtgr8fefbc37d4cfbd5740af20de1d8e200498", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
         url: "https://chatgpt.com/share/67a362db-6be8-8007-9def-5db0bbf8d8e5",
         gotoOptions: { waitUntil: 'networkidle2' }
      })
   });
   console.log(res.status);
   console.log((await res.text()).substring(0, 500));
}
testREST().catch(console.error);
