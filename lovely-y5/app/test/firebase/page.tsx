'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '../../../lib/firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'

export default function FirebaseTestPage() {
  const [status, setStatus] = useState('Verificando conexión...')
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    testFirebaseConnection()
  }, [])

  const testFirebaseConnection = async () => {
    const results: string[] = []
    
    try {
      // Test 1: Verificar inicialización de Auth
      results.push('✅ Firebase Auth inicializado correctamente')
      
      // Test 2: Verificar conexión a Firestore
      try {
        const testCollection = collection(db, 'test')
        results.push('✅ Firestore conectado correctamente')
        
        // Test 3: Intentar escribir en Firestore
        try {
          const docRef = await addDoc(testCollection, {
            message: 'Test de conexión',
            timestamp: new Date()
          })
          results.push(`✅ Escritura en Firestore exitosa (ID: ${docRef.id})`)
        } catch (writeError) {
          results.push(`❌ Error escribiendo en Firestore: ${writeError.message}`)
        }
        
        // Test 4: Intentar leer de Firestore
        try {
          const querySnapshot = await getDocs(testCollection)
          results.push(`✅ Lectura de Firestore exitosa (${querySnapshot.size} documentos)`)
        } catch (readError) {
          results.push(`❌ Error leyendo de Firestore: ${readError.message}`)
        }
        
      } catch (firestoreError) {
        results.push(`❌ Error conectando a Firestore: ${firestoreError.message}`)
      }
      
      setStatus('Pruebas completadas')
      setTestResults(results)
      
    } catch (error) {
      setStatus('Error en las pruebas')
      results.push(`❌ Error general: ${error.message}`)
      setTestResults(results)
    }
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>Prueba de Conexión Firebase</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>Estado:</strong> {status}
              </div>
              
              <h5>Resultados de las pruebas:</h5>
              <ul className="list-group">
                {testResults.map((result, index) => (
                  <li key={index} className="list-group-item">
                    {result}
                  </li>
                ))}
              </ul>
              
              <div className="mt-3">
                <button 
                  className="btn btn-primary"
                  onClick={testFirebaseConnection}
                >
                  Repetir Pruebas
                </button>
              </div>
              
              <div className="mt-4">
                <h6>Configuración del Proyecto:</h6>
                <ul className="list-unstyled">
                  <li><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</li>
                  <li><strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</li>
                  <li><strong>API Key:</strong> {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Configurada' : '❌ No configurada'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}