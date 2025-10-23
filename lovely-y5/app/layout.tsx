// app/layout.tsx
import './globals.css'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingCart from '../components/FloatingCart'
import Breadcrumb from '../components/Breadcrumb'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || 'Lovely Y5',
  description: 'Lovely Y5 - Tienda de tecnología en línea',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="container my-4" style={{ minHeight: '65vh' }}>
              <Breadcrumb />
              {children}
            </main>
            <FloatingCart />
            <Footer />
            <Toaster position="top-right" toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#28a745',
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: '#dc3545',
                },
              },
            }} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
