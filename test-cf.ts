import axios from 'axios';
(async () => {
   try {
       const { data } = await axios.get('https://chatgpt.com/share/67a362db-6be8-8007-9def-5db0bbf8d8e5', {
          headers: {
             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
             "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
          }
       });
       console.log("Success length:", data.length);
       console.log(data.substring(0, 100));
   } catch(e: any) {
       console.log("Error:", e.response ? e.response.status : e.message);
   }
})();
