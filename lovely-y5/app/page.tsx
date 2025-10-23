// app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <div className="p-4 bg-white rounded shadow-sm">
        <h1>Bienvenid@ a Lovely Y5</h1>
        <p className="lead">Ventas de tecnología — demo funcional para la evaluación.</p>
        <p>
          <Link href="/productos"><a className="btn btn-primary me-2">Ver Productos</a></Link>
          <Link href="/contacto"><a className="btn btn-outline-secondary">Contacto</a></Link>
        </p>
      </div>

      <div className="mt-4">
        <h3>Ofertas destacadas</h3>
        <div className="row g-3">
          <div className="col-md-4"><div className="card p-3">Producto demo 1</div></div>
          <div className="col-md-4"><div className="card p-3">Producto demo 2</div></div>
          <div className="col-md-4"><div className="card p-3">Producto demo 3</div></div>
        </div>
      </div>
    </div>
  )
}
