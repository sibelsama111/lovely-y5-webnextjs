'use client'

import { useContext } from 'react'
import Link from 'next/link'
import { CartContext } from '../../context/CartContext'

export default function FloatingCartButton() {
  const { cartItems } = useContext(CartContext)
  const cartItemsArray = Object.values(cartItems)
  const total = cartItemsArray.reduce((sum, item) => sum + (item.cantidad || 1), 0)

  if (!total) return null
  return (
    <Link href="/carrito">
      <button 
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          fontSize: '1.2rem',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}
      >
        {total}
      </button>
    </Link>
  )
}