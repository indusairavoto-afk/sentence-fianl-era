import axios from 'axios';
(async () => {
   try {
       const url = 'https://chatgpt.com/'; 
       const px = await axios.get(url, {
          headers: {
             "User-Agent": "ChatGPT/1.0.0.0 CFNetwork/1404.0.5 Darwin/22.3.0",
             "Accept": "*/*"
          }
       });
       console.log(px.data.substring(0, 500));
   } catch(e: any) {
       console.log("Error:", e.response ? e.response.status : e.message);
   }
})();
