import axios from 'axios';
(async () => {
   try {
       const url = 'https://chatgpt.com/';
       const px = await axios.get('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url));
       console.log(px.data.substring(0, 500));
   } catch(e: any) {
       console.log("Error:", e.response ? e.response.status : e.message);
   }
})();
