// app/login/page.tsx
'use client'
import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useContext(AuthContext)
  const router = useRouter()

  const submit = (e: any) => {
    e.preventDefault()
    try {
      const u = JSON.parse(localStorage.getItem('lovely_user') || 'null')
      if (!u) { alert('No hay usuarios registrados. Regístrate.'); return }
      if ((u.correo === identifier || u.telefono === identifier) && u.password === password) {
        setUser(u)
        alert('Login OK')
        router.push('/')
      } else {
        alert('Credenciales incorrectas')
      }
    } catch (e) {
      alert('Error demo')
    }
  }

  return (
    <div className="container">
      <div className="auth-container">
        <div className="text-center mb-4">
          <img src="/svgs/logo.svg" alt="Lovely Y5" width={80} height={80} />
          <h3 className="mt-3">Iniciar sesión</h3>
        </div>
        
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Correo o Teléfono</label>
            <input 
              className="form-control" 
              placeholder="Ingresa tu correo o teléfono"
              value={identifier} 
              onChange={e => setIdentifier(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
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
              onClick={() => router.push('/registro')}
            >
              Registrarse
            </button>
          </div>

          <div className="text-center mt-4">
            <button 
              type="button"
              className="btn btn-link text-decoration-none"
              onClick={() => router.push('/admin/login')}
            >
              Acceso Intranet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
