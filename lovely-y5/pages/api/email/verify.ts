// pages/api/email/verify.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { verifyConnection } from '../../../lib/nodemailer'
import { validateEmailConfig } from '../../../lib/emailConfig'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Primero validamos la configuración
    if (!validateEmailConfig()) {
      return res.status(500).json({
        ok: false,
        error: 'Faltan variables de entorno requeridas'
      })
    }

    // Intentamos conectar al SMTP
    const isConnected = await verifyConnection()

    if (!isConnected) {
      return res.status(500).json({
        ok: false,
        error: 'No se pudo establecer conexión SMTP'
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'Configuración de email verificada correctamente'
    })
  } catch (error) {
    console.error('Error verificando email:', error)
    return res.status(500).json({
      ok: false,
      error: 'Error verificando configuración de email'
    })
  }
}