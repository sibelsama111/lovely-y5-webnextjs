// components/Navbar.tsx
'use client'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext)
  const { cartItems } = useContext(CartContext)
  const [open, setOpen] = useState(false)

  function logout() {
    setUser(null)
    localStorage.removeItem('lovely_user')
  }

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <img src="/logo.svg" alt="Lovely Y5" width={40} height={40} />
          <span className="ms-2 fw-bold">Lovely Y5</span>
        </Link>

        <button className="navbar-toggler" onClick={() => setOpen(!open)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item"><Link href="/" className="nav-link">Inicio</Link></li>
            <li className="nav-item"><Link href="/productos" className="nav-link">Productos</Link></li>
            <li className="nav-item"><Link href="/categorias" className="nav-link">Categorías</Link></li>
            <li className="nav-item"><Link href="/contacto" className="nav-link">Contacto</Link></li>
            <li className="nav-item"><Link href="/carrito" className="nav-link">Carrito {cartItems.length > 0 && <span className="badge bg-primary ms-1">{cartItems.length}</span>}</Link></li>

            {!user && <li className="nav-item"><Link href="/login" className="nav-link">Login</Link></li>}
            {user && <>
              <li className="nav-item"><span className="nav-link">Hola, {user.primerNombre}! &lt;3</span></li>
              <li className="nav-item"><Link href="/perfil" className="nav-link">Perfil</Link></li>
              <li className="nav-item"><button className="btn btn-link nav-link" onClick={logout}>Cerrar Sesión</button></li>
            </>}
            <li className="nav-item ms-2">
              <Link href="/admin" className="btn btn-outline-secondary">Intranet</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
