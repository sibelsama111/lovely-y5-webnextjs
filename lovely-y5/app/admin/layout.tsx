// app/admin/layout.tsx
import '../globals.css'
import { AuthProvider } from '../../context/AuthContext'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="container my-4">
          <div className="d-flex align-items-center mb-3">
            <img src="/intranet-logo.svg" width={52} />
            <h3 className="ms-3">IntraLove</h3>
            <div className="ms-auto">
              <Link href="/" className="btn btn-outline-secondary">Volver a tienda</Link>
            </div>
          </div>
          <AuthProvider>
            <div className="row">
              <aside className="col-md-3">
                <div className="list-group">
                  <Link href="/admin" className="list-group-item">Dashboard</Link>
                  <Link href="/admin/pedidos" className="list-group-item">Pedidos</Link>
                  <Link href="/admin/productos" className="list-group-item">Productos</Link>
                  <Link href="/admin/contacto" className="list-group-item">Contactos</Link>
                  <Link href="/admin/perfil" className="list-group-item">Perfil</Link>
                </div>
              </aside>
              <main className="col-md-9">
                {children}
              </main>
            </div>
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}
