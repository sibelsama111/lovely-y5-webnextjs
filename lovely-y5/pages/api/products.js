// pages/api/products.js
import { listProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../../data/products'

export default function handler(req, res) {
  const { method } = req
  if (method === 'GET') {
    const products = listProducts()
    return res.status(200).json(products)
  }
  if (method === 'POST') {
    // crear producto
    const payload = req.body
    // valida codigo empieza con LVL5_
    if (payload.codigo && !payload.codigo.startsWith('LVL5_')) {
      return res.status(400).json({ error: 'Código de producto debe comenzar con LVL5_' })
    }
    const created = createProduct(payload)
    return res.status(201).json(created)
  }
  if (method === 'PUT') {
    const { id, ...payload } = req.body
    const updated = updateProduct(id, payload)
    return res.status(200).json(updated)
  }
  if (method === 'DELETE') {
    const { id } = req.body
    deleteProduct(id)
    return res.status(200).json({ ok: true })
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
  res.status(405).end(`Method ${method} Not Allowed`)
}
