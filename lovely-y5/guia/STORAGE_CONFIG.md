# Configuración de Firebase Storage para Fotos de Perfil

## 📁 Estructura de Archivos

```
storage/
├── users/
│   ├── {userId}/
│   │   ├── profile/
│   │   │   ├── avatar.jpg
│   │   │   └── avatar_thumb.jpg
│   └── ...
└── products/
    └── {productId}/
        └── images/
            └── *.jpg
```

## 🔐 Reglas de Storage (storage.rules)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Fotos de perfil de usuarios
    match /users/{userId}/profile/{filename} {
      // Lectura pública para mostrar avatares
      allow read: if true;
      
      // Escritura solo para el propio usuario o admin
      allow write: if request.auth != null && 
        (request.auth.uid == userId || isAdmin(request.auth.uid)) &&
        isValidImage(request.resource) &&
        request.resource.size < 2 * 1024 * 1024; // 2MB máximo
      
      // Eliminación solo para el propio usuario o admin
      allow delete: if request.auth != null && 
        (request.auth.uid == userId || isAdmin(request.auth.uid));
    }
    
    // Imágenes de productos (solo admin/trabajador)
    match /products/{productId}/images/{filename} {
      allow read: if true;
      allow write: if request.auth != null && 
        (isAdmin(request.auth.uid) || isWorker(request.auth.uid)) &&
        isValidImage(request.resource);
      allow delete: if request.auth != null && 
        (isAdmin(request.auth.uid) || isWorker(request.auth.uid));
    }
    
    // Funciones de validación
    function isValidImage(resource) {
      return resource.contentType.matches('image/.*') &&
        resource.contentType in ['image/jpeg', 'image/png', 'image/webp'];
    }
    
    function isAdmin(uid) {
      return exists(/databases/(default)/documents/users/$(uid)) &&
        get(/databases/(default)/documents/users/$(uid)).data.rol == 'admin';
    }
    
    function isWorker(uid) {
      return exists(/databases/(default)/documents/users/$(uid)) &&
        get(/databases/(default)/documents/users/$(uid)).data.rol == 'trabajador';
    }
  }
}
```

## 🖼️ Componente React para Subir Foto de Perfil

```tsx
// components/ProfileImageUpload.tsx
'use client'
import { useState, useRef } from 'react'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface ProfileImageUploadProps {
  userId: string
  currentImageUrl?: string
  onImageUpdate: (newUrl: string | null) => void
  readonly?: boolean
}

export default function ProfileImageUpload({ 
  userId, 
  currentImageUrl, 
  onImageUpdate, 
  readonly = false 
}: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validaciones
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida')
      return
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
      alert('La imagen debe ser menor a 2MB')
      return
    }

    try {
      setUploading(true)
      
      const storage = getStorage()
      const imageRef = ref(storage, `users/${userId}/profile/avatar.jpg`)
      
      // Subir nueva imagen
      await uploadBytes(imageRef, file)
      const newImageUrl = await getDownloadURL(imageRef)
      
      // Actualizar documento de usuario
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        fotoPerfil: newImageUrl
      })
      
      onImageUpdate(newImageUrl)
      alert('¡Foto de perfil actualizada!')
      
    } catch (error) {
      console.error('Error subiendo imagen:', error)
      alert('Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return
    
    try {
      setUploading(true)
      
      const storage = getStorage()
      const imageRef = ref(storage, `users/${userId}/profile/avatar.jpg`)
      
      // Eliminar imagen de Storage
      await deleteObject(imageRef)
      
      // Actualizar documento de usuario
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        fotoPerfil: null
      })
      
      onImageUpdate(null)
      alert('Foto de perfil eliminada')
      
    } catch (error) {
      console.error('Error eliminando imagen:', error)
      alert('Error al eliminar la imagen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="text-center">
      {/* Imagen actual */}
      <div className="mb-3">
        <img 
          src={currentImageUrl || '/default-avatar.png'} 
          alt="Foto de perfil"
          className="rounded-circle"
          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
        />
      </div>
      
      {!readonly && (
        <div>
          {/* Input oculto */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
          />
          
          {/* Botones */}
          <div className="d-flex gap-2 justify-content-center">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Subiendo...' : 'Cambiar foto'}
            </button>
            
            {currentImageUrl && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={handleRemoveImage}
                disabled={uploading}
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
```

## 🏃‍♂️ Comandos de Desarrollo

```bash
# Desplegar reglas de Storage
firebase deploy --only storage

# Probar reglas localmente
firebase emulators:start --only storage,firestore

# Agregar usuarios de prueba
node scripts/add-test-users.mjs

# Validar estructura de usuarios
firebase firestore:databases:list
```

## 📊 Índices Firestore Requeridos

```bash
# Crear índices automáticamente
firebase firestore:indexes

# O manualmente en firestore.indexes.json:
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
  ],
  "fieldOverrides": []
}
```