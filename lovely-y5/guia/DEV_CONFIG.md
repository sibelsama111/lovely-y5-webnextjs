# Configuración de Desarrollo - Lovely Y5

## Variables de Entorno para Desarrollo

Crea un archivo `.env.local` con el siguiente contenido para desarrollo con emuladores:

```bash
# Configuración para emuladores de Firebase
NODE_ENV=development
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true

# Email para testing (opcional)
EMAIL_USER=test@lovely-y5.cl
EMAIL_PASS=test-password

# URLs de emuladores
NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST=localhost:8080
NEXT_PUBLIC_AUTH_EMULATOR_HOST=localhost:9099
```

## Configuración sin Variables de Entorno

Si no creas el archivo `.env.local`, la aplicación automáticamente:
- ✅ Detecta que está en modo desarrollo
- ✅ Usa configuración de emuladores
- ✅ Se conecta a los emuladores locales

## Comandos de Desarrollo

```bash
# Iniciar solo los emuladores
npm run emulators:start

# Poblar emuladores con datos de ejemplo
npm run emulators:seed

# Desarrollo completo (emuladores + Next.js)
npm run dev:emulators

# Iniciar emuladores con persistencia de datos
npm run dev:full
```

## URLs de Desarrollo

- **Aplicación**: http://localhost:3000
- **Emulator UI**: http://localhost:4000
- **Firestore Emulator**: http://localhost:8080
- **Auth Emulator**: http://localhost:9099
- **Hosting Emulator**: http://localhost:5005

## Datos de Prueba

Los emuladores incluyen:
- 4 productos de ejemplo (códigos LVL5_*)
- 3 farmacias de turno
- 4 categorías de productos
- Configuración de tienda

## Ventajas del Modo Desarrollo

- ✅ No requiere configuración de Firebase real
- ✅ Datos se resetean en cada inicio (perfecto para testing)
- ✅ Desarrollo offline
- ✅ Sin costos de Firebase
- ✅ Reglas de seguridad se aplican localmente
- ✅ UI visual para inspeccionar datos