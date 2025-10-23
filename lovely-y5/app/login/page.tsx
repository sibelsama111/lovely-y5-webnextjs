// app/login/page.tsx
'use client'
import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useContext(AuthContext)
  const router = useRouter()

  const submit = (e: any) => {
    e.preventDefault()
    try {
      const u = JSON.parse(localStorage.getItem('lovely_user') || 'null')
      if (!u) { alert('No hay usuarios registrados. Regístrate.'); return }
      if ((u.correo === identifier || u.telefono === identifier) && u.password === password) {
        setUser(u)
        alert('Login OK')
        router.push('/')
      } else {
        alert('Credenciales incorrectas')
      }
    } catch (e) {
      alert('Error demo')
    }
  }

  return (
    <div className="card p-4">
      <h3>Iniciar sesión</h3>
      <form onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Correo o Teléfono" value={identifier} onChange={e => setIdentifier(e.target.value)} />
        <input className="form-control mb-2" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-primary">Iniciar sesión</button>
      </form>
    </div>
  )
}
