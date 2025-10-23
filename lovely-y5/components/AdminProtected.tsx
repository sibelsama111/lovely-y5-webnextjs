'use client'

import { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '../context/AuthContext'

export default function AdminProtected({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!user || !user.isWorker) {
      router.push('/admin/login')
    }
  }, [user, router])

  if (!user || !user.isWorker) return null
  return <>{children}</>
}