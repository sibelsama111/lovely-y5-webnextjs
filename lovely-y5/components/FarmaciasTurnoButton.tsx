"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function FarmaciasTurnoButton() {
  const pathname = usePathname()

  // Ocultar en la propia página de farmacias de turno
  if (!pathname || pathname === '/farmacias-de-turno') return null
  return (
    <div className="turno-button-wrapper">
      <Link href="/farmacias-de-turno" className="turno-button pulse">
        <span className="heart">❤</span>
        <span style={{ fontWeight: 700 }}>Farmacias de turno</span>
      </Link>
    </div>
  )
}
