// app/contacto/page.tsx
'use client'
import { useState } from 'react'

export default function Contacto() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handle = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e: any) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { alert('Completa campos'); return }
    await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSent(true)
  }

  return (
    <div className="card p-4">
      <h3>Contacto</h3>
      {!sent ? (
        <form onSubmit={submit}>
          <input name="name" className="form-control mb-2" placeholder="Nombre" value={form.name} onChange={handle} />
          <input name="email" className="form-control mb-2" placeholder="Email" value={form.email} onChange={handle} />
          <input name="subject" className="form-control mb-2" placeholder="Asunto" value={form.subject} onChange={handle} />
          <textarea name="message" className="form-control mb-2" placeholder="Mensaje" value={form.message} onChange={handle} />
          <button className="btn btn-primary">Enviar</button>
        </form>
      ) : (
        <div className="alert alert-success">Mensaje enviado. Revisaremos y responderemos a tu correo.</div>
      )}
    </div>
  )
}
