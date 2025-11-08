'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type BreadcrumbItem = {
  label: string;
  href: string;
}

export default function Breadcrumb() {
  const pathname = usePathname()
  const [items, setItems] = useState<BreadcrumbItem[]>([])

  useEffect(() => {
    const generateBreadcrumbs = async () => {
      const paths = pathname?.split('/').filter(Boolean) || []
      let currentPath = ''
      
      // Siempre comenzamos con Inicio
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Inicio', href: '/' }
      ]

      for (const path of paths) {
        currentPath += `/${path}`
        
        // Si es una página de producto individual
        if (currentPath.startsWith('/producto/')) {
          // Agregar "Productos" como paso intermedio
          if (!breadcrumbs.some(b => b.href === '/productos')) {
            breadcrumbs.push({ label: 'Productos', href: '/productos' })
          }
          
          // Si es el ID del producto
          if (path.length > 3) {
            try {
              const res = await fetch('/api/products')
              const products = await res.json()
              const product = products.find((p: any) => p.id === path || p.codigo === path)
              if (product) {
                breadcrumbs.push({ label: product.nombre, href: currentPath })
                continue
              }
            } catch (e) {
              console.error('Error fetching product:', e)
            }
          }
          continue
        }

        // Para otras páginas, convertimos el slug a un título presentable
        let label = path.charAt(0).toUpperCase() + path.slice(1)
        label = label.replace(/-/g, ' ')
        
        // Casos especiales
        switch (path) {
          case 'productos':
            label = 'Productos'
            break
          case 'producto':
            label = 'Productos'
            break
          case 'carrito':
            label = 'Carrito'
            break
          case 'contacto':
            label = 'Contacto'
            break
          case 'perfil':
            label = 'Mi Perfil'
            break
          case 'admin':
            label = 'Intranet'
            break
        }

        breadcrumbs.push({ label, href: currentPath })
      }

      setItems(breadcrumbs)
    }

    generateBreadcrumbs()
  }, [pathname])

  if (items.length <= 1) return null

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-fixed">
      <ol className="breadcrumb mb-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li 
              key={item.href}
              className={`breadcrumb-item d-inline-block me-2${isLast ? ' active' : ''}`}
              {...(isLast && { 'aria-current': 'page' })}
            >
              {isLast ? (
                <span className="text-muted small">{item.label}</span>
              ) : (
                <Link href={item.href} className="text-decoration-none small">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}