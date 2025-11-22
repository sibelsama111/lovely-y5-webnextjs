'use client'
import { useState } from 'react'
import { contactService } from '../../lib/firebaseServices'
import { toast } from 'react-hot-toast'

export default function Contacto() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e: any) => {
    e.preventDefault()
    
    // Validaciones específicas
    if (!form.name.trim()) {
      toast.error('El nombre es obligatorio')
      return
    }
    
    if (form.name.trim().length < 2) {
      toast.error('El nombre debe tener al menos 2 caracteres')
      return
    }
    
    if (!form.email.trim()) {
      toast.error('El correo electrónico es obligatorio')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      toast.error('El formato del correo electrónico no es válido')
      return
    }
    
    if (!form.message.trim()) {
      toast.error('El mensaje es obligatorio')
      return
    }
    
    if (form.message.trim().length < 10) {
      toast.error('El mensaje debe tener al menos 10 caracteres')
      return
    }
    
    setLoading(true)
    try {
      await contactService.create({
        nombre: form.name.trim(),
        email: form.email.trim(),
        asunto: form.subject.trim() || 'Consulta general',
        mensaje: form.message.trim(),
        estado: 'pendiente'
      })
      setSent(true)
      toast.success('Mensaje enviado correctamente. Te contactaremos pronto.')
    } catch (error: any) {
      console.error('Error enviando mensaje:', error)
      if (error.message.includes('network')) {
        toast.error('Error de conexión. Verifica tu conexión a internet')
      } else if (error.message.includes('permission')) {
        toast.error('No tienes permisos para enviar mensajes')
      } else {
        toast.error(`Error al enviar mensaje: ${error.message || 'Inténtalo nuevamente'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-4">
      <h3>Contacto</h3>
      {!sent ? (
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Nombre *</label>
            <input name="name" className="form-control" placeholder="Tu nombre completo" value={form.name} onChange={handle} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email *</label>
            <input name="email" type="email" className="form-control" placeholder="tu@email.com" value={form.email} onChange={handle} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Asunto</label>
            <input name="subject" className="form-control" placeholder="Asunto de tu consulta" value={form.subject} onChange={handle} />
          </div>
          <div className="mb-3">
            <label className="form-label">Mensaje *</label>
            <textarea name="message" className="form-control" rows={5} placeholder="Escribe tu mensaje aquí..." value={form.message} onChange={handle} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      ) : (
        <div className="alert alert-success">Mensaje enviado. Revisaremos y responderemos a tu correo.</div>
      )}
    </div>
  )
}
