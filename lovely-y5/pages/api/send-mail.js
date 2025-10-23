// Server-only API route to send mail using nodemailer.
// Expects POST { to, subject, text, html }
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { to, subject, text, html } = req.body || {};
  if (!to || !subject) return res.status(400).json({ error: 'Missing fields' });

  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;
  const host = process.env.MAIL_HOST || 'smtp.gmail.com';
  if (!user || !pass) {
    // no credentials -> stub
    console.log('send-mail stub: no MAIL_USER/MAIL_PASS set. Would send to', to, subject);
    return res.status(200).json({ ok: true, stub: true });
  }

  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({ host, port: 587, secure: false, auth: { user, pass } });
    const info = await transporter.sendMail({ from: user, to, subject, text, html });
    return res.status(200).json({ ok: true, info });
  } catch (err) {
    console.error('send-mail error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
