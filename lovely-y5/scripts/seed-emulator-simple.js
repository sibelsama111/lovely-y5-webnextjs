const admin = require('firebase-admin');

// Configurar Firebase Admin para emuladores
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

// Inicializar Firebase Admin
admin.initializeApp({
  projectId: 'lovely-y5-webstore',
});

const db = admin.firestore();

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
    stock: 8,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  }
];

const sampleFarmacias = [
  {
    nombre: 'Farmacia Cruz Verde Centro',
    direccion: 'Av. Providencia 1234, Providencia',
    telefono: '+56 2 2234 5678',
    horario: '24 horas',
    fecha: '2025-11-21',
    createdAt: admin.firestore.Timestamp.now()
  },
  {
    nombre: 'Farmacia Salcobrand Las Condes',
    direccion: 'Av. Las Condes 5678, Las Condes',
    telefono: '+56 2 2567 8900',
    horario: '24 horas',
    fecha: '2025-11-21',
    createdAt: admin.firestore.Timestamp.now()
  }
];

async function seedEmulator() {
  try {
    console.log('🌱 Poblando emulador de Firestore...');

    // Agregar productos
    console.log('📱 Agregando productos...');
    const batch = db.batch();
    
    for (const product of sampleProducts) {
      const docRef = db.collection('products').doc();
      batch.set(docRef, product);
      console.log(`✅ Producto preparado: ${product.nombre}`);
    }

    // Agregar farmacias
    console.log('🏥 Agregando farmacias...');
    for (const farmacia of sampleFarmacias) {
      const docRef = db.collection('farmacias').doc();
      batch.set(docRef, farmacia);
      console.log(`✅ Farmacia preparada: ${farmacia.nombre}`);
    }

    // Ejecutar batch
    await batch.commit();

    console.log('🎉 ¡Datos agregados exitosamente!');
    console.log(`- ${sampleProducts.length} productos`);
    console.log(`- ${sampleFarmacias.length} farmacias`);
    console.log('\n🌐 Ve los datos en: http://localhost:4000/firestore');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Ejecutar
if (require.main === module) {
  seedEmulator()
    .then(() => {
      console.log('✨ Completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { seedEmulator };