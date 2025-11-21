// scripts/seed-emulator.js
// Script para poblar los emuladores de Firebase con datos de desarrollo

import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator, collection, addDoc, setDoc, doc } from 'firebase/firestore'

// Configuración para emuladores
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
const db = getFirestore(app)

// Conectar a emulador
try {
  connectFirestoreEmulator(db, 'localhost', 8080)
  console.log('🔧 Conectado a Firestore Emulator')
} catch (error) {
  console.log('ℹ️  Emulator ya conectado o no disponible')
}

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
    nombre: 'Farmacia Cruz Verde Centro',
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
    nombre: 'Farmacia Salcobrand Las Condes',
    direccion: 'Av. Las Condes 5678, Las Condes',
    telefono: '+56 2 2567 8900',
    horario: '24 horas',
    fecha: new Date().toISOString().split('T')[0],
    ubicacion: {
      lat: -33.4025,
      lng: -70.5731
    },
    createdAt: new Date()
  },
  {
    nombre: 'Farmacia Dr. Simi Maipú',
    direccion: 'Av. Pajaritos 3456, Maipú',
    telefono: '+56 2 2890 1234',
    horario: '8:00 - 22:00',
    fecha: new Date().toISOString().split('T')[0],
    ubicacion: {
      lat: -33.5108,
      lng: -70.7497
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
    orden: 1,
    activa: true
  },
  {
    nombre: 'iPads',
    descripcion: 'iPads y tablets Apple reacondicionados',
    imagen: '/categories/ipads.png',
    orden: 2,
    activa: true
  },
  {
    nombre: 'Smartphones',
    descripcion: 'Smartphones Android reacondicionados',
    imagen: '/categories/smartphones.png',
    orden: 3,
    activa: true
  },
  {
    nombre: 'Laptops',
    descripcion: 'Laptops y MacBooks reacondicionados',
    imagen: '/categories/laptops.png',
    orden: 4,
    activa: true
  }
]

// Configuración de la tienda
const storeSettings = {
  nombre: 'Lovely Y5 (Desarrollo)',
  descripcion: 'Tienda especializada en tecnología Apple reacondicionada - Entorno de Desarrollo',
  direccion: 'Av. Tecnológica 123, Santiago (Dev)',
  telefono: '+56 9 8765 4321',
  email: 'dev@lovely-y5.cl',
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
    instagram: '@lovely_y5_dev',
    facebook: 'Lovely Y5 Dev',
    whatsapp: '+56 9 8765 4321'
  },
  politicas: {
    garantia: '6 meses en productos reacondicionados',
    devolucion: '30 días para devoluciones',
    envio: 'Envío gratis en compras sobre $50.000'
  },
  updatedAt: new Date()
}

async function seedEmulator() {
  try {
    console.log('🌱 Poblando emulador de Firestore con datos de desarrollo...')

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

    console.log('🎉 ¡Emulador poblado exitosamente!')
    console.log('\n📊 Resumen:')
    console.log(`- ${sampleProducts.length} productos agregados`)
    console.log(`- ${sampleFarmacias.length} farmacias agregadas`)
    console.log(`- ${sampleCategories.length} categorías agregadas`)
    console.log('- 1 configuración de tienda agregada')
    console.log('\n🌐 Accede a la UI del emulador en: http://localhost:4000')

  } catch (error) {
    console.error('❌ Error poblando el emulador:', error)
    process.exit(1)
  }
}

// Ejecutar el script
seedEmulator().then(() => {
  console.log('✨ Proceso completado')
  process.exit(0)
})