"use client"
import React from 'react'
import Link from 'next/link'

export default function AdminRegistroWrapper() {
  return (
    <div className="container my-4">
      <h3>Registro deshabilitado</h3>
      <p className="mb-3">El registro de trabajadores ya no está disponible desde la interfaz. Los trabajadores deben ser añadidos directamente en la base de datos por el administrador.</p>
      <Link href="/admin/login" className="btn btn-primary">Volver a login</Link>
    </div>
  )
}
