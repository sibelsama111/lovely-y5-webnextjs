// Client-side mail helper: call the server API route /api/send-mail
export async function sendMailClient(payload){
  const res = await fetch('/api/send-mail', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Mail API error: '+(await res.text()));
  return res.json();
}

// Note: server-side sending is handled by the API route at pages/api/send-mail.js
