'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function LoginTrabajadorPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validaciones básicas
    const newErrors = {
      email: !formData.email ? 'El email es requerido' : '',
      password: !formData.password ? 'La contraseña es requerida' : ''
    }

    setErrors(newErrors)

    if (Object.values(newErrors).some(error => error !== '')) {
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Error en el inicio de sesión')
      }

      const data = await response.json()
      
      // Verificar si es trabajador
      if (data.user.rol !== 'trabajador' && data.user.rol !== 'admin') {
        throw new Error('Acceso no autorizado')
      }

      toast.success('Inicio de sesión exitoso')
      router.push('/intranet')
    } catch (error: any) {
      toast.error(error.message || 'Error en el inicio de sesión')
    }
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Acceso Trabajadores</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">
                  Iniciar Sesión
                </button>

                <div className="text-center">
                  <Link href="/intranet/registro" className="text-decoration-none">
                    ¿Eres trabajador y no tienes cuenta? Regístrate aquí
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}