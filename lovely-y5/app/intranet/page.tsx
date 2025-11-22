'use client'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function IntranetPage() {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  // Si no hay usuario autenticado, redirigimos automáticamente al formulario de login
  if (!user) {
    if (typeof window !== 'undefined') {
      router.push('/intranet/login')
    }
    return null
  }

  // Si el usuario ya está autenticado y es trabajador
  if (user.rol === 'trabajador' || user.rol === 'admin') {
    return (
      <div className="container my-5">
        <h2>Panel de Administración</h2>
        <div className="row mt-4">
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Productos</h5>
                <p className="card-text">Gestionar inventario y catálogo</p>
                <Link href="/intranet/productos" className="btn btn-primary">
                  Administrar
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Pedidos</h5>
                <p className="card-text">Ver y gestionar pedidos</p>
                <Link href="/intranet/pedidos" className="btn btn-primary">
                  Administrar
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Mi Perfil</h5>
                <p className="card-text">Gestionar cuenta de trabajador</p>
                <Link href="/intranet/perfil" className="btn btn-primary">
                  Ver perfil
                </Link>
              </div>
            </div>
          </div>
        </div>
        <footer className="mt-4 text-center text-muted">hoy es un gran dia porque tu esfuerzo vale</footer>
      </div>
    )
  }

  // Si el usuario está autenticado pero no es trabajador
  return (
    <div className="container my-5">
      <div className="alert alert-warning">
        No tienes acceso a esta sección. Esta área es solo para trabajadores.
      </div>
      <footer className="mt-4 text-center text-muted">hoy es un gran dia porque tu esfuerzo vale</footer>
    </div>
  )
}