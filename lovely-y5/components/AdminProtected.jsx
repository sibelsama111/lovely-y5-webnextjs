import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '../pages/_app'

export default function AdminProtected({ children }) {
  const { user } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    // Para intranet esperamos user.isWorker === true
    if (!user || !user.isWorker) {
      router.push('/intranet')
    }
  }, [user, router])

  if (!user || !user.isWorker) return null
  return children
}
