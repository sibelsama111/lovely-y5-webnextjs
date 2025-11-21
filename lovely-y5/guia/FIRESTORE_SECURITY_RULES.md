# Reglas de Seguridad Firestore - Lovely Y5 Tienda Web

## Resumen
Este archivo contiene las reglas de seguridad de Firestore para el proyecto **Lovely Y5**, enfocado exclusivamente en la funcionalidad de tienda web de tecnología Apple reacondicionada.

## Estructura de Permisos

### Roles de Usuario
- **admin**: Acceso completo a todos los recursos
- **trabajador**: Puede gestionar productos, pedidos y contactos
- **cliente**: Usuario autenticado estándar con acceso a su perfil y pedidos
- **guest**: Usuario no autenticado (solo para crear pedidos)

### Colecciones y Permisos

#### 1. Products (`/products/{productId}`)
- **Lectura**: Pública (todos los usuarios)
- **Escritura**: Administradores y trabajadores
- **Eliminación**: Solo administradores
- **Validaciones**:
  - Código debe empezar con `LVL5_`
  - Campos requeridos: `nombre`, `codigo`, `precio`, `stock`, `tipo`, `marca`
  - `precio` debe ser number, `stock` debe ser int

#### 2. Categories (`/categories/{categoryId}`)
- **Lectura**: Pública
- **Escritura**: Administradores y trabajadores
- Usado para organizar productos por categorías

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
- **Creación**: Solo el propio usuario autenticado
- **Lectura/Actualización**: Usuario propietario o administrador
- **Eliminación**: Solo administradores
- **Validaciones**: `correo`, `primerNombre`, `apellidos` requeridos
- **Roles**: `admin`, `trabajador`, `cliente`

#### 5. Contacts (`/contacts/{contactId}`)
- **Creación**: Pública (formulario de contacto web)
- **Lectura/Gestión**: Administradores y trabajadores
- **Validaciones**: `name`, `email`, `message`, `createdAt` requeridos

#### 6. Carts (`/carts/{userId}`)
- **Lectura/Escritura**: Solo el usuario propietario del carrito
- Usado para persistir carritos de compra entre sesiones

#### 7. Settings (`/settings/{settingId}`)
- **Lectura**: Pública (configuración como horarios, info de contacto)
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

## Características Específicas de Lovely Y5 Tienda Web

1. **Códigos de Producto**: Todos los productos deben tener códigos que empiecen con `LVL5_`
2. **Sistema de Roles**: 
   - `admin`: Control total de la tienda
   - `trabajador`: Gestión de productos, pedidos y atención al cliente
   - `cliente`: Compras y gestión de perfil personal
3. **Pedidos sin Registro**: Permite compras como invitado usando `customer.id = "guest"`
4. **Carritos Persistentes**: Los usuarios autenticados pueden guardar su carrito entre sesiones
5. **Gestión de Inventario**: Control de stock en tiempo real

## Índices Optimizados

Los índices en `firestore.indexes.json` optimizan consultas de la tienda:
- Pedidos por usuario y fecha de creación
- Pedidos por estado y fecha (para gestión de trabajadores)
- Productos por tipo y precio (filtros de catálogo)
- Productos por marca y precio (filtros de catálogo)
- Productos por stock disponible
- Usuarios por rol y fecha de registro
- Contactos por estado y fecha de creación

## Exclusiones Importantes

- **Farmacias**: NO están en la base de datos principal. La página de farmacias usa API externa y será eliminada próximamente.
- **Funciones temporales**: Solo se incluyen funcionalidades del core de la tienda web.

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