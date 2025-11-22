import { 
  collection, 
  doc, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore'
import { db } from './firebase'

// Servicios para productos
export const productService = {
  // Obtener todos los productos
  async getAll() {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error obteniendo productos:', error)
      throw error
    }
  },

  // Obtener producto por ID
  async getById(id) {
    try {
      const docRef = doc(db, 'products', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        return null
      }
    } catch (error) {
      console.error('Error obteniendo producto:', error)
      throw error
    }
  },

  // Crear nuevo producto
  async create(productData) {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creando producto:', error)
      throw error
    }
  },

  // Actualizar producto
  async update(id, productData) {
    try {
      const docRef = doc(db, 'products', id)
      await updateDoc(docRef, {
        ...productData,
        updatedAt: new Date()
      })
      return true
    } catch (error) {
      console.error('Error actualizando producto:', error)
      throw error
    }
  },

  // Eliminar producto
  async delete(id) {
    try {
      await deleteDoc(doc(db, 'products', id))
      return true
    } catch (error) {
      console.error('Error eliminando producto:', error)
      throw error
    }
  },

  // Buscar productos por categoría
  async getByCategory(category) {
    try {
      const q = query(
        collection(db, 'products'),
        where('tipo', '==', category)
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error obteniendo productos por categoría:', error)
      throw error
    }
  }
}

// Servicios para pedidos
export const orderService = {
  // Crear nuevo pedido
  async create(orderData) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending'
      })
      return docRef.id
    } catch (error) {
      console.error('Error creando pedido:', error)
      throw error
    }
  },

  // Obtener pedidos del usuario
  async getByUserId(userId) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error obteniendo pedidos del usuario:', error)
      throw error
    }
  },

  // Actualizar estado del pedido
  async updateStatus(orderId, status) {
    try {
      const docRef = doc(db, 'orders', orderId)
      await updateDoc(docRef, {
        status,
        updatedAt: new Date()
      })
      return true
    } catch (error) {
      console.error('Error actualizando estado del pedido:', error)
      throw error
    }
  }
}

// Servicios para contactos
export const contactService = {
  // Crear nueva consulta de contacto
  async create(contactData) {
    try {
      const docRef = await addDoc(collection(db, 'contacts'), {
        ...contactData,
        createdAt: new Date(),
        status: 'pending'
      })
      return docRef.id
    } catch (error) {
      console.error('Error creando contacto:', error)
      throw error
    }
  },

  // Obtener todas las consultas
  async getAll() {
    try {
      const q = query(
        collection(db, 'contacts'),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error obteniendo contactos:', error)
      throw error
    }
  }
}

// Servicios para usuarios
export const userService = {
  // Obtener usuario por ID
  async getById(userId) {
    try {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        return null
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error)
      throw error
    }
  },

  // Crear nuevo usuario
  async create(userData) {
    try {
      console.log('🔧 userService.create - Iniciando con datos:', userData)
      
      // Verificar si el RUT ya existe
      console.log('🔧 Verificando si RUT existe:', userData.rut)
      const existingUser = await this.getByRUT(userData.rut)
      if (existingUser) {
        console.log('❌ RUT ya existe:', userData.rut)
        throw new Error('User already exists')
      }
      
      console.log('✅ RUT disponible, creando usuario...')
      const docRef = doc(db, 'users', userData.rut)
      const dataToSave = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      console.log('🔧 Datos a guardar en Firestore:', dataToSave)
      console.log('🔧 Referencia del documento:', docRef.path)
      
      await setDoc(docRef, dataToSave)
      console.log('✅ Usuario guardado exitosamente')
      
      return userData.rut
    } catch (error) {
      console.error('❌ Error creando usuario:', error)
      console.error('❌ Tipo de error:', error.constructor.name)
      console.error('❌ Mensaje completo:', error.message)
      console.error('❌ Stack trace:', error.stack)
      throw error
    }
  },

  // Obtener usuario por RUT
  async getByRUT(rut) {
    try {
      const docRef = doc(db, 'users', rut)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { rut: docSnap.id, ...docSnap.data() }
      } else {
        return null
      }
    } catch (error) {
      console.error('Error obteniendo usuario por RUT:', error)
      throw error
    }
  },

  // Autenticar usuario
  async authenticate(identifier, password) {
    try {
      let user = null
      
      // Intentar por RUT
      if (/^[0-9]{7,8}[0-9K]$/.test(identifier)) {
        user = await this.getByRUT(identifier)
      } else {
        // Buscar por correo o teléfono
        const q = query(
          collection(db, 'users'),
          where(identifier.includes('@') ? 'correo' : 'telefono', '==', identifier)
        )
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]
          user = { rut: doc.id, ...doc.data() }
        }
      }
      
      if (user && user.password === password && user.activo) {
        return user
      }
      return null
    } catch (error) {
      console.error('Error en autenticación:', error)
      throw error
    }
  },

  // Actualizar usuario
  async update(userId, userData) {
    try {
      const docRef = doc(db, 'users', userId)
      await updateDoc(docRef, {
        ...userData,
        updatedAt: new Date()
      })
      return true
    } catch (error) {
      console.error('Error actualizando usuario:', error)
      throw error
    }
  }
}

// Servicios para categorías
export const categoryService = {
  // Obtener todas las categorías activas
  async getAll() {
    try {
      const q = query(
        collection(db, 'categories'),
        where('activa', '==', true),
        orderBy('orden', 'asc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error obteniendo categorías:', error)
      throw error
    }
  }
}

// Servicios para valoraciones de productos
export const reviewService = {
  // Obtener valoraciones de un producto
  async getByProductCode(productCode) {
    try {
      const q = query(
        collection(db, 'reviews'), 
        where('productCode', '==', productCode),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error obteniendo valoraciones:', error)
      throw error
    }
  },

  // Crear nueva valoración
  async create(reviewData) {
    try {
      const docRef = await addDoc(collection(db, 'reviews'), {
        ...reviewData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creando valoración:', error)
      throw error
    }
  },

  // Actualizar valoración existente
  async update(reviewId, updates) {
    try {
      const docRef = doc(db, 'reviews', reviewId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      })
      return true
    } catch (error) {
      console.error('Error actualizando valoración:', error)
      throw error
    }
  },

  // Eliminar valoración
  async delete(reviewId) {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId))
      return true
    } catch (error) {
      console.error('Error eliminando valoración:', error)
      throw error
    }
  },

  // Verificar si un usuario ya valoró un producto
  async getUserReviewForProduct(userId, productCode) {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('userId', '==', userId),
        where('productCode', '==', productCode)
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.empty ? null : {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      }
    } catch (error) {
      console.error('Error verificando valoración de usuario:', error)
      throw error
    }
  }
}