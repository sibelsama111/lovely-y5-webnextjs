"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function FarmaciasTurnoButton() {
  const pathname = usePathname()

  // Ocultar en la propia página de farmacias de turno
  if (!pathname || pathname === '/farmacias-de-turno') return null

  return (
    <div style={{ position: 'fixed', right: 110, top: 80, zIndex: 1050 }}>
      <Link
        href="/farmacias-de-turno"
        className="d-inline-flex align-items-center justify-content-center btn btn-sm btn-primary"
        style={{ padding: '10px 14px', borderRadius: 28, boxShadow: '0 8px 22px rgba(0,0,0,.12)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="me-2">
          <path d="M8 0a5 5 0 0 0-5 5c0 3.25 5 11 5 11s5-7.75 5-11a5 5 0 0 0-5-5zm0 7.5A2.5 2.5 0 1 1 8 2.5a2.5 2.5 0 0 1 0 5z" />
        </svg>
        Farmacias de turno
      </Link>
    </div>
  )
}
