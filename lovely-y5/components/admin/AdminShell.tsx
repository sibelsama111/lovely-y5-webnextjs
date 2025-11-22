"use client"

import React, { useContext } from 'react'
import Link from 'next/link'
import { AuthContext } from '../../context/AuthContext'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext)
  const isAuth = !!user && (user.isWorker || user.rol === 'trabajador' || user.rol === 'admin')

  if (!isAuth) {
    return (
      <div className="container">
        <main className="my-4">{children}</main>
      </div>
    )
  }

  return (
    <div className="row">
      <aside className="col-md-3">
        <div className="list-group">
          <Link href="/admin" className="list-group-item">Dashboard</Link>
          <Link href="/admin/pedidos" className="list-group-item">Pedidos</Link>
          <Link href="/admin/productos" className="list-group-item">Productos</Link>
          <Link href="/admin/contacto" className="list-group-item">Contactos</Link>
          <Link href="/admin/perfil" className="list-group-item">Perfil</Link>
        </div>
      </aside>
      <main className="col-md-9">{children}</main>
    </div>
  )
}
