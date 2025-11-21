// scripts/add-test-users.mjs
// Script para poblar usuarios de prueba con nueva estructura

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo-lovely-y5.firebaseapp.com",
  projectId: "demo-lovely-y5",
  storageBucket: "demo-lovely-y5.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Datos de usuarios de prueba con nueva estructura
// ID de documento será el RUT sin formato (solo números)
const testUsers = [
  {
    id: '123456789', // RUT sin formato como ID de documento
    rut: '12345678-9',
    nombres: 'Ana María',
    apellidos: 'González López',
    email: 'admin@lovely-y5.cl',
    telefono: '+56 9 8765 4321',
    direccion: {
      calle: 'Av. Providencia',
      numero: '1234',
      comuna: 'Providencia',
      region: 'Región Metropolitana'
    },
    rol: 'admin',
    fotoPerfil: null,
    createdAt: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: '876543210', // RUT sin formato como ID
    rut: '87654321-0',
    nombres: 'Carlos Eduardo',
    apellidos: 'Martínez Silva',
    email: 'carlos@lovely-y5.cl',
    telefono: '+56 9 7654 3210',
    direccion: {
      calle: 'Calle San Antonio',
      numero: '567',
      comuna: 'Santiago',
      region: 'Región Metropolitana'
    },
    rol: 'trabajador',
    fotoPerfil: null,
    createdAt: new Date('2024-02-01T14:30:00Z')
  },
  {
    id: '112233445', // RUT sin formato como ID
    rut: '11223344-5',
    nombres: 'María José',
    apellidos: 'Rodríguez Pérez',
    email: 'maria@cliente.com',
    telefono: '+56 9 1122 3344',
    direccion: {
      calle: 'Los Leones',
      numero: '89',
      comuna: 'Las Condes',
      region: 'Región Metropolitana'
    },
    rol: 'cliente',
    fotoPerfil: null,
    createdAt: new Date('2024-03-10T09:15:00Z')
  },
  {
    id: '998877661', // RUT sin formato como ID
    rut: '99887766-1',
    nombres: 'Pedro Antonio',
    apellidos: 'Fernández Castro',
    email: 'pedro@cliente.com',
    telefono: '+56 9 9988 7766',
    direccion: {
      calle: 'Manuel Montt',
      numero: '456-A',
      comuna: 'Ñuñoa',
      region: 'Región Metropolitana'
    },
    rol: 'cliente',
    fotoPerfil: null,
    createdAt: new Date('2024-03-15T16:45:00Z')
  },
  {
    id: '554433227', // RUT sin formato como ID
    rut: '55443322-7',
    nombres: 'Francisca Belén',
    apellidos: 'Torres Morales',
    email: 'francisca@cliente.com',
    telefono: '+56 9 5544 3322',
    direccion: {
      calle: 'Av. Santa María',
      numero: '1890',
      comuna: 'Recoleta',
      region: 'Región Metropolitana'
    },
    rol: 'cliente',
    fotoPerfil: null,
    createdAt: new Date('2024-03-20T11:20:00Z')
  },
  {
    id: '665544332', // RUT sin formato como ID
    rut: '66554433-2',
    nombres: 'Rodrigo Alejandro',
    apellidos: 'Vargas Soto',
    email: 'rodrigo@valpo.com',
    telefono: '+56 9 6655 4433',
    direccion: {
      calle: 'Av. Pedro Montt',
      numero: '2150',
      comuna: 'Valparaíso',
      region: 'Región de Valparaíso'
    },
    rol: 'cliente',
    fotoPerfil: null,
    createdAt: new Date('2024-04-05T13:10:00Z')
  },
  {
    id: '776655448', // RUT sin formato como ID
    rut: '77665544-8',
    nombres: 'Camila Andrea',
    apellidos: 'Herrera Navarro',
    email: 'camila@conce.com',
    telefono: '+56 9 7766 5544',
    direccion: {
      calle: 'Barros Arana',
      numero: '340',
      comuna: 'Concepción',
      region: 'Región del Biobío'
    },
    rol: 'cliente',
    fotoPerfil: null,
    createdAt: new Date('2024-04-12T08:30:00Z')
  }
];

// Función para agregar usuarios de prueba
async function addTestUsers() {
  try {
    console.log('🚀 Agregando usuarios de prueba...');
    
    for (const user of testUsers) {
      const { id, ...userData } = user;
      await setDoc(doc(collection(db, 'users'), id), userData);
      console.log(`✅ Usuario agregado: ${userData.nombres} ${userData.apellidos} (${userData.rol})`);
    }
    
    console.log('🎉 Usuarios de prueba agregados exitosamente!');
    console.log('');
    console.log('👥 Credenciales de prueba:');
    console.log('📧 Admin: admin@lovely-y5.cl');
    console.log('📧 Trabajador: carlos@lovely-y5.cl');
    console.log('📧 Clientes: maria@cliente.com, pedro@cliente.com, etc.');
    console.log('');
    console.log('⚠️  Recuerda crear los usuarios correspondientes en Firebase Auth');
    
  } catch (error) {
    console.error('❌ Error agregando usuarios:', error);
  }
}

// Función para validar RUT chileno
function validarRUT(rut) {
  const rutLimpio = rut.replace(/[^0-9kK]/g, '');
  
  if (rutLimpio.length < 8) return false;
  
  const dv = rutLimpio.slice(-1).toLowerCase();
  const numero = rutLimpio.slice(0, -1);
  
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = numero.length - 1; i >= 0; i--) {
    suma += parseInt(numero[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const dvCalculado = 11 - (suma % 11);
  const dvFinal = dvCalculado === 11 ? '0' : 
                  dvCalculado === 10 ? 'k' : 
                  dvCalculado.toString();
  
  return dv === dvFinal;
}

// Validar RUTs de prueba
console.log('🔍 Validando RUTs de prueba...');
testUsers.forEach(user => {
  const esValido = validarRUT(user.rut);
  console.log(`${esValido ? '✅' : '❌'} ${user.rut} - ${user.nombres} ${user.apellidos}`);
});

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  addTestUsers().then(() => process.exit(0));
}

export { addTestUsers, testUsers, validarRUT };