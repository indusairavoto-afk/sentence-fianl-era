import axios from 'axios';
(async () => {
   try {
       const url = 'https://chatgpt.com/share/676ac5d9-43c4-800c-b26a-939e60ea9b97'; 
       const px = await axios.get(url, {
          headers: {
             "User-Agent": "ChatGPT/1.0.0.0 CFNetwork/1404.0.5 Darwin/22.3.0",
             "Accept": "*/*"
          }
       });
       if(px.data.includes('data-message-author-role')) {
          console.log("SUCCESS! Chat data is visible in raw HTML.");
       } else {
          console.log("WARNING! Chat data not directly in HTML. It might be hydration JSON.");
       }
   } catch(e: any) {
       console.log("Error:", e.response ? e.response.status : e.message);
   }
})();
