// app/perfil/page.tsx
'use client'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useEffect, useState } from 'react'

export default function PerfilPage() {
  return (
    <ProtectedRoute>
      <Perfil />
    </ProtectedRoute>
  )
}

function Perfil() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('lovely_user') || 'null')
      setUser(u)
    } catch (e) {}
    fetch('/api/orders').then(r => r.json()).then(list => {
      const u = JSON.parse(localStorage.getItem('lovely_user') || 'null')
      const my = list.filter(o => u && (o.customer?.id === u.rut || o.customer?.id === 'guest'))
      setOrders(my)
    })
  }, [])

  return (
    <div>
      <h3>Perfil</h3>
      {user && (
        <div className="card p-3 mb-3">
          <strong>{user.primerNombre} {user.apellidos}</strong>
          <div>{user.correo} • {user.telefono}</div>
          <div className="mt-2">Dirección predeterminada: {user.direccion || 'No especificada'}</div>
        </div>
      )}

      <h5 className="mt-4">Mis Direcciones</h5>
      <div className="card p-3 mb-3">
        <p className="text-muted">No tienes direcciones adicionales guardadas.</p>
        <button className="btn btn-outline-primary btn-sm">Añadir nueva dirección</button>
      </div>

      <h5 className="mt-4">Mis Métodos de Pago</h5>
      <div className="card p-3 mb-3">
        <p className="text-muted">No tienes métodos de pago guardados.</p>
        <button className="btn btn-outline-primary btn-sm">Añadir nuevo método de pago</button>
      </div>

      <h5 className="mt-4">Historial de pedidos</h5>
      {orders.length === 0 && <div className="text-muted">Sin pedidos aún.</div>}
      {orders.map(o => (
        <div key={o.id} className="border p-2 mb-2">
          <div><strong>#{o.id}</strong> — {o.status}</div>
          <div>Total: ${o.total?.toLocaleString('es-CL')}</div>
          <small className="text-muted">{new Date(o.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  )
}
