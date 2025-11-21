// context/FirebaseAuthContext.tsx
'use client'
import React, { createContext, useState, useEffect, useContext } from 'react'
import { 
  User,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

export type FirebaseUserType = {
  uid: string
  email: string
  displayName?: string
  // Campos personalizados
  primerNombre?: string
  segundoNombre?: string
  apellidos?: string
  telefono?: string
  direccion?: string
  isWorker?: boolean
  puesto?: string
  sueldoBase?: number
  rol?: 'cliente' | 'trabajador' | 'admin'
}

type FirebaseAuthContextProps = {
  user: FirebaseUserType | null
  loading: boolean
  signUp: (email: string, password: string, userData: Partial<FirebaseUserType>) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const FirebaseAuthContext = createContext<FirebaseAuthContextProps>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {}
})

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        // Obtener datos adicionales del usuario desde Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        const userData = userDoc.exists() ? userDoc.data() : {}
        
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          ...userData
        } as FirebaseUserType)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData: Partial<FirebaseUserType>) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
    
    // Guardar datos adicionales en Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      email,
      ...userData,
      createdAt: new Date()
    })
  }

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <FirebaseAuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      logout
    }}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext)
  if (!context) {
    throw new Error('useFirebaseAuth debe ser usado dentro de FirebaseAuthProvider')
  }
  return context
}