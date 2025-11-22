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
    if (!form.name || !form.email || !form.message) {
      toast.error('Completa todos los campos obligatorios')
      return
    }
    
    setLoading(true)
    try {
      await contactService.create({
        nombre: form.name,
        email: form.email,
        asunto: form.subject || 'Consulta general',
        mensaje: form.message,
        estado: 'pendiente'
      })
      setSent(true)
    } catch (error) {
      console.error('Error enviando mensaje:', error)
      toast.error('Error al enviar mensaje. Inténtalo nuevamente.')
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
