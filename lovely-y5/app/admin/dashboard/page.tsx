'use client'

import AdminProtected from '../../../components/AdminProtected'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <AdminProtected>
      <DashboardInner />
    </AdminProtected>
  )
}

function DashboardInner() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])

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
          <Link href="/intranet/pedidos"><a className="btn btn-sm btn-primary mt-2">Ver pedidos</a></Link>
        </div>
        <div className="col-md-4 card p-3 m-2">
          <h5>Productos</h5>
          <div>{products.length} en catálogo</div>
          <Link href="/intranet/productos"><a className="btn btn-sm btn-primary mt-2">Gestionar productos</a></Link>
        </div>
      </div>
    </div>
  )
}
