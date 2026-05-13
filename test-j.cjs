const axios = require('axios');
(async () => {
   try {
       const url = 'https://chatgpt.com/share/67cc6a00-ae60-8005-badf-a2e6f4044fd5';
       const px = await axios.get('https://r.jina.ai/' + url);
       console.log("length:", px.data.length);
       console.log(px.data.substring(0, 500));
   } catch(e) {
       console.log("Error:", e.message);
   }
})();
