// components/FloatingCart.tsx
'use client'
import Link from 'next/link'
import React from 'react'

export default function FloatingCart() {
  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 1050 }}>
      <Link href="/carrito">
        <a className="d-flex align-items-center justify-content-center"
           style={{ width: 64, height: 64, borderRadius: 32, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,.12)' }}>
          <img src="lovely-y5/public/cart.svg" alt="Carrito" style={{ width: 34, height: 34 }} />
        </a>
      </Link>
    </div>
  )
}
