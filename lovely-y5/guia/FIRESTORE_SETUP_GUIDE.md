# Guía para Configurar la Base de Datos Firebase Firestore

## 🎯 Estado Actual
✅ **Completado:**
- Firebase CLI configurado y autenticado
- Proyecto Firebase "lovely-y5-webstore" conectado
- Reglas de seguridad de Firestore desplegadas
- Índices de Firestore configurados

## 🚀 Próximos Pasos

### 1. Acceder a Firebase Console
Abre tu navegador y ve a: https://console.firebase.google.com/project/lovely-y5-webstore/overview

### 2. Configurar Firestore
1. En el menú lateral, haz clic en **"Firestore Database"**
2. Si no está habilitado, haz clic en **"Create database"**
3. Selecciona **"Start in production mode"** (ya tienes las reglas configuradas)
4. Elige la ubicación más cercana (recomendado: `southamerica-east1`)

### 3. Crear las Colecciones Iniciales

#### A. Colección `products`
1. Haz clic en **"Start collection"**
2. Collection ID: `products`
3. Agrega los siguientes documentos:

**Documento 1:**
- Document ID: (auto-generate)
- Campos:
```
codigo: "LVL5_IPHONE12_128GB"
nombre: "iPhone 12"
marca: "Apple"
tipo: "iPhones"
precio: 399990
stock: 5
descripcion: "Reacondicionado - 128GB - Como nuevo"
detalles: "Procesador A14 Bionic - Pantalla 6.1\" - Cámara dual 12MP"
imagenes: ["/products/iPhone-12.png"]
createdAt: timestamp (now)
updatedAt: timestamp (now)
```

**Documento 2:**
- Document ID: (auto-generate)
- Campos:
```
codigo: "LVL5_IPADAIR_64GB"
nombre: "iPad Air"
marca: "Apple"
tipo: "iPads"
precio: 449990
stock: 3
descripcion: "Reacondicionado - 64GB - Como nuevo"
detalles: "Procesador A14 - Pantalla 10.9\" - Cámara 12MP"
imagenes: ["/products/ipadaira1474.png"]
createdAt: timestamp (now)
updatedAt: timestamp (now)
```

#### B. Colección `farmacias`
1. Crear nueva colección: `farmacias`
2. Agregar documentos:

**Documento 1:**
```
nombre: "Farmacia Cruz Verde"
direccion: "Av. Providencia 1234, Providencia"
telefono: "+56 2 2234 5678"
horario: "24 horas"
fecha: "2025-11-21"
createdAt: timestamp (now)
```

#### C. Colección `categories`
1. Crear nueva colección: `categories`
2. Agregar documentos:

**Documento 1:**
```
nombre: "iPhones"
descripcion: "iPhones reacondicionados de Apple"
imagen: "/categories/iphones.png"
orden: 1
```

**Documento 2:**
```
nombre: "iPads"
descripcion: "iPads y tablets Apple reacondicionados"
imagen: "/categories/ipads.png"
orden: 2
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env.local` con tu configuración de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lovely-y5-webstore.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lovely-y5-webstore
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lovely-y5-webstore.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 5. Verificar Configuración

Una vez configurado, puedes probar la conexión ejecutando:

```bash
npm run dev
```

Y visitando las páginas que usan Firestore.

## 📋 Archivos Creados

- ✅ `firestore.rules` - Reglas de seguridad
- ✅ `firestore.indexes.json` - Índices de consulta
- ✅ `firebase.json` - Configuración de Firebase
- ✅ `data/firestore-seed-data.json` - Datos de ejemplo en formato JSON
- ✅ `FIRESTORE_SECURITY_RULES.md` - Documentación de seguridad

## 🔧 Comandos Útiles

```bash
# Desplegar reglas de seguridad
firebase deploy --only firestore:rules

# Desplegar índices
firebase deploy --only firestore:indexes

# Ver logs en tiempo real
firebase functions:log --follow

# Iniciar emuladores locales para desarrollo
firebase emulators:start
```

## 🎉 ¡Listo!

Una vez completados estos pasos, tendrás:
- ✅ Base de datos Firestore configurada
- ✅ Reglas de seguridad implementadas
- ✅ Estructura de datos optimizada para Lovely Y5
- ✅ Índices para consultas eficientes

Tu aplicación Lovely Y5 estará lista para usar Firebase Firestore como base de datos principal.