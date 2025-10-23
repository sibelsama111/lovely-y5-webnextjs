// pages/api/orders.js
let orders = global.ordersMock || []

export default function handler(req, res) {
  const { method } = req
  if (method === 'GET') {
    return res.status(200).json(orders)
  }
  if (method === 'POST') {
    const order = req.body
    orders.unshift(order)
    global.ordersMock = orders
    return res.status(201).json(order)
  }
  if (method === 'PUT') {
    const { id, status } = req.body
    orders = orders.map(o => (o.id === id ? { ...o, status } : o))
    global.ordersMock = orders
    return res.status(200).json({ ok: true })
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT'])
  res.status(405).end(`Method ${method} Not Allowed`)
}
