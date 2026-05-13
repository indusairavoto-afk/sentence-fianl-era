import fetch from 'node-fetch';
async function test() {
  try {
    const res = await fetch('https://claude.ai/login');
    const text = await res.text();
    console.log(text.substring(0, 500));
  } catch(e) {
    console.error(e);
  }
}
test();
