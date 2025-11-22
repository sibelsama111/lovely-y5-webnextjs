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

        <div className="mb-3 d-flex">
          <div className="me-auto">
            <button type="button" className="btn btn-link p-0" onClick={() => router.back()}>
              ← Volver
            </button>
            <button type="button" className="btn btn-link p-0 ms-3" onClick={() => router.push('/login')}>
              Volver a inicio (cliente)
            </button>
          </div>
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
