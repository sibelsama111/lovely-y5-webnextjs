// scripts/add-test-data.mjs
import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator, collection, addDoc, doc, setDoc } from 'firebase/firestore'

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
  console.log('🔧 Conectado a Firestore Emulator en localhost:8080')
} catch (error) {
  console.log('ℹ️  Emulator connection:', error.message)
}

// Datos de productos para Lovely Y5
const productos = [
  {
    codigo: 'LVL5_IPHONE12_128GB',
    nombre: 'iPhone 12',
    marca: 'Apple',
    tipo: 'iPhones',
    precio: 399990,
    imagenes: ['/products/iPhone-12.png'],
    descripcion: 'Reacondicionado - 128GB - Como nuevo',
    detalles: 'Procesador A14 Bionic - Pantalla 6.1" - Cámara dual 12MP',
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
    stock: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    codigo: 'LVL5_MACBOOK_M1',
    nombre: 'MacBook Air M1',
    marca: 'Apple',
    tipo: 'Laptops',
    precio: 899990,
    imagenes: ['/products/macbook-air-m1.png'],
    descripcion: 'Reacondicionado - 256GB SSD - 8GB RAM',
    detalles: 'Chip M1 - Pantalla 13.3" - Batería hasta 18 horas',
    stock: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Categorías de productos para la tienda
const categorias = [
  {
    nombre: 'iPhones',
    descripcion: 'iPhones nuevos y reacondicionados de Apple',
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
    nombre: 'Laptops',
    descripcion: 'MacBooks y laptops reacondicionados',
    imagen: '/categories/laptops.png',
    orden: 3,
    activa: true
  },
  {
    nombre: 'Accesorios',
    descripcion: 'Accesorios Apple originales',
    imagen: '/categories/accesorios.png',
    orden: 4,
    activa: true
  }
]

// Usuarios de prueba
const usuariosPrueba = [
  {
    email: 'admin@lovely-y5.cl',
    primerNombre: 'Administrador',
    apellidos: 'Sistema',
    rol: 'admin',
    telefono: '+56 9 1234 5678',
    direccion: 'Oficina Central',
    createdAt: new Date()
  },
  {
    email: 'trabajador@lovely-y5.cl',
    primerNombre: 'Carlos',
    apellidos: 'Trabajador',
    rol: 'trabajador',
    telefono: '+56 9 8765 4321',
    puesto: 'Vendedor',
    createdAt: new Date()
  },
  {
    email: 'cliente@test.cl',
    primerNombre: 'María',
    apellidos: 'Cliente',
    rol: 'cliente',
    telefono: '+56 9 5555 1234',
    direccion: 'Las Condes 123, Santiago',
    createdAt: new Date()
  }
]

async function crearDatos() {
  try {
    console.log('🌱 Creando colecciones y documentos...')

    // Crear productos
    console.log('📱 Agregando productos...')
    for (const producto of productos) {
      const docRef = await addDoc(collection(db, 'products'), producto)
      console.log(`✅ Producto creado: ${producto.nombre} (ID: ${docRef.id})`)
    }

    // Crear categorías
    console.log('📂 Agregando categorías...')
    for (const categoria of categorias) {
      const docRef = await addDoc(collection(db, 'categories'), categoria)
      console.log(`✅ Categoría creada: ${categoria.nombre} (ID: ${docRef.id})`)
    }

    // Crear usuarios de prueba
    console.log('👥 Agregando usuarios de prueba...')
    for (const usuario of usuariosPrueba) {
      await setDoc(doc(db, 'users', usuario.email), usuario)
      console.log(`✅ Usuario creado: ${usuario.primerNombre} ${usuario.apellidos} (${usuario.rol})`)
    }

    // Crear configuración de tienda
    console.log('⚙️ Agregando configuración...')
    await setDoc(doc(db, 'settings', 'store'), {
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
      politicas: {
        garantia: '6 meses en productos reacondicionados',
        devolucion: '30 días para devoluciones',
        envio: 'Envío gratis en compras sobre $50.000'
      },
      redesSociales: {
        instagram: '@lovely_y5_cl',
        whatsapp: '+56 9 8765 4321'
      },
      updatedAt: new Date()
    })
    console.log('✅ Configuración de tienda creada')

    console.log('\n🎉 ¡Base de datos de tienda web creada exitosamente!')
    console.log(`📊 Resumen:`)
    console.log(`- ${productos.length} productos`)
    console.log(`- ${categorias.length} categorías`)
    console.log(`- ${usuariosPrueba.length} usuarios de prueba`)
    console.log('- 1 configuración de tienda')
    console.log('\n🌐 Revisa los datos en: http://localhost:4000/firestore')
    
  } catch (error) {
    console.error('❌ Error creando datos:', error)
  }
}

// Ejecutar
crearDatos().then(() => {
  console.log('✨ Proceso completado')
  process.exit(0)
}).catch(error => {
  console.error('💥 Error:', error)
  process.exit(1)
})