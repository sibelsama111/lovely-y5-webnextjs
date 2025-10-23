// data/products.js
// Simula una "base de datos" en memoria y exporta funciones CRUD.
// En producción reemplaza por DB real.

import { v4 as uuidv4 } from 'uuid'

/** Seed inicial */
let products = [
  {
    id: '1',
    codigo: 'y5iph12',
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
    stock: 5
  },
  {
    id: '2',
    codigo: 'y5ipda1474',
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
    stock: 3
  },
  {
    id: '3',
    codigo: 'y5glxs21',
    nombre: 'Samsung Galaxy S21',
    marca: 'Samsung',
    tipo: 'Celulares',
    precio: 369990,
    imagenes: ['/products/galaxy-s21.jpg'],
    descripcion: 'Nuevo - 128GB',
    detalles: 'Procesador Exynos 2100 - Pantalla 6.2" - Cámara triple 12MP',
    fichaTecnica: {
      procesador: 'Exynos 2100',
      pantalla: '6.2"',
      almacenamiento: '128GB',
      camara: 'Triple 12MP',
      estado: 'Nuevo'
    },
    stock: 6
  },
  {
    id: '4',
    codigo: 'y5glxta7',
    nombre: 'Samsung Galaxy Tab A7',
    marca: 'Samsung',
    tipo: 'Tablets',
    precio: 189990,
    imagenes: ['/products/sms-tab-a7.jpg'],
    descripcion: 'Nuevo - 32GB',
    detalles: 'Pantalla 10.4" - Batería 7040 mAh',
    fichaTecnica: {
      pantalla: '10.4"',
      almacenamiento: '32GB',
      bateria: '7040 mAh',
      estado: 'Nuevo'
    },
    stock: 5
  },
  {
    id: '5',
    codigo: 'y5nka104',
    nombre: 'Nokia 105',
    marca: 'Nokia',
    tipo: 'TelefonosBasicos',
    precio: 14990,
    imagenes: ['/products/nok105.jpg'],
    descripcion: 'Teléfono básico - 1.8"',
    detalles: 'Duración batería 15 días',
    fichaTecnica: {
      pantalla: '1.8"',
      bateria: 'Duración 15 días',
      estado: 'Nuevo'
    },
    stock: 10
  },
  {
    id: '6',
    codigo: 'y5imc220',
    nombre: 'iMac 2020',
    marca: 'Apple',
    tipo: 'Computadores',
    precio: 999990,
    imagenes: ['/products/imac2020.jpg'],
    descripcion: 'Reacondicionado - 256GB SSD',
    detalles: 'Pantalla 27" - Procesador Intel i5',
    fichaTecnica: {
      procesador: 'Intel i5',
      pantalla: '27"',
      almacenamiento: '256GB SSD',
      estado: 'Reacondicionado'
    },
    stock: 2
  },
  {
    id: '7',
    codigo: 'y5dllins15',
    nombre: 'Dell Inspiron 15',
    marca: 'Dell',
    tipo: 'Notebooks',
    precio: 649990,
    imagenes: ['/products/DellIns15.jpg'],
    descripcion: 'Notebook - 512GB SSD',
    detalles: 'Pantalla 15.6" - RAM 8GB - i5',
    fichaTecnica: {
      procesador: 'Intel i5',
      pantalla: '15.6"',
      almacenamiento: '512GB SSD',
      ram: '8GB',
      estado: 'Nuevo'
    },
    stock: 4
  },
  {
    id: '8',
    codigo: 'y5ps5',
    nombre: 'PlayStation 5',
    marca: 'Sony',
    tipo: 'Consolas',
    precio: 749990,
    imagenes: ['/products/ps5.png'],
    descripcion: 'Consola nueva - 825GB',
    detalles: 'Incluye control DualSense',
    fichaTecnica: {
      almacenamiento: '825GB',
      accesorios: 'Control DualSense incluido',
      estado: 'Nuevo'
    },
    stock: 3
  },
  {
    id: '9',
    codigo: 'y5kybdrgb',
    nombre: 'Teclado mecánico RGB',
    marca: 'Lovely Gaming',
    tipo: 'Perifericos',
    precio: 49990,
    imagenes: ['/products/kbdrgb.jpg'],
    descripcion: 'Periférico para PC y consolas',
    detalles: 'Switches azules - Retroiluminación RGB',
    fichaTecnica: {
      tipo: 'Mecánico',
      switches: 'Azules',
      iluminacion: 'RGB',
      compatibilidad: 'PC y consolas',
      estado: 'Nuevo'
    },
    stock: 7
  },
  {
    id: '10',
    codigo: 'y5chgrwlss',
    nombre: 'Cargador inalámbrico',
    marca: 'Lovely Tech',
    tipo: 'Accesorios',
    precio: 19990,
    imagenes: ['/products/cargadorina.jpg'],
    descripcion: 'Accesorio universal',
    detalles: 'Compatible con Qi',
    fichaTecnica: {
      tecnologia: 'Qi',
      compatibilidad: 'Universal',
      estado: 'Nuevo'
    },
    stock: 15
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

export function getProductsByType(tipo) {
  return products.filter(p => p.tipo === tipo)
}

export function searchProducts(query) {
  query = query.toLowerCase()
  return products.filter(p => 
    p.nombre.toLowerCase().includes(query) ||
    p.descripcion.toLowerCase().includes(query) ||
    p.marca.toLowerCase().includes(query) ||
    p.tipo.toLowerCase().includes(query)
  )
}

/** Export for testing */
export function _resetProducts(newProducts) {
  products = newProducts
}
