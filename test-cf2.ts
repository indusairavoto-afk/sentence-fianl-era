import axios from 'axios';
(async () => {
   try {
       const url = 'https://chatgpt.com/';
       
       console.log("Trying direct...");
       const direct = await axios.get(url, {
          headers: {
             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
             "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
          }
       });
       console.log("Direct status:", direct.status, direct.data.substring(0, 50));
       
       console.log("\nTrying allorigins...");
       const px = await axios.get('https://api.allorigins.win/raw?url=' + encodeURIComponent(url));
       console.log("Proxy status:", px.status, px.data.substring(0, 50));
       
   } catch(e: any) {
       console.log("Error:", e.response ? e.response.status : e.message);
   }
})();
