// pages/api/contact.js
import { transporter } from '../../lib/nodemailer'

let contacts = global.contactsMock || []

export default async function handler(req, res) {
  const { method } = req
  if (method === 'GET') {
    return res.status(200).json(contacts)
  }
  if (method === 'POST') {
    const payload = req.body
    contacts.unshift(payload)
    global.contactsMock = contacts

    // Enviar correo usando nodemailer
    try {
      const emailTemplate = contactRequestAdmin({
        nombre: payload.name,
        email: payload.email,
        telefono: payload.phone,
        mensaje: payload.message
      })

      await transporter.sendMail({
        from: `"Lovely Y5" <${process.env.EMAIL_USER}>`,
        ...emailTemplate
      })
    } catch (err) {
      console.error('Error enviando email:', err)
      // no fallamos la API por el email — lo guardamos igual
    }

    return res.status(201).json({ ok: true })
  }
  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${method} Not Allowed`)
}
