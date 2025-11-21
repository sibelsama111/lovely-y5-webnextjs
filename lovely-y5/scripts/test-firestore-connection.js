// scripts/test-firestore-connection.js
// Script para probar la conexión a Firestore

const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDocs } = require('firebase/firestore')
require('dotenv').config({ path: '.env.local' })

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

async function testFirestoreConnection() {
  try {
    console.log('🔧 Probando conexión a Firestore...')
    
    // Verificar variables de entorno
    if (!firebaseConfig.apiKey) {
      throw new Error('❌ Variables de entorno de Firebase no configuradas. Crea un archivo .env.local con tu configuración.')
    }
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    console.log('✅ Firebase inicializado correctamente')
    
    // Probar lectura de productos
    console.log('📱 Probando lectura de productos...')
    const productsSnapshot = await getDocs(collection(db, 'products'))
    console.log(`✅ Productos encontrados: ${productsSnapshot.size}`)
    
    if (productsSnapshot.size > 0) {
      productsSnapshot.forEach((doc) => {
        const data = doc.data()
        console.log(`  - ${data.nombre} (${data.codigo})`)
      })
    } else {
      console.log('ℹ️  No hay productos en la base de datos. Agrega algunos productos usando Firebase Console.')
    }
    
    // Probar lectura de farmacias
    console.log('🏥 Probando lectura de farmacias...')
    const farmaciasSnapshot = await getDocs(collection(db, 'farmacias'))
    console.log(`✅ Farmacias encontradas: ${farmaciasSnapshot.size}`)
    
    if (farmaciasSnapshot.size > 0) {
      farmaciasSnapshot.forEach((doc) => {
        const data = doc.data()
        console.log(`  - ${data.nombre}`)
      })
    }
    
    console.log('🎉 ¡Conexión a Firestore exitosa!')
    
  } catch (error) {
    console.error('❌ Error conectando a Firestore:', error.message)
    console.error('\n📋 Pasos para solucionar:')
    console.error('1. Verifica que existe el archivo .env.local con la configuración de Firebase')
    console.error('2. Verifica que las variables de entorno están correctamente configuradas')
    console.error('3. Verifica que Firestore está habilitado en Firebase Console')
    console.error('4. Verifica que las reglas de seguridad permiten lectura pública de productos')
    process.exit(1)
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testFirestoreConnection()
}

module.exports = { testFirestoreConnection }