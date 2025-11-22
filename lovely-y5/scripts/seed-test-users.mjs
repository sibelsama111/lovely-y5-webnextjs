#!/usr/bin/env node

/**
 * Script para poblar el emulador de Firestore con datos de prueba
 * Usar con emuladores de Firebase activos
 * 
 * Uso: node scripts/seed-test-users.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, connectFirestoreEmulator } from 'firebase/firestore';

// Configuración para emuladores
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "lovely-y5-webstore.firebaseapp.com",
  projectId: "lovely-y5-webstore"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Conectar a emulador
try {
  connectFirestoreEmulator(db, 'localhost', 8080);
  console.log('✅ Conectado al emulador de Firestore');
} catch (error) {
  console.log('⚠️  Emulador ya conectado o no disponible');
}

// Usuarios de prueba con la nueva estructura
const testUsers = [
  {
    RUT: "201758645",
    nombres: "Gino Maximiliano",
    apellidos: "Jofré Hidalgo",
    email: "gino.jofre@gmail.com",
    telefono: 973675321,
    direccion: {
      calle: "Ossandon",
      numero: 401,
      comuna: "Valparaiso",
      region: "Valparaiso"
    },
    fotoPerfil: "",
    rol: "cliente",
    password: "123456",
    createdAt: new Date()
  },
  {
    RUT: "123456789",
    nombres: "María José",
    apellidos: "González Pérez",
    email: "maria.gonzalez@example.com",
    telefono: 987654321,
    direccion: {
      calle: "Avenida Libertador",
      numero: 1500,
      comuna: "Santiago",
      region: "Región Metropolitana"
    },
    fotoPerfil: "",
    rol: "cliente",
    password: "123456",
    createdAt: new Date()
  },
  {
    RUT: "987654321",
    nombres: "Carlos Alberto",
    apellidos: "Martínez Silva",
    email: "carlos.martinez@example.com",
    telefono: 956789123,
    direccion: {
      calle: "Calle Los Aromos",
      numero: 250,
      comuna: "Viña del Mar",
      region: "Valparaiso"
    },
    fotoPerfil: "",
    rol: "trabajador",
    password: "trabajador123",
    createdAt: new Date()
  },
  {
    RUT: "111111111",
    nombres: "Admin",
    apellidos: "Sistema",
    email: "admin@loveliy5.cl",
    telefono: 999999999,
    direccion: {
      calle: "Oficina Central",
      numero: 100,
      comuna: "Santiago",
      region: "Región Metropolitana"
    },
    fotoPerfil: "",
    rol: "admin",
    password: "admin123",
    createdAt: new Date()
  }
];

async function seedUsers() {
  console.log('🌱 Iniciando seed de usuarios de prueba...\n');
  
  for (const user of testUsers) {
    try {
      const userRef = doc(db, 'users', user.RUT);
      await setDoc(userRef, user);
      console.log(`✅ Usuario creado: ${user.nombres} ${user.apellidos} (${user.RUT}) - Rol: ${user.rol}`);
    } catch (error) {
      console.error(`❌ Error creando usuario ${user.RUT}:`, error.message);
    }
  }
  
  console.log('\n✨ Seed completado!\n');
  console.log('📋 Usuarios de prueba:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Cliente 1:');
  console.log('  RUT: 201758645');
  console.log('  Password: 123456');
  console.log('  Email: gino.jofre@gmail.com\n');
  
  console.log('Cliente 2:');
  console.log('  RUT: 123456789');
  console.log('  Password: 123456');
  console.log('  Email: maria.gonzalez@example.com\n');
  
  console.log('Trabajador:');
  console.log('  RUT: 987654321');
  console.log('  Password: trabajador123');
  console.log('  Email: carlos.martinez@example.com\n');
  
  console.log('Administrador:');
  console.log('  RUT: 111111111');
  console.log('  Password: admin123');
  console.log('  Email: admin@loveliy5.cl');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  process.exit(0);
}

seedUsers().catch(error => {
  console.error('❌ Error en seed:', error);
  process.exit(1);
});
