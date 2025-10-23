'use client'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function IntranetPage() {
  const { user } = useContext(AuthContext)
  const router = useRouter()

  if (!user) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body text-center">
                <h2 className="mb-4">Intranet Lovely Y5</h2>
                <p className="mb-4">Acceso exclusivo para trabajadores</p>
                <div className="d-grid gap-3">
                  <Link href="/intranet/login" className="btn btn-primary">
                    Iniciar Sesión
                  </Link>
                  <Link href="/intranet/registro" className="btn btn-outline-secondary">
                    Registrarse como trabajador
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
      </div>
    )
  }

  // Si el usuario está autenticado pero no es trabajador
  return (
    <div className="container my-5">
      <div className="alert alert-warning">
        No tienes acceso a esta sección. Esta área es solo para trabajadores.
      </div>
    </div>
  )
}