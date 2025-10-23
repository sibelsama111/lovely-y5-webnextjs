// app/registro/page.tsx
'use client'
import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function RegistroPage() {
  const { setUser } = useContext(AuthContext)
  const router = useRouter()
  const [form, setForm] = useState({
    rut: '', primerNombre: '', segundoNombre: '', apellidos: '', correo: '', telefono: '', direccion: '', password: '', password2: ''
  })

  const handle = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e: any) => {
    e.preventDefault()
    if (!form.rut || !form.primerNombre || !form.apellidos || !form.correo || !form.password || form.password !== form.password2) {
      alert('Completa campos requeridos y verifica contraseñas.')
      return
    }
    const user = { ...form, isWorker: false, puesto: '', sueldoBase: undefined, orders: [] }
    localStorage.setItem('lovely_user', JSON.stringify(user))
    setUser(user)
    alert('Registro OK')
    router.push('/')
  }

  return (
    <div className="card p-4">
      <h3>Registro</h3>
      <form onSubmit={submit}>
        <div className="row">
          <div className="col-md-4 mb-2"><input name="rut" className="form-control" placeholder="RUT / DNI" value={form.rut} onChange={handle} /></div>
          <div className="col-md-4 mb-2"><input name="primerNombre" className="form-control" placeholder="Primer nombre" value={form.primerNombre} onChange={handle} /></div>
          <div className="col-md-4 mb-2"><input name="segundoNombre" className="form-control" placeholder="Segundo nombre (opcional)" value={form.segundoNombre} onChange={handle} /></div>
          <div className="col-md-6 mb-2"><input name="apellidos" className="form-control" placeholder="Apellidos" value={form.apellidos} onChange={handle} /></div>
          <div className="col-md-6 mb-2"><input name="correo" className="form-control" placeholder="Correo" value={form.correo} onChange={handle} /></div>
          <div className="col-md-4 mb-2"><input name="telefono" className="form-control" placeholder="Teléfono" value={form.telefono} onChange={handle} /></div>
          <div className="col-md-8 mb-2"><input name="direccion" className="form-control" placeholder="Dirección" value={form.direccion} onChange={handle} /></div>
          <div className="col-md-6 mb-2"><input name="password" type="password" className="form-control" placeholder="Contraseña" value={form.password} onChange={handle} /></div>
          <div className="col-md-6 mb-2"><input name="password2" type="password" className="form-control" placeholder="Repite contraseña" value={form.password2} onChange={handle} /></div>
        </div>
        <div className="mt-3"><button className="btn btn-primary" type="submit">Registrar</button></div>
      </form>
    </div>
  )
}
