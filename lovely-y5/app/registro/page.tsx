'use client'
import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { userService } from '../../lib/firebaseServices'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function RegistroPage() {
  const { setUser } = useContext(AuthContext)
  const router = useRouter()
  const [form, setForm] = useState({
    rut: '', primerNombre: '', segundoNombre: '', apellidos: '', correo: '', telefono: '', direccion: '', password: '', password2: ''
  })
  const [loading, setLoading] = useState(false)

  const handle = (e: any) => {
    let value = e.target.value
    if (e.target.name === 'rut') {
      value = value.replace(/[^0-9kK]/g, '').toUpperCase()
    }
    setForm({ ...form, [e.target.name]: value })
  }

  const calculateCorrectDV = (rut: string) => {
    const cleanRut = rut.slice(0, -1)
    let sum = 0
    let multiplier = 2
    for (let i = cleanRut.length - 1; i >= 0; i--) {
      sum += parseInt(cleanRut[i]) * multiplier
      multiplier = multiplier === 7 ? 2 : multiplier + 1
    }
    const remainder = sum % 11
    return remainder === 0 ? '0' : remainder === 1 ? 'K' : String(11 - remainder)
  }

  const validateRUT = (rut: string) => {
    if (!/^[0-9]{7,8}[0-9K]$/.test(rut)) return false
    const cleanRut = rut.slice(0, -1)
    const dv = rut.slice(-1)
    const calculatedDV = calculateCorrectDV(rut)
    return dv === calculatedDV
  }

  const submit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validaciones específicas con mensajes detallados
      if (!form.rut.trim()) {
        toast.error('El RUT es obligatorio')
        return
      }
      
      if (!form.primerNombre.trim()) {
        toast.error('El primer nombre es obligatorio')
        return
      }
      
      if (!form.apellidos.trim()) {
        toast.error('Los apellidos son obligatorios')
        return
      }
      
      if (!form.correo.trim()) {
        toast.error('El correo electrónico es obligatorio')
        return
      }
      
      // Validar formato de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.correo)) {
        toast.error('El formato del correo electrónico no es válido')
        return
      }
      
      if (!form.password) {
        toast.error('La contraseña es obligatoria')
        return
      }
      
      if (form.password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres')
        return
      }
      
      if (!form.password2) {
        toast.error('Debe confirmar la contraseña')
        return
      }
      
      if (form.password !== form.password2) {
        toast.error('Las contraseñas no coinciden')
        return
      }
      
      if (!validateRUT(form.rut)) {
        const correctDV = calculateCorrectDV(form.rut)
        toast.error(`RUT inválido. El dígito verificador correcto para ${form.rut.slice(0, -1)} sería: ${correctDV}`)
        return
      }
      
      const userData = {
        rut: form.rut,
        primerNombre: form.primerNombre,
        segundoNombre: form.segundoNombre || '',
        apellidos: form.apellidos,
        correo: form.correo,
        telefono: form.telefono,
        direccion: form.direccion,
        password: form.password,
        rol: 'cliente' as 'cliente',
        activo: true
      }
      
      console.log('🔧 Intentando crear usuario:', userData)
      
      const userId = await userService.create(userData)
      console.log('✅ Usuario creado con ID:', userId)
      
      if (userId) {
        setUser(userData)
        toast.success('Registro exitoso')
        router.push('/')
      }
    } catch (error: any) {
      console.error('Error en registro:', error)
      if (error.message.includes('already exists')) {
        toast.error(`El RUT ${form.rut} ya está registrado en el sistema`)
      } else if (error.message.includes('network')) {
        toast.error('Error de conexión. Verifica tu conexión a internet')
      } else if (error.message.includes('permission')) {
        toast.error('No tienes permisos para realizar esta operación')
      } else if (error.message.includes('invalid-email')) {
        toast.error('El formato del correo electrónico no es válido')
      } else {
        toast.error(`Error en el registro: ${error.message || 'Error desconocido'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-4">
      <h3>Registro</h3>
      <form onSubmit={submit}>
        <div className="row">
          <div className="col-md-4 mb-2">
            <input name="rut" className="form-control" placeholder="RUT (ej: 12345678K)" value={form.rut} onChange={handle} required />
            <small className="text-muted">Sin puntos ni guión</small>
          </div>
          <div className="col-md-4 mb-2"><input name="primerNombre" className="form-control" placeholder="Primer nombre" value={form.primerNombre} onChange={handle} required /></div>
          <div className="col-md-4 mb-2"><input name="segundoNombre" className="form-control" placeholder="Segundo nombre (opcional)" value={form.segundoNombre} onChange={handle} /></div>
          <div className="col-md-6 mb-2"><input name="apellidos" className="form-control" placeholder="Apellidos" value={form.apellidos} onChange={handle} required /></div>
          <div className="col-md-6 mb-2"><input name="correo" type="email" className="form-control" placeholder="Correo" value={form.correo} onChange={handle} required /></div>
          <div className="col-md-4 mb-2"><input name="telefono" className="form-control" placeholder="Teléfono" value={form.telefono} onChange={handle} /></div>
          <div className="col-md-8 mb-2"><input name="direccion" className="form-control" placeholder="Dirección" value={form.direccion} onChange={handle} /></div>
          <div className="col-md-6 mb-2"><input name="password" type="password" className="form-control" placeholder="Contraseña" value={form.password} onChange={handle} required /></div>
          <div className="col-md-6 mb-2"><input name="password2" type="password" className="form-control" placeholder="Repite contraseña" value={form.password2} onChange={handle} required /></div>
        </div>
        <div className="mt-3">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  )
}
