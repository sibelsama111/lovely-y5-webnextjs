// components/ProductCard.tsx
'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext'

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useContext(CartContext)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagenes: product.imagenes
    })
  }

  return (
    <div className="card product-card h-100">
      <img src={product.imagenes?.[0] || '/logo.svg'} className="card-img-top p-3" alt={product.nombre} />
      <div className="card-body d-flex flex-column">
          {/* Link corregido: usar la ruta singular /producto/[id] para que coincida con app/producto/[id]/page.tsx */}
          <Link href={`/producto/${product.id}`} className="text-decoration-none">
            <h5 className="card-title text-dark">{product.nombre}</h5>
          </Link>
        <p className="card-text mb-1">{product.marca} • {product.tipo}</p>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong className="h5 mb-0">${Number(product.precio).toLocaleString('es-CL')}</strong>
            <Link href={`/producto/${product.id}`}>
              <button className="btn btn-sm btn-outline-primary">Ver detalles</button>
            </Link>
          </div>
          <button 
            className="btn btn-primary w-100" 
            onClick={handleAddToCart}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  )
}
