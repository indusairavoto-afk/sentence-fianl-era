import axios from 'axios';
(async () => {
   try {
       const url = 'https://chatgpt.com/';
       const px = await axios.get('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url));
       console.log("Status:", px.status);
       console.log("Data length:", px.data.length);
       if (px.data.includes('just a moment') || px.data.includes('cloudflare')) {
          console.log("BLOCKED");
       } else {
          console.log("OK!");
       }
   } catch(e: any) {
       console.log("Error:", e.response ? e.response.status : e.message);
   }
})();
