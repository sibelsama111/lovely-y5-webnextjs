"use client"
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
      .then(data => setProducts(Array.isArray(data) ? data.slice(0, 3) : []))
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

      {/* Nueva sección: Sobre nosotros */}
      <div className="mt-5 p-4 bg-white rounded shadow-sm">
        <h3>Sobre nosotros &lt;3</h3>
        <p style={{ whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
          Lovely Y5 nació para unir experiencia técnica y trato humano. Ofrecemos venta de dispositivos y
          servicio técnico con énfasis en diagnóstico riguroso, soluciones duraderas y comunicación
          clara. Nuestro equipo, formado por profesionales y estudiantes avanzados de Ingeniería
          Informática, aplica conocimientos actuales para resolver problemas reales: no reemplazamos
          piezas sin investigar la causa, optimizamos rendimiento y priorizamos la confiabilidad.

          Creemos en la cercanía: una paleta amable, lenguaje sencillo y soporte cercano para que la
          tecnología sea accesible y comprensible. Lovely Y5 combina la agilidad de una tienda online con
          la atención personalizada de un local, respaldada por prácticas profesionales y ética. Nuestro
          compromiso es ofrecer productos verificados, asesoría honesta y un servicio técnico que
          realmente funcione. Gracias por confiar en nosotros: elegimos mejorar cada día para darte
          soluciones útiles, confiables y con visión de futuro.
        </p>
        <div className="mt-3">
          <img
            src="/banner_sobre_nos.png"
            alt="Lovely Y5 - Sobre nosotros"
            className="img-fluid"
            style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 6 }}
          />
        </div>
      </div>
    </div>
  )
}
