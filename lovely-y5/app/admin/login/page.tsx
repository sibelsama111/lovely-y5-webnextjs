'use client'

import { useState, useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function IntranetLogin() {
  const [rut, setRut] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { setUser } = useContext(AuthContext)

  // simple: registro intranet se hace en /intranet/productos? No, hay form de registro directo en intranet/productos
  const submit = (e) => {
    e.preventDefault()
    // buscar trabajadores almacenados en localStorage 'lovely_workers'
    const workers = JSON.parse(localStorage.getItem('lovely_workers') || '[]')
    const w = workers.find(x => x.rut === rut && x.password === password)
    if (w) {
      setUser({...w, isWorker:true})
      router.push('/intranet/dashboard')
    } else {
      toast.error('Credenciales intranet incorrectas')
    }
  }

  return (
    <div className="container">
      <div className="auth-container">
        <div className="text-center mb-4">
          <img src="/intranet-logo.svg" alt="IntraLove" width={80} height={80} />
          <h3 className="mt-3">Intranet Lovely Y5</h3>
        </div>

        <form onSubmit={submit} className="mb-4">
          <div className="mb-3">
            <label className="form-label">RUT</label>
            <input 
              className="form-control" 
              placeholder="Ingresa tu RUT" 
              value={rut} 
              onChange={e=>setRut(e.target.value)}
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <input 
              className="form-control" 
              type="password" 
              placeholder="Ingresa tu contraseña"
              value={password} 
              onChange={e=>setPassword(e.target.value)}
              required 
            />
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">
              Iniciar sesión
            </button>
            <button 
              type="button" 
              className="btn btn-outline-primary"
              onClick={() => router.push('/admin/registro')}
            >
              Registro de trabajadores
            </button>
          </div>

          <div className="text-center mt-4">
            <button 
              type="button"
              className="btn btn-link text-decoration-none"
              onClick={() => router.push('/login')}
            >
              Volver a inicio de sesión
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

function WorkerRegister() {
  const [code, setCode] = useState('')
  const [form, setForm] = useState({ rut:'', primerNombre:'', segundoNombre:'', apellidos:'', correo:'', direccion:'', afp:'', salud:'', password:'', password2:'' })

  const handle = e => setForm({...form,[e.target.name]: e.target.value})

  const submit = (e) => {
    e.preventDefault()
    if (code !== 'LVLWRKR5') { toast.error('Código inválido'); return }
    if (!form.rut || !form.primerNombre || !form.apellidos || !form.correo || !form.password || form.password !== form.password2) { toast.error('Completa bien los campos'); return }
    const workers = JSON.parse(localStorage.getItem('lovely_workers') || '[]')
    const neww = {...form, puesto: 'Vendedor/a', sueldoBase: 560000}
    workers.push(neww)
    localStorage.setItem('lovely_workers', JSON.stringify(workers))
    toast.success('Registro trabajador OK. Ahora inicia sesión en Intranet.')
    setForm({ rut:'', primerNombre:'', segundoNombre:'', apellidos:'', correo:'', direccion:'', afp:'', salud:'', password:'', password2:'' })
    setCode('')
  }

  return (
    <form onSubmit={submit}>
      <input className="form-control mb-2" placeholder="Código de trabajador" value={code} onChange={e=>setCode(e.target.value)} />
      <div className="row">
        <div className="col-md-6 mb-2"><input className="form-control" name="rut" placeholder="RUT" value={form.rut} onChange={handle} /></div>
        <div className="col-md-6 mb-2"><input className="form-control" name="primerNombre" placeholder="Primer nombre" value={form.primerNombre} onChange={handle} /></div>
        <div className="col-md-6 mb-2"><input className="form-control" name="segundoNombre" placeholder="Segundo nombre (opcional)" value={form.segundoNombre} onChange={handle} /></div>
        <div className="col-md-6 mb-2"><input className="form-control" name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handle} /></div>
        <div className="col-md-6 mb-2"><input className="form-control" name="correo" placeholder="Correo" value={form.correo} onChange={handle} /></div>
        <div className="col-md-6 mb-2"><input className="form-control" name="direccion" placeholder="Dirección" value={form.direccion} onChange={handle} /></div>
        <div className="col-md-6 mb-2"><input className="form-control" name="afp" placeholder="AFP" value={form.afp} onChange={handle} /></div>
        <div className="col-md-6 mb-2"><input className="form-control" name="salud" placeholder="ISAPRE o FONASA" value={form.salud} onChange={handle} /></div>
        <div className="col-md-6 mb-2"><input className="form-control" name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handle} /></div>
        <div className="col-md-6 mb-2"><input className="form-control" name="password2" type="password" placeholder="Repetir contraseña" value={form.password2} onChange={handle} /></div>
      </div>
      <div className="form-check mb-2">
        <input type="checkbox" className="form-check-input" id="accept" required />
        <label className="form-check-label" htmlFor="accept">Entiendo que mis datos se solicitan con fines exclusivamente laborales.</label>
      </div>
      <button className="btn btn-success">Registrar trabajador</button>
    </form>
  )
}
