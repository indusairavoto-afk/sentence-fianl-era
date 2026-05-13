import fetch from "node-fetch";

(async () => {
    console.log("Fetching local server...");
    try {
      const res = await fetch('http://localhost:3000/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: "https://chatgpt.com/share/67cc6a00-ae60-8005-badf-a2e6f4044fd5", extractImages: false })
      });
      console.log(res.status, await res.text());
    } catch(e) { console.error(e) }
})(); 
