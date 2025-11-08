// app/page.tsx
'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'

type Product = {
  id: string;
  codigo: string;
  nombre: string;
  marca: string;
  tipo: string;
  precio: number;
  imagenes?: string[];
  descripcion: string;
  detalles: string;
  stock: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(data.slice(0, 3)))
  }, [])

  return (
    <div>
      <div className="p-4 bg-white rounded shadow-sm">
        <h1>Bienvenid@ a Lovely Y5</h1>
        <p className="lead">Ventas de tecnología y servicio técnico.</p>
        <p>
          <Link href="/productos" className="btn btn-primary me-2">Ver Productos</Link>
          <Link href="/contacto" className="btn btn-outline-secondary">Contacto</Link>
        </p>
      </div>

      <div className="mt-4">
        <h3>Ofertas destacadas</h3>
        <div className="row g-3">
          {products.map(product => (
            <div key={product.id} className="col-md-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
