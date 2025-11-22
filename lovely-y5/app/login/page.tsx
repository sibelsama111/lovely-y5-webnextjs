'use client'
import { useState, useContext } from 'react'
import { AuthContext, UserType } from '../../context/AuthContext'
import { userService } from '../../lib/firebaseServices'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

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
      // Validaciones específicas
      if (!identifier.trim()) {
        toast.error('Debe ingresar su RUT, correo o teléfono')
        return
      }
      
      if (!password.trim()) {
        toast.error('Debe ingresar su contraseña')
        return
      }
      
      const cleanIdentifier = identifier.replace(/[^0-9kK@.]/g, '').toUpperCase()
      const authUser = await userService.authenticate(cleanIdentifier, password)
      if (authUser && typeof authUser === 'object' && 'primerNombre' in authUser) {
        const userObj = authUser as UserType
        setUser(userObj)
        toast.success(`Bienvenido/a ${userObj.primerNombre}`)
        router.push('/')
      } else {
        if (identifier.includes('@')) {
          toast.error('Correo electrónico o contraseña incorrectos')
        } else if (/^[0-9]{8,9}$/.test(identifier.replace(/\D/g, ''))) {
          toast.error('Teléfono o contraseña incorrectos')
        } else {
          toast.error('RUT o contraseña incorrectos')
        }
      }
    } catch (error: any) {
      console.error('Error en login:', error)
      if (error.message.includes('network')) {
        toast.error('Error de conexión. Verifica tu conexión a internet')
      } else if (error.message.includes('permission')) {
        toast.error('No tienes permisos para acceder')
      } else {
        toast.error(`Error al iniciar sesión: ${error.message || 'Inténtalo nuevamente'}`)
      }
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
