import axios from 'axios';
import * as cheerio from 'cheerio';
(async () => {
   try {
       const url = 'https://chatgpt.com/share/67a362db-6be8-8007-9def-5db0bbf8d8e5'; // fake share link
       const px = await axios.get('https://translate.google.com/translate?sl=auto&tl=en&u=' + encodeURIComponent(url));
       console.log("Status:", px.status);
       console.log("Snippet:", px.data.substring(0, 500));
   } catch(e: any) {
       console.log("Error:", e.response ? e.response.status : e.message);
   }
})();
