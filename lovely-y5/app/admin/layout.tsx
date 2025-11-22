// app/admin/layout.tsx
import '../globals.css'
import { AuthProvider } from '../../context/AuthContext'
import Link from 'next/link'
import AdminShell from '../../components/admin/AdminShell'

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
            <AdminShell>
              {children}
            </AdminShell>
          </AuthProvider>
          <footer className="mt-4 text-center text-muted">hoy es un gran dia porque tu esfuerzo vale</footer>
        </div>
      </body>
    </html>
  )
}
