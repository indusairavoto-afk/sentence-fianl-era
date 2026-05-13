const axios = require('axios');
async function run() {
  const res = await axios.get("https://chatgpt.com/share/67cc6a00-ae60-8005-badf-a2e6f4044fd5", {
    validateStatus: () => true,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  console.log('x-frame-options:', res.headers['x-frame-options']);
  console.log('csp:', res.headers['content-security-policy']);
}
run();
