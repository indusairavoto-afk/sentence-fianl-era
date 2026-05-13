import axios from 'axios';
(async () => {
   try {
       const url = 'https://chatgpt.com/'; 
       const px = await axios.get('https://translate.google.com/translate?sl=auto&tl=en&u=' + encodeURIComponent(url));
       console.log("Status:", px.status);
       console.log("Snippet:", px.data.length);
       if(px.data.includes('chatgpt')) console.log('Contains ChatGPT');
   } catch(e: any) {
       console.log("Error:", e.response ? e.response.status : e.message);
   }
})();
