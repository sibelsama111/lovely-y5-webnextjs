// data/products.js
// Simula una "base de datos" en memoria y exporta funciones CRUD.
// En producción reemplaza por DB real.

import { v4 as uuidv4 } from 'uuid'

/** Seed inicial */
let products = [
  {
    id: '1',
    codigo: 'LVL5_00001',
    nombre: 'Audífonos Lovely Sound X1',
    marca: 'Lovely',
    tipo: 'Audio',
    precio: 29990,
    imagenes: ['/svgs/logo.svg'],
    descripcion: 'Audífonos inalámbricos con cancelación de ruido ligera y batería de 20h.',
    detalles: 'Bluetooth 5.2, micrófono integrado, carga rápida.',
    fichaTecnica: { peso: '180g', bateria: '20h', bluetooth: '5.2' },
    stock: 12
  },
  {
    id: '2',
    codigo: 'LVL5_00002',
    nombre: 'Cargador Rápido 30W',
    marca: 'PowerJoy',
    tipo: 'Accesorios',
    precio: 15990,
    imagenes: ['/svgs/logo.svg'],
    descripcion: 'Cargador USB-C 30W con cable incluido.',
    detalles: 'PD 3.0, entrada universal.',
    fichaTecnica: { potencia: '30W', entrada: 'AC 100-240V' },
    stock: 34
  },
  {
    id: '3',
    codigo: 'LVL5_00003',
    nombre: 'Smartphone Lovely Z',
    marca: 'Lovely',
    tipo: 'Teléfono',
    precio: 199990,
    imagenes: ['/svgs/logo.svg'],
    descripcion: 'Smartphone gama media con buena cámara y pantalla AMOLED.',
    detalles: '6.5\" AMOLED, 128GB, 6GB RAM.',
    fichaTecnica: { pantalla: "6.5''", ram: '6GB', almacenamiento: '128GB' },
    stock: 5
  }
]

export function listProducts() {
  return products
}

export function getProductById(id) {
  return products.find(p => p.id === id || p.codigo === id) || null
}

export function createProduct(payload) {
  const p = { id: uuidv4(), ...payload }
  products.unshift(p)
  return p
}

export function updateProduct(id, payload) {
  products = products.map(p => (p.id === id ? { ...p, ...payload } : p))
  return products.find(p => p.id === id) || null
}

export function deleteProduct(id) {
  products = products.filter(p => p.id !== id)
  return true
}

/** Export "for testing" */
export function _resetProducts(newProducts) {
  products = newProducts
}
