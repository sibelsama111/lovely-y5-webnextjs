// pages/api/orders/index.js
import { transporter } from '../../../lib/nodemailer'
import { orderConfirmationClient, orderConfirmationAdmin } from '../../../lib/emailTemplates'

let orders = global.ordersMock || []

export default async function handler(req, res) {
  const { method } = req

  if (method === 'GET') {
    return res.status(200).json(orders)
  }

  if (method === 'POST') {
    const order = req.body
    orders.unshift(order)
    global.ordersMock = orders

    // Enviar correos de confirmación
    try {
      // Correo al cliente
      const clientEmail = orderConfirmationClient(order)
      await transporter.sendMail({
        from: `"Lovely Y5" <${process.env.EMAIL_USER}>`,
        to: order.shipping?.email || order.customer?.email,
        ...clientEmail
      })

      // Correo al admin
      const adminEmail = orderConfirmationAdmin(order)
      await transporter.sendMail({
        from: `"Lovely Y5" <${process.env.EMAIL_USER}>`,
        ...adminEmail
      })
    } catch (err) {
      console.error('Error enviando emails de orden:', err)
      // no fallamos la API por el email — guardamos la orden igual
    }

    return res.status(201).json(order)
  }

  if (method === 'PUT') {
    const { id, status, tracking } = req.body
    const order = orders.find(o => o.id === id)
    
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' })
    }

    order.status = status
    order.tracking = tracking

    // Enviar correo según el nuevo estado
    try {
      let emailTemplate
      switch (status) {
        case 'preparing':
          emailTemplate = orderPreparingClient(order)
          break
        case 'shipped':
          emailTemplate = orderShippedClient(order, tracking?.courier, tracking?.number)
          break
        case 'delivered':
          emailTemplate = orderReceivedClient(order)
          break
        default:
          // No enviamos email para otros estados
          return res.status(200).json(order)
      }

      await transporter.sendMail({
        from: `"Lovely Y5" <${process.env.EMAIL_USER}>`,
        to: order.shipping?.email || order.customer?.email,
        ...emailTemplate
      })
    } catch (err) {
      console.error('Error enviando email de actualización:', err)
    }

    return res.status(200).json(order)
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT'])
  res.status(405).end(`Method ${method} Not Allowed`)
}