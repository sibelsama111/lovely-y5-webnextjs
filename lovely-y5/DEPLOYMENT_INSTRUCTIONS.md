# Instrucciones de Deployment - Lovely Y5

## 📋 Resumen de Cambios Implementados

### 1. Formulario de Registro Actualizado
El formulario de registro ahora incluye los siguientes campos:

- **RUT**: Campo de identificación única (ej: "201758645")
- **Nombres**: Nombres completos (ej: "Gino Maximiliano")
- **Apellidos**: Apellidos completos (ej: "Jofré Hidalgo")
- **Email**: Correo electrónico (ej: "gino.jofre@gmail.com")
- **Teléfono**: Número de teléfono como entero (ej: 973675321)
- **Dirección** (objeto con subcampos):
  - **calle**: Nombre de calle (ej: "Ossandon")
  - **numero**: Número de dirección como entero (ej: 401)
  - **comuna**: Comuna (ej: "Valparaiso")
  - **region**: Región (ej: "Valparaiso")
- **FotoPerfil**: URL de foto de perfil (opcional, string)
- **Contraseña**: Contraseña del usuario (mínimo 6 caracteres)
- **createdAt**: Marca de tiempo de creación (automático)

### 2. Estructura de Base de Datos

Los usuarios se guardan en Firestore con el **RUT como ID del documento**, facilitando búsquedas y evitando duplicados.

**Ejemplo de documento en `users/{RUT}`:**
```json
{
  "RUT": "201758645",
  "nombres": "Gino Maximiliano",
  "apellidos": "Jofré Hidalgo",
  "email": "gino.jofre@gmail.com",
  "telefono": 973675321,
  "direccion": {
    "calle": "Ossandon",
    "numero": 401,
    "comuna": "Valparaiso",
    "region": "Valparaiso"
  },
  "fotoPerfil": "aaa",
  "rol": "cliente",
  "password": "hash_o_texto_plano",
  "createdAt": "2025-11-21T07:33:20.000Z"
}
```

### 3. Sobre el Campo Contraseña

⚠️ **IMPORTANTE: Seguridad de Contraseñas**

**Estado Actual:**
El campo `password` se almacena actualmente en **texto plano** en Firestore. Esto es un **riesgo de seguridad significativo** y debe ser corregido antes de producción.

**¿Debes agregar el campo contraseña a la base de datos?**
- **NO directamente en texto plano** ❌
- **SÍ, pero hasheado** ✅

**Recomendaciones:**

#### Opción 1: Usar Firebase Authentication (RECOMENDADO)
```javascript
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './lib/firebase';

// Crear usuario en Firebase Auth
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
const uid = userCredential.user.uid;

// Guardar datos adicionales en Firestore (SIN password)
await setDoc(doc(db, 'users', uid), {
  RUT: form.RUT,
  nombres: form.nombres,
  apellidos: form.apellidos,
  email: form.email,
  // ... otros campos SIN password
});
```

#### Opción 2: Hashear con bcrypt (si no usas Firebase Auth)
```javascript
import bcrypt from 'bcryptjs';

// En el servidor
const hashedPassword = await bcrypt.hash(password, 10);

// Guardar en Firestore
await setDoc(doc(db, 'users', RUT), {
  // ... otros campos
  password: hashedPassword
});

// Al autenticar
const isValid = await bcrypt.compare(inputPassword, user.password);
```

#### Opción 3: Sistema híbrido (actual con mejora)
Si continúas con el sistema actual basado en RUT:
1. Implementa hashing en el lado del cliente antes de enviar
2. Usa Firebase Functions para hashear en el servidor
3. Migra gradualmente a Firebase Authentication

**Para producción inmediata:**
- [ ] Implementar Firebase Authentication
- [ ] Eliminar campo `password` de Firestore
- [ ] Usar `uid` de Firebase Auth como referencia

## 🔐 Reglas de Firestore

Las reglas actualizadas permiten:

✅ **Registro libre de clientes:**
- Cualquier persona puede crear una cuenta con `rol: "cliente"`
- Se validan todos los campos requeridos
- El RUT debe ser único

❌ **Trabajadores y Administradores:**
- Solo pueden ser creados por un administrador existente
- No se permite auto-registro con roles privilegiados

**Reglas actualizadas en `firestore.rules`:**
```javascript
match /users/{rut} {
  // Permitir creación pública SOLO de clientes con validaciones estrictas
  allow create: if request.resource.data.rol == 'cliente'
    && request.resource.data.RUT is string
    && request.resource.data.RUT == rut
    && request.resource.data.nombres is string
    && request.resource.data.nombres.size() > 0
    && request.resource.data.apellidos is string  
    && request.resource.data.apellidos.size() > 0
    && request.resource.data.email is string
    && request.resource.data.email.matches('.*@.*\\..*')
    && request.resource.data.telefono is number
    && request.resource.data.direccion is map
    && request.resource.data.direccion.calle is string
    && request.resource.data.direccion.numero is number
    && request.resource.data.direccion.comuna is string
    && request.resource.data.direccion.region is string
    && request.resource.data.password is string
    && request.resource.data.password.size() >= 6
    && request.resource.data.createdAt is timestamp;
  
  allow read: if true;
  allow update: if (isAuthenticated() && request.auth.token.rut == rut) || isAdmin();
  allow delete: if isAdmin();
}
```

## 🚀 Deployment en Vercel

### Paso 1: Configurar Variables de Entorno

En tu proyecto de Vercel, ve a **Settings > Environment Variables** y añade:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_real
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lovely-y5-webstore.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lovely-y5-webstore
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lovely-y5-webstore.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_SITE_NAME=Lovely Y5
NEXT_PUBLIC_ADMIN_EMAIL=lovely5.techserv@gmail.com

NODE_ENV=production
```

### Paso 2: Instalar Dependencias

Antes de hacer deploy, asegúrate de que todas las dependencias estén instaladas:

```bash
cd lovely-y5
npm install
```

**Nuevas dependencias añadidas:**
- `react-hot-toast@^2.4.1` - Para notificaciones toast

### Paso 3: Desplegar Reglas de Firestore

Antes de hacer deploy del frontend, actualiza las reglas en Firebase:

```bash
cd lovely-y5
firebase deploy --only firestore:rules
```

### Paso 4: Deploy en Vercel

#### Opción A: Deploy automático desde Git
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Vercel detectará automáticamente Next.js y hará el build

#### Opción B: Deploy manual
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd lovely-y5
vercel --prod
```

### Paso 5: Verificar el Deployment

1. Accede a tu sitio en Vercel
2. Prueba el formulario de registro
3. Verifica que los datos se guarden correctamente en Firestore
4. Revisa los logs de Vercel si hay errores

## 🧪 Probar en Desarrollo con Emuladores

Para probar localmente con los emuladores de Firebase:

```bash
# Terminal 1: Iniciar emuladores
cd lovely-y5
npm run emulators:start

# Terminal 2: Iniciar Next.js
npm run dev
```

Accede a:
- App: http://localhost:3000
- Firestore Emulator UI: http://localhost:4000

## 📊 Validación de Campos

El formulario valida:

✅ RUT con dígito verificador correcto
✅ Email con formato válido
✅ Teléfono como número entero
✅ Todos los campos de dirección requeridos
✅ Contraseña mínimo 6 caracteres
✅ Confirmación de contraseña

## 🐛 Solución de Problemas Comunes

### Error: "Permission denied"
- Verifica que las reglas de Firestore estén actualizadas
- Asegúrate de que el usuario tenga `rol: "cliente"`
- Revisa que todos los campos requeridos estén presentes

### Error: "User already exists"
- El RUT ya está registrado
- Verifica en Firestore si el documento existe

### Error: Build failed en Vercel
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en Vercel
- Asegúrate de que `react-hot-toast` esté en `package.json`

### Error: Firebase not initialized
- Verifica que las variables `NEXT_PUBLIC_FIREBASE_*` estén configuradas
- Asegúrate de que no haya typos en los nombres de variables

## 📝 Checklist Pre-Deployment

- [ ] Actualizar reglas de Firestore
- [ ] Configurar variables de entorno en Vercel
- [ ] Instalar dependencias con `npm install`
- [ ] Ejecutar `npm run build` localmente para verificar
- [ ] Probar el formulario de registro en desarrollo
- [ ] Verificar que los datos se guarden correctamente
- [ ] (IMPORTANTE) Implementar hashing de contraseñas
- [ ] Deploy a Vercel
- [ ] Probar en producción

## 🔒 Notas de Seguridad

1. **NUNCA** hagas commit de archivos `.env.local` con credenciales reales
2. Usa variables de entorno de Vercel para producción
3. Implementa hashing de contraseñas antes de producción
4. Considera migrar a Firebase Authentication
5. Habilita reglas de seguridad estrictas en Firestore
6. Implementa rate limiting para prevenir spam de registros

## 📞 Soporte

Si encuentras problemas durante el deployment:
1. Revisa los logs de Vercel: `vercel logs <deployment-url>`
2. Verifica la consola de Firebase
3. Revisa la consola del navegador para errores de cliente
