// lib/firebase-dev.js
// Configuración de Firebase para desarrollo con emuladores

import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "lovely-y5-webstore.firebaseapp.com",
  projectId: "lovely-y5-webstore",
  storageBucket: "lovely-y5-webstore.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar servicios
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Configurar emuladores solo en desarrollo
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Conectar a emuladores si no están ya conectados
  if (!auth._delegate._isProactiveRefreshEnabled) {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  }
  
  if (!db._delegate._settings?.host?.includes('localhost')) {
    connectFirestoreEmulator(db, 'localhost', 8080)
  }
  
  console.log('🔧 Firebase conectado a emuladores locales')
}

export default app