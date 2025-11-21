import { productService } from '../../lib/firebaseServices'
import { listProducts } from '../../data/products'

export default async function handler(req, res) {
  const { method } = req
  
  try {
    if (method === 'GET') {
      let products
      try {
        products = await productService.getAll()
        if (!products || products.length === 0) {
          console.log('No hay productos en Firebase, usando datos locales')
          products = listProducts()
        }
      } catch (error) {
        console.log('Error connecting to Firebase, using local data:', error.message)
        products = listProducts()
      }
      return res.status(200).json(products)
    }
    if (method === 'POST') {
      // crear producto
      const payload = req.body
      // valida codigo empieza con LVL5_
      if (payload.codigo && !payload.codigo.startsWith('LVL5_')) {
        return res.status(400).json({ error: 'Código de producto debe comenzar con LVL5_' })
      }
      const id = await productService.create(payload)
      return res.status(201).json({ id, ...payload })
    }
    
    if (method === 'PUT') {
      const { id, ...payload } = req.body
      await productService.update(id, payload)
      return res.status(200).json({ id, ...payload })
    }
    
    if (method === 'DELETE') {
      const { id } = req.body
      await productService.delete(id)
      return res.status(200).json({ ok: true })
    }
    
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${method} Not Allowed`)
    
  } catch (error) {
    console.error('Error in products API:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
