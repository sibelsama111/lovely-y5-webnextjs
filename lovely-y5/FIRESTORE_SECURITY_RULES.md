# Reglas de Seguridad Firestore - Lovely Y5

## Resumen
Este archivo contiene las reglas de seguridad de Firestore adaptadas específicamente para el proyecto **Lovely Y5**, una tienda de tecnología que vende productos Apple reacondicionados.

## Estructura de Permisos

### Roles de Usuario
- **admin**: Acceso completo a todos los recursos
- **trabajador**: Puede leer pedidos y actualizar su estado, gestionar contactos
- **cliente**: Usuario autenticado estándar
- **guest**: Usuario no autenticado (solo para crear pedidos)

### Colecciones y Permisos

#### 1. Products (`/products/{productId}`)
- **Lectura**: Pública (todos los usuarios)
- **Escritura**: Solo administradores
- **Validaciones**:
  - Código debe empezar con `LVL5_`
  - Campos requeridos: `nombre`, `codigo`, `precio`, `stock`, `tipo`, `marca`
  - `precio` debe ser number, `stock` debe ser int

#### 2. Farmacias (`/farmacias/{farmaciaId}`)
- **Lectura**: Pública
- **Escritura**: Solo administradores
- Usado para mostrar farmacias de turno

#### 3. Orders (`/orders/{orderId}`)
- **Creación**: 
  - Usuarios autenticados para sus propios pedidos
  - Invitados pueden crear con `customer.id = "guest"`
- **Lectura**: 
  - Administradores y trabajadores: todos los pedidos
  - Usuarios: solo sus propios pedidos
  - Invitados: solo pedidos marcados como "guest"
- **Actualización**:
  - Administradores: cambios completos
  - Trabajadores: solo pueden actualizar `status`
- **Eliminación**: Solo administradores

#### 4. Users (`/users/{uid}`)
- **Creación**: Solo el propio usuario
- **Lectura/Actualización**: Usuario propietario o administrador
- **Eliminación**: Solo administradores
- **Validaciones**: `correo`, `primerNombre`, `apellidos` requeridos

#### 5. Contacts (`/contacts/{contactId}`)
- **Creación**: Pública (formulario de contacto)
- **Lectura/Gestión**: Solo administradores y trabajadores
- **Validaciones**: `name`, `email`, `message`, `createdAt` requeridos

#### 6. Settings (`/settings/{settingId}`)
- **Lectura**: Pública (configuración como horarios, info de contacto)
- **Escritura**: Solo administradores

#### 7. Categories (`/categories/{categoryId}`)
- **Lectura**: Pública
- **Escritura**: Solo administradores

## Funciones de Utilidad

```javascript
// Verificar si el usuario es administrador
function isAdmin()

// Verificar si el usuario está autenticado
function isAuthenticated()

// Verificar si el usuario es trabajador
function isWorker()

// Verificar si el usuario es propietario de un recurso
function isOwner(userId)
```

## Características Específicas de Lovely Y5

1. **Códigos de Producto**: Todos los productos deben tener códigos que empiecen con `LVL5_`
2. **Roles Específicos**: Sistema de roles adaptado a una tienda (admin, trabajador, cliente)
3. **Pedidos de Invitados**: Permite compras sin registro usando `customer.id = "guest"`
4. **Gestión de Trabajadores**: Los trabajadores pueden gestionar pedidos y consultas de contacto

## Índices Recomendados

Los índices en `firestore.indexes.json` optimizan consultas comunes:
- Pedidos por usuario y fecha
- Pedidos por estado y fecha
- Productos por tipo y precio
- Productos por marca y precio
- Contactos por estado y fecha

## Despliegue

Para desplegar las reglas:
```bash
firebase deploy --only firestore:rules
```

Para desplegar índices:
```bash
firebase deploy --only firestore:indexes
```

## Seguridad Adicional

- **Fallback de seguridad**: Todas las colecciones no especificadas tienen acceso denegado
- **Validación de tipos**: Se validan tipos de datos en campos críticos
- **Timestamp automático**: Se requiere `createdAt` en recursos nuevos
- **Prevención de escalada de privilegios**: Los usuarios no pueden modificar sus propios roles

## Testing

Para probar las reglas localmente:
```bash
firebase emulators:start --only firestore
```

Y usar el simulador de reglas de Firebase Console para validar diferentes escenarios.