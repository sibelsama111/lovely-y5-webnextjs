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
            <img src="/svgs/logo.svg" alt="Lovely Y5" width={40} height={40} />
            <div className="ms-3">
              <div>
                <Link href="/"><a className="me-2">Inicio</a></Link>
                <Link href="/productos"><a className="me-2">Productos</a></Link>
                <Link href="/carrito"><a className="me-2">Carrito</a></Link>
                <Link href="/contacto"><a>Contacto</a></Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 text-md-end">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="me-2"><img src="/svgs/fb.svg" alt="fb" width="24" /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="me-2"><img src="/svgs/ig.svg" alt="ig" width="24" /></a>
            <a href="https://mercadolibre.cl" target="_blank" rel="noreferrer"><img src="/svgs/ml.svg" alt="ml" width="24" /></a>
            <div className="mt-2" style={{opacity:0.8}}>Todos los derechos reservados (c) Lovely Y5 &lt;3</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
