// context/AuthContext.tsx
'use client'
import React, { createContext, useState, useEffect } from 'react'

export type UserType = {
  rut?: string
  primerNombre: string
  segundoNombre?: string
  apellidos: string
  correo: string
  telefono?: string
  direccion?: string
  password?: string
  isWorker?: boolean
  puesto?: string
  sueldoBase?: number
  orders?: any[]
  rol?: 'cliente' | 'trabajador' | 'admin'
}

type AuthContextProps = {
  user: UserType | null
  setUser: (u: UserType | null) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  logout: () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    try {
      const s = localStorage.getItem('lovely_user')
      if (s) setUser(JSON.parse(s))
    } catch (e) {}
  }, [])

  useEffect(() => {
    if (user) localStorage.setItem('lovely_user', JSON.stringify(user))
    else localStorage.removeItem('lovely_user')
  }, [user])

  const logout = () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>
}
