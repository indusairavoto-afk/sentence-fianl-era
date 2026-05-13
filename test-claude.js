import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://claude.ai/share/3244e7b5-ddbc-4f3c-8d4e-c98f14f11462' })
    });
    const text = await res.text();
    console.log(res.status, text.substring(0, 500));
  } catch(e){
    console.error(e);
  }
}
test();
