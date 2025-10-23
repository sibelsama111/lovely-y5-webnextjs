// components/ProtectedRoute.tsx
'use client'
import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push('/login')
  }, [user, router])

  if (!user) return null
  return <>{children}</>
}
