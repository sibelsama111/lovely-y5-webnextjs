import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Configuración para desarrollo (emuladores)
const devConfig = {
  apiKey: "demo-api-key",
  authDomain: "lovely-y5-webstore.firebaseapp.com",
  projectId: "lovely-y5-webstore",
  storageBucket: "lovely-y5-webstore.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}

// Configuración para producción
const prodConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Usar configuración de desarrollo si no hay variables de entorno configuradas
const useEmulators = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NODE_ENV === 'development'
const firebaseConfig = useEmulators ? devConfig : prodConfig

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar servicios
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Configurar emuladores en desarrollo
if (typeof window !== 'undefined' && useEmulators) {
  let authEmulatorConnected = false
  let firestoreEmulatorConnected = false
  
  try {
    if (!authEmulatorConnected) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
      authEmulatorConnected = true
    }
  } catch (error) {
    // Auth emulator ya conectado
  }
  
  try {
    if (!firestoreEmulatorConnected) {
      connectFirestoreEmulator(db, 'localhost', 8080)
      firestoreEmulatorConnected = true
    }
  } catch (error) {
    // Firestore emulator ya conectado
  }
  
  if (authEmulatorConnected || firestoreEmulatorConnected) {
    console.log('🔧 Firebase conectado a emuladores locales')
  }
}

export default app