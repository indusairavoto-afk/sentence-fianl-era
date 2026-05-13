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
       console.log("data-message-author-role?", px.data.includes("data-message-author-role"));
       console.log("remixContext?", px.data.includes("__remixContext"));
       console.log("NEXT_DATA?", px.data.includes("__NEXT_DATA__"));
   } catch(e: any) {
       console.log("Error:", e.response ? e.response.status : e.message);
   }
})();
