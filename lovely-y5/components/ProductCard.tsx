// components/ProductCard.tsx
'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext'

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useContext(CartContext)

  const handleAddToCart = () => {
    try {
      if (!product.nombre) {
        console.error('Producto sin nombre válido')
        return
      }
      
      addToCart({
        codigo: product.codigo || product.id,
        nombre: product.nombre,
        precioOriginal: product.precioOriginal,
        precioActual: product.precioActual || product.precio || 0,
        imagenes: product.imagenes || ['/logo.svg']
      })
    } catch (error) {
      console.error('Error al añadir producto al carrito:', error)
    }
  }

  // Calcular descuento si hay precios originales y actuales
  const descuento = product.precioOriginal && product.precioActual 
    ? Math.round(((product.precioOriginal - product.precioActual) / product.precioOriginal) * 100)
    : null

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
            <div className="d-flex flex-column">
              {product.precioOriginal && product.precioActual && product.precioOriginal !== product.precioActual ? (
                <>
                  <small className="text-muted text-decoration-line-through">
                    ${product.precioOriginal.toLocaleString('es-CL')}
                  </small>
                  <strong className="h5 mb-0 text-primary">
                    ${product.precioActual.toLocaleString('es-CL')}
                  </strong>
                  {descuento && (
                    <span className="badge bg-danger align-self-start">
                      -{descuento}%
                    </span>
                  )}
                </>
              ) : (
                <strong className="h5 mb-0">
                  ${Number(product.precioActual || product.precio).toLocaleString('es-CL')}
                </strong>
              )}
            </div>
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
