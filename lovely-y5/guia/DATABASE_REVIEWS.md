# Estructura de la Base de Datos - Colección Reviews

## Colección: `reviews`

### Estructura del Documento

```json
{
  "id": "string (auto-generado por Firebase)",
  "productCode": "string (código del producto, ej: LVL5_IPHONE13_128GB_BLANCO)",
  "userId": "string (RUT del usuario sin puntos ni guión)",
  "userName": "string (nombre completo del usuario)",
  "rating": "number (1-5, puntuación del producto)",
  "comment": "string (comentario del usuario)",
  "images": "array (URLs de imágenes opcionales)",
  "createdAt": "timestamp (fecha de creación)",
  "updatedAt": "timestamp (fecha de última modificación)"
}
```

### Ejemplo de Documento

```json
{
  "id": "review_12345",
  "productCode": "LVL5_IPHONE13_128GB_BLANCO",
  "userId": "12345678K",
  "userName": "Juan Pérez Silva",
  "rating": 5,
  "comment": "Excelente producto, muy buena calidad y llegó rápido",
  "images": [],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Índices Recomendados

Para optimizar las consultas:

1. **Por código de producto**: 
   - Campo: `productCode`
   - Orden: `createdAt desc`

2. **Por usuario y producto** (para verificar si ya valoró):
   - Campos: `userId`, `productCode`

### Reglas de Seguridad

```javascript
// En firestore.rules
match /reviews/{reviewId} {
  // Permitir lectura a todos
  allow read: if true;
  
  // Permitir creación solo a usuarios autenticados con RUT válido
  allow create: if request.auth != null 
    && request.auth.uid == resource.data.userId
    && validateReviewData(request.resource.data);
  
  // Permitir actualización solo al propietario de la review
  allow update: if request.auth != null 
    && request.auth.uid == resource.data.userId
    && validateReviewData(request.resource.data);
  
  // Permitir eliminación solo al propietario o administrador
  allow delete: if request.auth != null 
    && (request.auth.uid == resource.data.userId 
        || hasRole(request.auth.uid, 'admin'));
}

function validateReviewData(data) {
  return data.keys().hasAll(['productCode', 'userId', 'userName', 'rating', 'comment'])
    && data.rating is number
    && data.rating >= 1 
    && data.rating <= 5
    && data.comment is string
    && data.comment.size() > 0
    && data.productCode is string
    && data.userId is string
    && data.userName is string;
}
```

### Servicios Implementados

#### `reviewService.getByProductCode(productCode)`
- Obtiene todas las reviews de un producto específico
- Ordenadas por fecha de creación (más recientes primero)

#### `reviewService.create(reviewData)`
- Crea una nueva valoración
- Añade automáticamente `createdAt` y `updatedAt`

#### `reviewService.update(reviewId, updates)`
- Actualiza una valoración existente
- Actualiza automáticamente `updatedAt`

#### `reviewService.delete(reviewId)`
- Elimina una valoración

#### `reviewService.getUserReviewForProduct(userId, productCode)`
- Verifica si un usuario ya valoró un producto específico
- Útil para evitar valoraciones duplicadas

### Integración con el Frontend

El componente de producto ahora:

1. **Carga automática**: Las reviews se cargan automáticamente al acceder al producto
2. **Fallback**: Si falla Firebase, intenta cargar desde localStorage como respaldo
3. **Validación de duplicados**: Verifica si el usuario ya valoró el producto
4. **Actualización en tiempo real**: Recarga las reviews después de añadir/actualizar
5. **Manejo de errores**: Feedback claro al usuario en caso de errores

### Estados de Carga

- `loadingReviews`: Indica cuando se están cargando las reviews
- Spinner de carga mientras se obtienen los datos
- Mensajes de error amigables

### Compatibilidad

El sistema mantiene compatibilidad con reviews antiguas de localStorage:
- Campos `user` y `at` se mapean a `userName` y `createdAt`
- Fallback automático a localStorage si Firebase no está disponible

### Funcionalidades Futuras

1. **Imágenes**: Campo `images` preparado para subir fotos en reviews
2. **Moderación**: Estructura lista para sistema de moderación admin
3. **Likes/Útil**: Posible extensión para votar reviews
4. **Respuestas**: Estructura puede extenderse para respuestas a reviews