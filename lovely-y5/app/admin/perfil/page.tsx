// app/admin/perfil/page.tsx
'use client'
import { useEffect, useState } from 'react'

export default function AdminPerfil() {
  const [user, setUser] = useState<any>(null)
  useEffect(()=> {
    const u = JSON.parse(localStorage.getItem('lovely_user') || 'null')
    setUser(u)
  }, [])

  if (!user) return <div className="text-muted">No hay user</div>

  const sueldoBruto = user.sueldoBase || 560000
  const descuentos = Math.round(sueldoBruto * 0.2)
  const sueldoLiquido = sueldoBruto - descuentos

  return (
    <div>
      <h3>Perfil trabajador</h3>
      <div className="card p-3">
        <div><strong>{user.primerNombre} {user.apellidos}</strong></div>
        <div>{user.correo} • {user.rut}</div>
        <div className="mt-3">Puesto: {user.puesto || 'Vendedor/a'}</div>
        <div>Sueldo base: ${sueldoBruto.toLocaleString('es-CL')}</div>
        <div style={{opacity:0.8}}>Sueldo aproximado líquido: ${sueldoLiquido.toLocaleString('es-CL')}</div>
      </div>
    </div>
  )
}
