'use client'

import { useState, useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { useRouter } from 'next/navigation'

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
      alert('Credenciales intranet incorrectas')
    }
  }

  return (
    <div className="card p-4">
      <div className="d-flex align-items-center mb-3">
        <img src="/svgs/intranet-logo.svg" width={48} />
        <h4 className="ms-3">IntraLove</h4>
      </div>
      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="RUT" value={rut} onChange={e=>setRut(e.target.value)} />
        <input className="form-control mb-2" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        <button className="btn btn-primary">Entrar</button>
      </form>

      <div className="mt-3">
        <small className="text-muted">¿Eres trabajador? Regístrate desde <strong>Registro trabajadores</strong> (ver /intranet/productos o usar form abajo).</small>
      </div>

      <div className="mt-3 card p-3">
        <h6>Registro de trabajador (requiere código LVLWRKR5)</h6>
        <WorkerRegister />
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
    if (code !== 'LVLWRKR5') { alert('Código inválido'); return }
    if (!form.rut || !form.primerNombre || !form.apellidos || !form.correo || !form.password || form.password !== form.password2) { alert('Completa bien los campos'); return }
    const workers = JSON.parse(localStorage.getItem('lovely_workers') || '[]')
    const neww = {...form, puesto: 'Vendedor/a', sueldoBase: 560000}
    workers.push(neww)
    localStorage.setItem('lovely_workers', JSON.stringify(workers))
    alert('Registro trabajador OK. Ahora inicia sesión en Intranet.')
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
