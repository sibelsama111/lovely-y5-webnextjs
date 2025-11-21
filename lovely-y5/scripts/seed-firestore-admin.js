// scripts/seed-firestore-admin.js
// Script usando Firebase Admin SDK para poblar Firestore

const admin = require('firebase-admin')

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'lovely-y5-webstore'
  })
}

const db = admin.firestore()

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
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
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
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
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
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
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
    createdAt: admin.firestore.Timestamp.now()
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
    createdAt: admin.firestore.Timestamp.now()
  }
]

async function seedFirestore() {
  try {
    console.log('🌱 Iniciando población de Firestore...')

    // 1. Agregar productos
    console.log('📱 Agregando productos...')
    const batch = db.batch()
    
    for (const product of sampleProducts) {
      const docRef = db.collection('products').doc()
      batch.set(docRef, product)
      console.log(`✅ Producto preparado: ${product.nombre}`)
    }

    // 2. Agregar farmacias
    console.log('🏥 Agregando farmacias de turno...')
    for (const farmacia of sampleFarmacias) {
      const docRef = db.collection('farmacias').doc()
      batch.set(docRef, farmacia)
      console.log(`✅ Farmacia preparada: ${farmacia.nombre}`)
    }

    // Ejecutar el batch
    await batch.commit()
    console.log('🎉 ¡Datos enviados exitosamente a Firestore!')

    console.log('\n📊 Resumen:')
    console.log(`- ${sampleProducts.length} productos agregados`)
    console.log(`- ${sampleFarmacias.length} farmacias agregadas`)

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error)
    throw error
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedFirestore()
    .then(() => {
      console.log('✨ Proceso completado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error:', error)
      process.exit(1)
    })
}

module.exports = { seedFirestore }