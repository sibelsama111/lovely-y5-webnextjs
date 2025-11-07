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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center mb-4">
            <p className="text-muted">Ingresa a tu cuenta seleccionando tu sede y rol de usuario.</p>
          </div>

          <div className="card">
            <div className="card-body">
              {/* Pestañas de sede */}
              <div className="d-flex justify-content-center mb-3">
                <div className="btn-group" role="group" aria-label="Sedes">
                  <button type="button" className="btn btn-outline-primary active">Santiago</button>
                  <button type="button" className="btn btn-outline-primary">Viña del Mar</button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row mb-3 justify-content-center">
                  <div className="col-6 col-md-4">
                    <label className="form-label">RUT</label>
                    <div className="d-flex">
                      <input
                        type="text"
                        className={`form-control me-2`}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="12345678-9"
                        required
                      />
                      <input
                        type="text"
                        className="form-control" 
                        style={{maxWidth: '60px'}}
                        placeholder="DV"
                        aria-label="DV"
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3 justify-content-center">
                  <div className="col-8 col-md-6">
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
                </div>

                <div className="row mb-3 justify-content-center">
                  <div className="col-8 col-md-4">
                    <label className="form-label">-- Rol usuario</label>
                    <select className="form-select">
                      <option>-- Rol usuario</option>
                      <option value="trabajador">Trabajador</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>

                <div className="row mb-3 justify-content-center">
                  <div className="col-8 col-md-6 text-center">
                    <a href="#" className="d-block mb-3">¿Olvidó su contraseña?</a>
                    <button type="submit" className="btn btn-primary px-5">Entrar</button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Footer social simple al estilo del sitio */}
          <div className="text-center mt-5">
            <p className="text-muted">Síguenos en redes sociales:</p>
            <div className="d-flex justify-content-center gap-3">
              <img src="/facebook.svg" alt="fb" width={36} />
              <img src="/twitter.svg" alt="tw" width={36} />
              <img src="/instagram.svg" alt="ig" width={36} />
              <img src="/linkedin.svg" alt="ln" width={36} />
              <img src="/youtube.svg" alt="yt" width={36} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}