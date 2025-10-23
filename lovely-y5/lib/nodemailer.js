import nodemailer from 'nodemailer'

const emailConfig = {
  development: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  },
  production: {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  }
}

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production'
export const transporter = nodemailer.createTransport(isProduction ? emailConfig.production : emailConfig.development)

export async function verifyConnection() {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Faltan credenciales de email (EMAIL_USER o EMAIL_PASS)')
    }

    await transporter.verify()
    console.log('SMTP conectado correctamente')
    
    return true
  } catch (err) {
    console.error('Error de conexión SMTP:', err)
    if (process.env.NODE_ENV === 'development') {
      console.log('Asegúrate de:')
      console.log('1. Tener un archivo .env con las variables correctas')
      console.log('2. Usar una "App Password" si estás usando Gmail')
      console.log('3. Tener habilitado "Less secure app access" en desarrollo')
    }
    return false
  }
}
