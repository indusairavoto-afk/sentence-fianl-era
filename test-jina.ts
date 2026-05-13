import fetch from "node-fetch";

(async () => {
  const url = "https://r.jina.ai/https://chatgpt.com/share/67cc6a00-ae60-8005-badf-a2e6f4044fd5";
  const res = await fetch(url);
  const text = await res.text();
  console.log("Jina response length:", text.length);
  console.log("Snippet:", text.substring(0, 500));
})();
