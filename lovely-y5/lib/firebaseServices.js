// lib/firebaseServices.js
import { 
  collection, 
  doc, 
  addDoc, 
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