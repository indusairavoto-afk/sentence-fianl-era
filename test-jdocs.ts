import axios from 'axios';
(async () => {
   try {
       const url = 'https://jina.ai/reader/';
       const px = await axios.get('https://r.jina.ai/' + url);
       console.log("Jina rules:\n", px.data);
   } catch(e: any) {
       console.log("Error:", e.response ? e.response.status : e.message);
   }
})();
