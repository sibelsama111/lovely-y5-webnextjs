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
    rut: '', 
    nombres: '', 
    apellidos: '', 
    email: '', 
    telefono: '', 
    direccion: {
      calle: '',
      numero: '',
      comuna: '',
      region: 'Región Metropolitana'
    },
    password: '', 
    password2: '',
    fotoPerfil: null
  })
  const [loading, setLoading] = useState(false)

  const handle = (e: any) => {
    let value = e.target.value
    const name = e.target.name
    
    if (name === 'rut') {
      value = value.replace(/[^0-9kK]/g, '').toUpperCase()
    }
    
    // Manejar campos de dirección
    if (name.startsWith('direccion.')) {
      const field = name.split('.')[1]
      setForm({ 
        ...form, 
        direccion: { 
          ...form.direccion, 
          [field]: value 
        } 
      })
    } else {
      setForm({ ...form, [name]: value })
    }
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
      
      if (!form.nombres.trim()) {
        toast.error('El nombre completo es obligatorio')
        return
      }
      
      if (!form.apellidos.trim()) {
        toast.error('Los apellidos son obligatorios')
        return
      }
      
      if (!form.email.trim()) {
        toast.error('El correo electrónico es obligatorio')
        return
      }
      
      // Validar formato de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.email)) {
        toast.error('El formato del correo electrónico no es válido')
        return
      }

      // Validar dirección completa
      if (!form.direccion.calle.trim()) {
        toast.error('La calle es obligatoria')
        return
      }
      
      if (!form.direccion.numero.trim()) {
        toast.error('El número de dirección es obligatorio')
        return
      }
      
      if (!form.direccion.comuna.trim()) {
        toast.error('La comuna es obligatoria')
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
        nombres: form.nombres,
        apellidos: form.apellidos,
        email: form.email,
        telefono: form.telefono || '',
        direccion: form.direccion,
        password: form.password, // ⚠️ Se almacena en texto plano - ver documentación
        rol: 'cliente' as 'cliente',
        fotoPerfil: form.fotoPerfil,
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
          {/* Información Personal */}
          <div className="col-12 mb-3">
            <h5 className="text-muted">Información Personal</h5>
          </div>
          
          <div className="col-md-4 mb-2">
            <input 
              name="rut" 
              className="form-control" 
              placeholder="RUT (ej: 12345678K)" 
              value={form.rut} 
              onChange={handle} 
              required 
            />
            <small className="text-muted">Sin puntos ni guión</small>
          </div>
          
          <div className="col-md-4 mb-2">
            <input 
              name="nombres" 
              className="form-control" 
              placeholder="Nombre completo" 
              value={form.nombres} 
              onChange={handle} 
              required 
            />
          </div>
          
          <div className="col-md-4 mb-2">
            <input 
              name="apellidos" 
              className="form-control" 
              placeholder="Apellidos" 
              value={form.apellidos} 
              onChange={handle} 
              required 
            />
          </div>

          {/* Información de Contacto */}
          <div className="col-12 mb-3 mt-3">
            <h5 className="text-muted">Información de Contacto</h5>
          </div>
          
          <div className="col-md-6 mb-2">
            <input 
              name="email" 
              type="email" 
              className="form-control" 
              placeholder="Correo electrónico" 
              value={form.email} 
              onChange={handle} 
              required 
            />
          </div>
          
          <div className="col-md-6 mb-2">
            <input 
              name="telefono" 
              className="form-control" 
              placeholder="Teléfono (opcional)" 
              value={form.telefono} 
              onChange={handle} 
            />
          </div>

          {/* Dirección Completa */}
          <div className="col-12 mb-3 mt-3">
            <h5 className="text-muted">Dirección</h5>
          </div>
          
          <div className="col-md-6 mb-2">
            <input 
              name="direccion.calle" 
              className="form-control" 
              placeholder="Calle/Avenida" 
              value={form.direccion.calle} 
              onChange={handle} 
              required 
            />
          </div>
          
          <div className="col-md-3 mb-2">
            <input 
              name="direccion.numero" 
              className="form-control" 
              placeholder="Número" 
              value={form.direccion.numero} 
              onChange={handle} 
              required 
            />
          </div>
          
          <div className="col-md-3 mb-2">
            <input 
              name="direccion.comuna" 
              className="form-control" 
              placeholder="Comuna" 
              value={form.direccion.comuna} 
              onChange={handle} 
              required 
            />
          </div>
          
          <div className="col-md-6 mb-2">
            <select 
              name="direccion.region" 
              className="form-control" 
              value={form.direccion.region} 
              onChange={handle} 
              required
            >
              <option value="Región Metropolitana">Región Metropolitana</option>
              <option value="Región de Valparaíso">Región de Valparaíso</option>
              <option value="Región del Biobío">Región del Biobío</option>
              <option value="Región de La Araucanía">Región de La Araucanía</option>
              <option value="Región de Los Lagos">Región de Los Lagos</option>
              <option value="Región de Antofagasta">Región de Antofagasta</option>
              <option value="Región de Atacama">Región de Atacama</option>
              <option value="Región de Coquimbo">Región de Coquimbo</option>
              <option value="Región del Libertador Bernardo O'Higgins">Región del Libertador Bernardo O'Higgins</option>
              <option value="Región del Maule">Región del Maule</option>
              <option value="Región de Ñuble">Región de Ñuble</option>
              <option value="Región de Los Ríos">Región de Los Ríos</option>
              <option value="Región de Aysén">Región de Aysén</option>
              <option value="Región de Magallanes">Región de Magallanes</option>
              <option value="Región de Arica y Parinacota">Región de Arica y Parinacota</option>
              <option value="Región de Tarapacá">Región de Tarapacá</option>
            </select>
          </div>

          {/* Seguridad */}
          <div className="col-12 mb-3 mt-3">
            <h5 className="text-muted">Seguridad</h5>
          </div>
          
          <div className="col-md-6 mb-2">
            <input 
              name="password" 
              type="password" 
              className="form-control" 
              placeholder="Contraseña (mínimo 6 caracteres)" 
              value={form.password} 
              onChange={handle} 
              required 
            />
          </div>
          
          <div className="col-md-6 mb-2">
            <input 
              name="password2" 
              type="password" 
              className="form-control" 
              placeholder="Confirmar contraseña" 
              value={form.password2} 
              onChange={handle} 
              required 
            />
          </div>
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
