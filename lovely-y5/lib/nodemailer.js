// lib/nodemailer.js
// Se usa desde pages/api/send-mail.js
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function verifyConnection() {
  try {
    await transporter.verify()
    console.log('SMTP conectado correctamente.')
  } catch (err) {
    console.error('Error de conexión SMTP:', err)
  }
}
