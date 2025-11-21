# Gestión de Usuarios - Lovely Y5

## 📋 Estructura Detallada de Usuarios

### Campos Obligatorios
- **RUT**: Identificador único chileno (formato: 12345678-9)
- **Nombres**: Nombres completos del usuario
- **Apellidos**: Apellidos completos del usuario
- **Email**: Correo electrónico (único en el sistema)
- **Teléfono**: Número de contacto (+56 9 XXXX XXXX)
- **Dirección**: Objeto completo con calle, número, comuna y región
- **Rol**: cliente | admin | trabajador
- **Fecha de registro**: Timestamp automático

### Campos Opcionales
- **Foto de perfil**: URL de imagen almacenada en Firebase Storage

## 🔐 Validaciones de RUT

### Formato Válido
- Debe seguir el patrón: `XXXXXXXX-X`
- 8 dígitos + guión + dígito verificador
- Ejemplo: `12345678-9`

### Validación del Dígito Verificador
```javascript
function validarRUT(rut) {
  // Limpiar RUT
  const rutLimpio = rut.replace(/[^0-9kK]/g, '');
  
  if (rutLimpio.length < 8) return false;
  
  const dv = rutLimpio.slice(-1).toLowerCase();
  const numero = rutLimpio.slice(0, -1);
  
  let suma = 0;
  let multiplicador = 2;
  
  // Calcular suma
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
```

## 🖼️ Gestión de Fotos de Perfil

### Estructura de Firebase Storage
```
/users/
  /{rut}/           // RUT sin formato (123456789)
    /profile/
      /avatar.jpg    // Imagen de perfil actual
      /avatar_thumb.jpg  // Miniatura (opcional)
```

### Configuración de Storage Rules
```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Imágenes de perfil de usuario usando RUT
    match /users/{rut}/profile/{filename} {
      allow read: if true; // Públicamente legible
      allow write: if request.auth != null && 
                      (request.auth.token.rut == rut || 
                       isAdmin(request.auth.token.rut));
      allow delete: if request.auth != null && 
                       (request.auth.token.rut == rut || 
                        isAdmin(request.auth.token.rut));
    }
    
    // Función helper para verificar admin
    function isAdmin(rut) {
      return exists(/databases/(default)/documents/users/$(rut)) &&
             get(/databases/(default)/documents/users/$(rut)).data.rol == 'admin';
    }
  }
}
```

### Proceso de Subida de Imagen
1. **Cliente selecciona imagen**
2. **Validar formato** (JPG, PNG, WEBP)
3. **Validar tamaño** (máximo 2MB)
4. **Comprimir imagen** si es necesario
5. **Subir a Storage** con nombre único
6. **Actualizar documento usuario** con nueva URL
7. **Eliminar imagen anterior** (si existe)

## 📍 Gestión de Direcciones

### Estructura de Dirección
```json
{
  "direccion": {
    "calle": "Av. Libertad",
    "numero": "123",
    "comuna": "Las Condes",
    "region": "Región Metropolitana"
  }
}
```

### Validaciones de Dirección
- **Calle**: Texto no vacío (mín. 3 caracteres)
- **Número**: Puede incluir letra (ej: "123-A")
- **Comuna**: Debe estar en lista válida de comunas
- **Región**: Debe estar en lista válida de regiones

### Lista de Regiones Válidas
```javascript
const regionesChile = [
  "Región de Arica y Parinacota",
  "Región de Tarapacá", 
  "Región de Antofagasta",
  "Región de Atacama",
  "Región de Coquimbo",
  "Región de Valparaíso",
  "Región Metropolitana",
  "Región del Libertador General Bernardo O'Higgins",
  "Región del Maule",
  "Región de Ñuble",
  "Región del Biobío",
  "Región de La Araucanía",
  "Región de Los Ríos",
  "Región de Los Lagos",
  "Región Aysén del General Carlos Ibáñez del Campo",
  "Región de Magallanes y de la Antártica Chilena"
];
```

## 🔄 Flujo de Registro de Usuario

### 1. Formulario de Registro
```javascript
const formData = {
  rut: "12345678-9",
  nombres: "Juan Carlos",
  apellidos: "Pérez González", 
  email: "juan@email.com",
  telefono: "+56 9 1234 5678",
  direccion: {
    calle: "Av. Libertad",
    numero: "123",
    comuna: "Las Condes", 
    region: "Región Metropolitana"
  },
  rol: "cliente" // Asignado automáticamente
};

// RUT sin formato para usar como ID de documento
const rutSinFormato = formData.rut.replace(/[^0-9]/g, ''); // "123456789"
```

### 2. Validaciones Frontend
- ✅ Validar formato RUT
- ✅ Validar dígito verificador RUT
- ✅ Validar email único
- ✅ Validar teléfono formato chileno
- ✅ Validar campos obligatorios
- ✅ Validar región y comuna

### 3. Proceso en Backend
```javascript
// 1. Limpiar RUT para usar como ID
const rutSinFormato = formData.rut.replace(/[^0-9]/g, '');

// 2. Validar RUT único en Firestore (verificar si el documento ya existe)
const userDoc = await db.collection('users').doc(rutSinFormato).get();

if (userDoc.exists) {
  throw new Error('RUT ya registrado');
}

// 3. Crear usuario en Firebase Auth con custom claims
const userRecord = await auth.createUser({
  uid: rutSinFormato, // Usar RUT como UID en Firebase Auth
  email: formData.email,
  password: formData.password
});

// 4. Agregar claims personalizados con RUT
await auth.setCustomUserClaims(userRecord.uid, {
  rut: rutSinFormato,
  rol: formData.rol
});

// 5. Crear documento en Firestore usando RUT como ID
await db.collection('users').doc(rutSinFormato).set({
  ...formData,
  fotoPerfil: null, // Se asigna después
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});
```

## 👥 Gestión por Roles

### Cliente
- ✅ **Ver y editar** su propio perfil
- ✅ **Subir/cambiar** su foto de perfil
- ❌ **NO puede** cambiar su rol
- ❌ **NO puede** ver otros usuarios

### Trabajador
- ✅ **Ver** perfiles de clientes (solo lectura)
- ❌ **NO puede** editar usuarios
- ❌ **NO puede** cambiar roles

### Admin
- ✅ **Ver, crear, editar** cualquier usuario
- ✅ **Cambiar roles** de usuarios
- ✅ **Subir/cambiar** fotos de perfil de cualquier usuario
- ✅ **Eliminar** usuarios (con confirmación)
- ✅ **Ver estadísticas** de usuarios

## 📊 Índices de Firestore Requeridos

```json
{
  "indexes": [
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "rut", "order": "ASCENDING"}
      ]
    },
    {
      "collectionGroup": "users", 
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "email", "order": "ASCENDING"}
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION", 
      "fields": [
        {"fieldPath": "rol", "order": "ASCENDING"},
        {"fieldPath": "createdAt", "order": "DESCENDING"}
      ]
    }
  ]
}
```