// components/ProductCard.tsx
'use client'
import Link from 'next/link'
import React from 'react'

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="card product-card h-100">
      <img src={product.imagenes?.[0] || '/logo.svg'} className="card-img-top p-3" alt={product.nombre} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.nombre}</h5>
        <p className="card-text mb-1">{product.marca} • {product.tipo}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <strong>${Number(product.precio).toLocaleString('es-CL')}</strong>
          <Link href={`/producto/${product.id}`}>
            <a className="btn btn-sm btn-primary">Ver</a>
          </Link>
        </div>
      </div>
    </div>
  )
}
