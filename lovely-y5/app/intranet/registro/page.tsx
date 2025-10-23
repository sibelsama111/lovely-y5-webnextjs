'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

const CODIGO_SECRETO = 'LY5-2023' // Este código debería estar en una variable de entorno

export default function RegistroTrabajadorPage() {
  const [step, setStep] = useState(1)
  const [codigo, setCodigo] = useState('')
  const [formData, setFormData] = useState({
    primerNombre: '',
    apellidos: '',
    rut: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({
    codigo: '',
    primerNombre: '',
    apellidos: '',
    rut: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  })
  const router = useRouter()

  // Validaciones
  const validateCode = (code: string) => {
    if (!code) return 'El código es requerido'
    if (code !== CODIGO_SECRETO) return 'Código inválido'
    return ''
  }

  const validateRut = (rut: string) => {
    if (!rut) return 'El RUT es requerido'
    const rutRegex = /^[0-9]+-[0-9kK]$/
    if (!rutRegex.test(rut)) return 'Formato de RUT inválido (ej: 12345678-9)'
    return ''
  }

  const validateEmail = (email: string) => {
    if (!email) return 'El email es requerido'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Email inválido'
    return ''
  }

  const validatePhone = (phone: string) => {
    if (!phone) return 'El teléfono es requerido'
    const phoneRegex = /^[0-9]{9}$/
    if (!phoneRegex.test(phone)) return 'El teléfono debe tener 9 dígitos'
    return ''
  }

  const validatePassword = (password: string) => {
    if (!password) return 'La contraseña es requerida'
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
    return ''
  }

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) return 'Debe confirmar la contraseña'
    if (confirmPassword !== formData.password) return 'Las contraseñas no coinciden'
    return ''
  }

  const handleCodeSubmit = (e: FormEvent) => {
    e.preventDefault()
    const codeError = validateCode(codigo)
    setErrors(prev => ({ ...prev, codigo: codeError }))
    
    if (!codeError) {
      setStep(2)
    }
  }

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validar todos los campos
    const newErrors = {
      codigo: '',
      primerNombre: !formData.primerNombre ? 'El nombre es requerido' : '',
      apellidos: !formData.apellidos ? 'Los apellidos son requeridos' : '',
      rut: validateRut(formData.rut),
      email: validateEmail(formData.email),
      telefono: validatePhone(formData.telefono),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword)
    }

    setErrors(newErrors)

    // Si hay algún error, no continuar
    if (Object.values(newErrors).some(error => error !== '')) {
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          rol: 'trabajador',
          codigoSecreto: codigo
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Error en el registro')
      }

      toast.success('Registro exitoso')
      router.push('/intranet/login')
    } catch (error: any) {
      toast.error(error.message || 'Error en el registro')
    }
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Registro de Trabajador</h2>
              
              {step === 1 ? (
                <form onSubmit={handleCodeSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Código de autorización</label>
                    <input
                      type="text"
                      className={`form-control ${errors.codigo ? 'is-invalid' : ''}`}
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value)}
                      placeholder="Ingresa el código secreto"
                      required
                    />
                    {errors.codigo && (
                      <div className="invalid-feedback">{errors.codigo}</div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Verificar Código
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className={`form-control ${errors.primerNombre ? 'is-invalid' : ''}`}
                      value={formData.primerNombre}
                      onChange={(e) => setFormData({ ...formData, primerNombre: e.target.value })}
                      required
                    />
                    {errors.primerNombre && (
                      <div className="invalid-feedback">{errors.primerNombre}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Apellidos</label>
                    <input
                      type="text"
                      className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`}
                      value={formData.apellidos}
                      onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                      required
                    />
                    {errors.apellidos && (
                      <div className="invalid-feedback">{errors.apellidos}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">RUT</label>
                    <input
                      type="text"
                      className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                      value={formData.rut}
                      onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                      placeholder="12345678-9"
                      required
                    />
                    {errors.rut && (
                      <div className="invalid-feedback">{errors.rut}</div>
                    )}
                  </div>

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
                    <label className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, '') })}
                      placeholder="912345678"
                      required
                    />
                    {errors.telefono && (
                      <div className="invalid-feedback">{errors.telefono}</div>
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

                  <div className="mb-3">
                    <label className="form-label">Confirmar Contraseña</label>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Registrarse
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}