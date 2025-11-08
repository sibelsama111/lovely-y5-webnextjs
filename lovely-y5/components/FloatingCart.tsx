// components/FloatingCart.tsx
'use client'
import Link from 'next/link'
import React from 'react'

export default function FloatingCart() {
  // El carrito ahora debe mostrarse siempre; eliminamos la lógica de ocultado.
  const size = 80
  const iconSize = 44

  return (
    <div
      className="floating-cart-wrapper"
      style={{
        transition: 'opacity 180ms ease, transform 180ms ease',
        opacity: 1,
        transform: 'scale(1)'
      }}
    >
      <Link
        href="/carrito"
        className="d-flex align-items-center justify-content-center floating-cart-button"
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          background: '#fff',
          boxShadow: '0 10px 26px rgba(0,0,0,.12)',
          display: 'inline-flex'
        }}
      >
        <img src="/cart.svg" alt="Carrito" style={{ width: iconSize, height: iconSize }} />
      </Link>
    </div>
  )
}
