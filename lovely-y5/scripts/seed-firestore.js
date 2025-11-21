// scripts/seed-firestore.js
// Script para poblar Firestore con datos iniciales de Lovely Y5

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, addDoc } from 'firebase/firestore'
import { config } from 'dotenv'

// Cargar variables de entorno
config()

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Datos de ejemplo para productos
const sampleProducts = [
  {
    codigo: 'LVL5_IPHONE12_128GB',
    nombre: 'iPhone 12',
    marca: 'Apple',
    tipo: 'iPhones',
    precio: 399990,
    imagenes: ['/products/iPhone-12.png'],
    descripcion: 'Reacondicionado - 128GB - Como nuevo',
    detalles: 'Procesador A14 Bionic - Pantalla 6.1" - Cámara dual 12MP',
    fichaTecnica: {
      procesador: 'A14 Bionic',
      pantalla: '6.1"',
      almacenamiento: '128GB',
      camara: 'Dual 12MP',
      estado: 'Reacondicionado'
    },
    stock: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    codigo: 'LVL5_IPADAIR_64GB',
    nombre: 'iPad Air',
    marca: 'Apple',
    tipo: 'iPads',
    precio: 449990,
    imagenes: ['/products/ipadaira1474.png'],
    descripcion: 'Reacondicionado - 64GB - Como nuevo',
    detalles: 'Procesador A14 - Pantalla 10.9" - Cámara 12MP',
    fichaTecnica: {
      procesador: 'A14',
      pantalla: '10.9"',
      almacenamiento: '64GB',
      camara: '12MP',
      estado: 'Reacondicionado'
    },
    stock: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    codigo: 'LVL5_GALAXYS21_256GB',
    nombre: 'Samsung Galaxy S21',
    marca: 'Samsung',
    tipo: 'Smartphones',
    precio: 299990,
    imagenes: ['/products/galaxy-s21.png'],
    descripcion: 'Reacondicionado - 256GB - Excelente estado',
    detalles: 'Procesador Exynos 2100 - Pantalla 6.2" - Cámara triple 64MP',
    fichaTecnica: {
      procesador: 'Exynos 2100',
      pantalla: '6.2"',
      almacenamiento: '256GB',
      camara: 'Triple 64MP',
      estado: 'Reacondicionado'
    },
    stock: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    codigo: 'LVL5_MACBOOKAIR_M1',
    nombre: 'MacBook Air M1',
    marca: 'Apple',
    tipo: 'Laptops',
    precio: 899990,
    imagenes: ['/products/macbook-air-m1.png'],
    descripcion: 'Reacondicionado - 256GB SSD - 8GB RAM',
    detalles: 'Chip M1 - Pantalla 13.3" - Batería hasta 18 horas',
    fichaTecnica: {
      procesador: 'Apple M1',
      pantalla: '13.3"',
      almacenamiento: '256GB SSD',
      ram: '8GB',
      estado: 'Reacondicionado'
    },
    stock: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Farmacias de turno de ejemplo
const sampleFarmacias = [
  {
    nombre: 'Farmacia Cruz Verde',
    direccion: 'Av. Providencia 1234, Providencia',
    telefono: '+56 2 2234 5678',
    horario: '24 horas',
    fecha: new Date().toISOString().split('T')[0],
    ubicacion: {
      lat: -33.4264,
      lng: -70.6128
    },
    createdAt: new Date()
  },
  {
    nombre: 'Farmacia Salcobrand',
    direccion: 'Av. Las Condes 5678, Las Condes',
    telefono: '+56 2 2567 8900',
    horario: '24 horas',
    fecha: new Date().toISOString().split('T')[0],
    ubicacion: {
      lat: -33.4025,
      lng: -70.5731
    },
    createdAt: new Date()
  }
]

// Categorías de productos
const sampleCategories = [
  {
    nombre: 'iPhones',
    descripcion: 'iPhones reacondicionados de Apple',
    imagen: '/categories/iphones.png',
    orden: 1
  },
  {
    nombre: 'iPads',
    descripcion: 'iPads y tablets Apple reacondicionados',
    imagen: '/categories/ipads.png',
    orden: 2
  },
  {
    nombre: 'Smartphones',
    descripcion: 'Smartphones Android reacondicionados',
    imagen: '/categories/smartphones.png',
    orden: 3
  },
  {
    nombre: 'Laptops',
    descripcion: 'Laptops y MacBooks reacondicionados',
    imagen: '/categories/laptops.png',
    orden: 4
  }
]

// Configuración de la tienda
const storeSettings = {
  nombre: 'Lovely Y5',
  descripcion: 'Tienda especializada en tecnología Apple reacondicionada',
  direccion: 'Av. Tecnológica 123, Santiago',
  telefono: '+56 9 8765 4321',
  email: 'contacto@lovely-y5.cl',
  horario: {
    lunes: '9:00 - 18:00',
    martes: '9:00 - 18:00',
    miercoles: '9:00 - 18:00',
    jueves: '9:00 - 18:00',
    viernes: '9:00 - 18:00',
    sabado: '10:00 - 16:00',
    domingo: 'Cerrado'
  },
  redesSociales: {
    instagram: '@lovely_y5_cl',
    facebook: 'Lovely Y5 Chile',
    whatsapp: '+56 9 8765 4321'
  },
  politicas: {
    garantia: '6 meses en productos reacondicionados',
    devolucion: '30 días para devoluciones',
    envio: 'Envío gratis en compras sobre $50.000'
  },
  updatedAt: new Date()
}

async function seedFirestore() {
  try {
    console.log('🌱 Iniciando población de Firestore...')

    // 1. Agregar productos
    console.log('📱 Agregando productos...')
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), product)
      console.log(`✅ Producto agregado: ${product.nombre}`)
    }

    // 2. Agregar farmacias
    console.log('🏥 Agregando farmacias de turno...')
    for (const farmacia of sampleFarmacias) {
      await addDoc(collection(db, 'farmacias'), farmacia)
      console.log(`✅ Farmacia agregada: ${farmacia.nombre}`)
    }

    // 3. Agregar categorías
    console.log('📂 Agregando categorías...')
    for (const categoria of sampleCategories) {
      await addDoc(collection(db, 'categories'), categoria)
      console.log(`✅ Categoría agregada: ${categoria.nombre}`)
    }

    // 4. Agregar configuración de la tienda
    console.log('⚙️ Agregando configuración de la tienda...')
    await setDoc(doc(db, 'settings', 'store'), storeSettings)
    console.log('✅ Configuración de tienda agregada')

    console.log('🎉 ¡Base de datos poblada exitosamente!')
    console.log('\n📊 Resumen:')
    console.log(`- ${sampleProducts.length} productos agregados`)
    console.log(`- ${sampleFarmacias.length} farmacias agregadas`)
    console.log(`- ${sampleCategories.length} categorías agregadas`)
    console.log('- 1 configuración de tienda agregada')

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error)
    process.exit(1)
  }
}

// Ejecutar el script
seedFirestore().then(() => {
  console.log('✨ Proceso completado')
  process.exit(0)
})