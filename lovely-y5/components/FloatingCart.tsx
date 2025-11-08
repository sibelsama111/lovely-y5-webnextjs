// components/FloatingCart.tsx
'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function FloatingCart() {
  // Estado para ocultar el botón cuando el usuario está cerca del footer
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    function checkVisibility() {
      const footer = document.querySelector('footer')
      const footerHeight = footer ? (footer as HTMLElement).offsetHeight : 0
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - footerHeight - 24
      setHidden(nearBottom)
    }

    // Recalcular al hacer scroll y al redimensionar
    window.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility)
    // Comprobar al montar
    checkVisibility()

    return () => {
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
    }
  }, [])

  // Ajustes de tamaño: ligeramente más grande y con transición suave
  const size = 80
  const iconSize = 44

  return (
    <div
      aria-hidden={hidden}
      style={{
        position: 'fixed',
        right: 20,
        top: 80,
        zIndex: 1050,
        transition: 'opacity 180ms ease, transform 180ms ease',
        opacity: hidden ? 0 : 1,
        transform: hidden ? 'scale(0.92)' : 'scale(1)'
      }}
    >
      <Link
        href="/carrito"
        className="d-flex align-items-center justify-content-center"
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
