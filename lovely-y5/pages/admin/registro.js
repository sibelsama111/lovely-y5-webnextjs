'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRegistro() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [form, setForm] = useState({
    rut: '',
    primerNombre: '',
    segundoNombre: '',
    apellidos: '',
    correo: '',
    direccion: '',
    afp: '',
    salud: '',
    password: '',
    password2: ''
  })

  const handle = e => setForm({...form, [e.target.name]: e.target.value})

  const submit = (e) => {
    e.preventDefault()
    if (code !== 'LVLWRKR5') { 
      alert('Código de registro inválido')
      return 
    }
    if (!form.rut || !form.primerNombre || !form.apellidos || !form.correo || !form.password || form.password !== form.password2) { 
      alert('Por favor completa todos los campos obligatorios')
      return 
    }
    
    const workers = JSON.parse(localStorage.getItem('lovely_workers') || '[]')
    const newWorker = {...form, puesto: 'Vendedor/a', sueldoBase: 560000}
    workers.push(newWorker)
    localStorage.setItem('lovely_workers', JSON.stringify(workers))
    
    alert('Registro exitoso. Ahora puedes iniciar sesión en la Intranet.')
    router.push('/admin/login')
  }

  return (
    <div className="container">
      <div className="auth-container">
        <div className="text-center mb-4">
          <img src="/svgs/intranet-logo.svg" alt="IntraLove" width={80} height={80} />
          <h3 className="mt-3">Registro de trabajadores</h3>
          <p className="text-muted">Completa el formulario para unirte al equipo</p>
        </div>

        <form onSubmit={submit}>
          <div className="mb-4">
            <label className="form-label">Código de trabajador</label>
            <input 
              className="form-control" 
              placeholder="Ingresa el código proporcionado" 
              value={code} 
              onChange={e=>setCode(e.target.value)}
              required
            />
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">RUT</label>
              <input 
                className="form-control" 
                name="rut" 
                placeholder="12.345.678-9" 
                value={form.rut} 
                onChange={handle}
                required 
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Primer nombre</label>
              <input 
                className="form-control" 
                name="primerNombre" 
                placeholder="Primer nombre" 
                value={form.primerNombre} 
                onChange={handle}
                required 
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Segundo nombre</label>
              <input 
                className="form-control" 
                name="segundoNombre" 
                placeholder="Segundo nombre (opcional)" 
                value={form.segundoNombre} 
                onChange={handle}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Apellidos</label>
              <input 
                className="form-control" 
                name="apellidos" 
                placeholder="Apellidos" 
                value={form.apellidos} 
                onChange={handle}
                required 
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Correo electrónico</label>
              <input 
                className="form-control" 
                name="correo" 
                type="email"
                placeholder="correo@ejemplo.com" 
                value={form.correo} 
                onChange={handle}
                required 
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Dirección</label>
              <input 
                className="form-control" 
                name="direccion" 
                placeholder="Dirección completa" 
                value={form.direccion} 
                onChange={handle}
                required 
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">AFP</label>
              <input 
                className="form-control" 
                name="afp" 
                placeholder="Nombre de AFP" 
                value={form.afp} 
                onChange={handle}
                required 
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Sistema de salud</label>
              <input 
                className="form-control" 
                name="salud" 
                placeholder="ISAPRE o FONASA" 
                value={form.salud} 
                onChange={handle}
                required 
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Contraseña</label>
              <input 
                className="form-control" 
                name="password" 
                type="password" 
                placeholder="Contraseña" 
                value={form.password} 
                onChange={handle}
                required 
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Confirmar contraseña</label>
              <input 
                className="form-control" 
                name="password2" 
                type="password" 
                placeholder="Repite la contraseña" 
                value={form.password2} 
                onChange={handle}
                required 
              />
            </div>
          </div>

          <div className="form-check my-4">
            <input 
              type="checkbox" 
              className="form-check-input" 
              id="accept" 
              required 
            />
            <label className="form-check-label" htmlFor="accept">
              Entiendo que mis datos se solicitan con fines exclusivamente laborales
            </label>
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">
              Completar registro
            </button>
            <button 
              type="button" 
              className="btn btn-outline-primary"
              onClick={() => router.push('/admin/login')}
            >
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}