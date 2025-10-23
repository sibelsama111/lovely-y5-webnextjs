// pages/api/send-mail.js
import { transporter } from '../../lib/nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { name, email, subject, message } = req.body
  try {
    await transporter.sendMail({
      from: `"Lovely Y5" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: subject || 'Mensaje Lovely Y5',
      html: `<h3>Mensaje</h3><p><strong>De:</strong> ${name} (${email})</p><p>${message}</p>`
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('send-mail error', err)
    return res.status(500).json({ ok: false, error: String(err) })
  }
}
