// app/admin/contacto/page.tsx
'use client'
import { useEffect, useState } from 'react'

export default function AdminContacto() {
  const [contacts, setContacts] = useState<any[]>([])

  useEffect(()=> {
    fetch('/api/contact').then(r=>r.json()).then(setContacts)
  }, [])

  return (
    <div>
      <h3>Formularios de contacto</h3>
      {contacts.length === 0 && <div className="text-muted">Sin mensajes.</div>}
      {contacts.map((c,i) => (
        <div key={i} className="border p-2 mb-2">
          <div><strong>{c.name}</strong> — {c.email}</div>
          <div><strong>Asunto:</strong> {c.subject}</div>
          <div>{c.message}</div>
          <small className="text-muted">{new Date(c.at || Date.now()).toLocaleString()}</small>
        </div>
      ))}
    </div>
  )
}
