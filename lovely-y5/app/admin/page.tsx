// app/admin/page.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  useEffect(()=> {
    fetch('/api/orders').then(r=>r.json()).then(setOrders)
    fetch('/api/products').then(r=>r.json()).then(setProducts)
  }, [])

  return (
    <div>
      <h3>Dashboard IntraLove</h3>
      <div className="row">
        <div className="col-md-4 card p-3 m-2">
          <h5>Pedidos</h5>
          <div>{orders.length} totales</div>
          <Link href="/admin/pedidos" className="btn btn-sm btn-primary mt-2">Ver pedidos</Link>
        </div>
        <div className="col-md-4 card p-3 m-2">
          <h5>Productos</h5>
          <div>{products.length} en catálogo</div>
          <Link href="/admin/productos" className="btn btn-sm btn-primary mt-2">Gestionar productos</Link>
        </div>
      </div>
    </div>
  )
}
