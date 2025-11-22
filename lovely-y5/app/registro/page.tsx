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
    RUT: '', 
    nombres: '', 
    apellidos: '', 
    email: '', 
    telefono: '', 
    direccion: {
      calle: '',
      numero: 0,
      comuna: '',
      region: 'Valparaiso'
    },
    password: '', 
    password2: '',
    fotoPerfil: ''
  })
  const [loading, setLoading] = useState(false)

  const handle = (e: any) => {
    let value = e.target.value
    const name = e.target.name
    
    if (name === 'RUT') {
      value = value.replace(/[^0-9kK]/g, '').toUpperCase()
    }
    
    // Manejar campos de dirección
    if (name.startsWith('direccion.')) {
      const field = name.split('.')[1]
      // Convertir numero a entero
      const fieldValue = field === 'numero' ? parseInt(value) || 0 : value
      setForm({ 
        ...form, 
        direccion: { 
          ...form.direccion, 
          [field]: fieldValue 
        } 
      })
    } else if (name === 'telefono') {
      // Convertir teléfono a número entero
      setForm({ ...form, [name]: parseInt(value.replace(/\D/g, '')) || '' })
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
    if (!/^[0-9]{7,9}[0-9K]$/.test(rut)) return false
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
      if (!form.RUT.trim()) {
        toast.error('El RUT es obligatorio')
        return
      }
      
      if (!validateRUT(form.RUT)) {
        const correctDV = calculateCorrectDV(form.RUT)
        toast.error(`RUT inválido. El dígito verificador correcto para ${form.RUT.slice(0, -1)} sería: ${correctDV}`)
        return
      }
      
      if (!form.nombres.trim()) {
        toast.error('Los nombres son obligatorios')
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

      if (!form.telefono) {
        toast.error('El teléfono es obligatorio')
        return
      }

      // Validar dirección completa
      if (!form.direccion.calle.trim()) {
        toast.error('La calle es obligatoria')
        return
      }
      
      if (!form.direccion.numero || form.direccion.numero === 0) {
        toast.error('El número de dirección es obligatorio')
        return
      }
      
      if (!form.direccion.comuna.trim()) {
        toast.error('La comuna es obligatoria')
        return
      }
      
      if (!form.direccion.region.trim()) {
        toast.error('La región es obligatoria')
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
      
      const rawUserData = {
        RUT: form.RUT,
        nombres: form.nombres,
        apellidos: form.apellidos,
        email: form.email,
        telefono: form.telefono,
        direccion: {
          calle: form.direccion.calle,
          numero: form.direccion.numero,
          comuna: form.direccion.comuna,
          region: form.direccion.region
        },
        password: form.password,
        rol: 'cliente',
        fotoPerfil: form.fotoPerfil || '',
        createdAt: new Date()
      }

      const userId = await userService.create(rawUserData)
      if (userId) {
        const nombreSplit = form.nombres.split(' ')
        const primerNombre = nombreSplit[0] || ''
        const segundoNombre = nombreSplit.slice(1).join(' ') || ''
        const normalizedUser = {
          rut: form.RUT,
            primerNombre,
            segundoNombre,
            apellidos: form.apellidos,
            correo: form.email,
            telefono: String(form.telefono),
            direccion: `${form.direccion.calle} ${form.direccion.numero}, ${form.direccion.comuna}, ${form.direccion.region}`,
            rol: 'cliente'
        }
        setUser(normalizedUser as any)
        toast.success('Registro exitoso')
        router.push('/')
      }
    } catch (error: any) {
      console.error('Error en registro:', error)
      if (error.message.includes('already exists')) {
        toast.error(`El RUT ${form.RUT} ya está registrado en el sistema`)
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
              name="RUT" 
              className="form-control" 
              placeholder="RUT (ej: 201758645)" 
              value={form.RUT} 
              onChange={handle} 
              required 
            />
            <small className="text-muted">Sin puntos ni guión</small>
          </div>
          
          <div className="col-md-4 mb-2">
            <input 
              name="nombres" 
              className="form-control" 
              placeholder="Nombres (ej: Gino Maximiliano)" 
              value={form.nombres} 
              onChange={handle} 
              required 
            />
          </div>
          
          <div className="col-md-4 mb-2">
            <input 
              name="apellidos" 
              className="form-control" 
              placeholder="Apellidos (ej: Jofré Hidalgo)" 
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
              placeholder="Correo electrónico (ej: gino.jofre@gmail.com)" 
              value={form.email} 
              onChange={handle} 
              required 
            />
          </div>
          
          <div className="col-md-6 mb-2">
            <input 
              name="telefono" 
              type="tel"
              className="form-control" 
              placeholder="Teléfono (ej: 973675321)" 
              value={form.telefono} 
              onChange={handle}
              required 
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
              placeholder="Calle/Avenida (ej: Ossandon)" 
              value={form.direccion.calle} 
              onChange={handle} 
              required 
            />
          </div>
          
          <div className="col-md-3 mb-2">
            <input 
              name="direccion.numero" 
              type="number"
              className="form-control" 
              placeholder="Número (ej: 401)" 
              value={form.direccion.numero || ''} 
              onChange={handle} 
              required 
            />
          </div>
          
          <div className="col-md-3 mb-2">
            <input 
              name="direccion.comuna" 
              className="form-control" 
              placeholder="Comuna (ej: Valparaiso)" 
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
              <option value="Valparaiso">Valparaiso</option>
              <option value="Región Metropolitana">Región Metropolitana</option>
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

          {/* Foto de Perfil */}
          <div className="col-12 mb-3 mt-3">
            <h5 className="text-muted">Foto de Perfil (Opcional)</h5>
          </div>
          
          <div className="col-md-12 mb-2">
            <input 
              name="fotoPerfil" 
              className="form-control" 
              placeholder="URL de foto de perfil (opcional)" 
              value={form.fotoPerfil} 
              onChange={handle} 
            />
            <small className="text-muted">Puedes dejar este campo vacío si lo deseas</small>
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
