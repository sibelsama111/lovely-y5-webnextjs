// components/Footer.tsx
'use client'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-white mt-4 border-top">
      <div className="container py-4">
        <div className="row align-items-center">
          <div className="col-md-6 d-flex align-items-center">
            <img src="/logo.svg" alt="Lovely Y5" width={40} height={40} />
            <div className="ms-3">
              <div>
                <Link href="/" className="me-2">Inicio</Link>
                <Link href="/productos" className="me-2">Productos</Link>
                <Link href="/carrito" className="me-2">Carrito</Link>
                <Link href="/contacto">Contacto</Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 text-md-end">
            <a href="https://web.facebook.com/profile.php?id=61576634015335" target="_blank" rel="noreferrer" className="me-2"><img src="/facebook.svg" alt="fb" width="24" /></a>
            <a href="https://www.instagram.com/lovely.y5.tech" target="_blank" rel="noreferrer" className="me-2"><img src="/instagram.svg" alt="ig" width="24" /></a>
            <a href="https://www.paypal.com/paypalme/sibelsama" target="_blank" rel="noreferrer"><img src="/paypal.svg" alt="ml" width="24" /></a>
            <div className="mt-2" style={{opacity:0.8}}>Todos los derechos reservados © Lovely Y5 &lt;3</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
