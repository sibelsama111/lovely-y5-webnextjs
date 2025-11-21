'use client'
import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { userService } from '../../lib/firebaseServices'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useContext(AuthContext)
  const router = useRouter()

  const submit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const cleanIdentifier = identifier.replace(/[^0-9kK@.]/g, '').toUpperCase()
      const user = await userService.authenticate(cleanIdentifier, password)
      
      if (user && (user as any).primerNombre) {
        setUser(user as any)
        alert('Login exitoso')
        router.push('/')
      } else {
        alert('Credenciales incorrectas')
      }
    } catch (error) {
      console.error('Error en login:', error)
      alert('Error al iniciar sesión. Inténtalo nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="auth-container">
        <div className="text-center mb-4">
          <img src="/logo.svg" alt="Lovely Y5" width={80} height={80} />
          <h3 className="mt-3">Iniciar sesión</h3>
        </div>
        
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">RUT, Correo o Teléfono</label>
            <input 
              className="form-control" 
              placeholder="Ingresa tu RUT, correo o teléfono"
              value={identifier} 
              onChange={e => setIdentifier(e.target.value)}
              required
            />
            <small className="text-muted">RUT sin formato: 12345678K</small>
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
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
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
