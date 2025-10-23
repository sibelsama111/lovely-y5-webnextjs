// app/admin/pedidos/page.tsx
'use client'
import { useEffect, useState } from 'react'

export default function AdminPedidos() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(()=> {
    fetch('/api/orders').then(r=>r.json()).then(setOrders)
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  return (
    <div>
      <h3>Pedidos</h3>
      {orders.length === 0 && <div className="text-muted">Sin pedidos.</div>}
      {orders.map(o => (
        <div key={o.id} className="border p-2 mb-2">
          <div className="d-flex justify-content-between">
            <div><strong>#{o.id}</strong> • {o.customer?.primerNombre || 'Cliente'}</div>
            <div>
              <select value={o.status} onChange={(e)=>updateStatus(o.id, e.target.value)} className="form-select form-select-sm">
                {['agendado','confirmado','cancelado','preparando','enviado','en transito','recibido','reembolsado'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>Total: ${o.total?.toLocaleString('es-CL')}</div>
        </div>
      ))}
    </div>
  )
}
