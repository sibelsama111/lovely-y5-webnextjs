// app/producto/[id]/page.tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useContext } from 'react'
import Link from 'next/link'
import { CartContext } from '../../../context/CartContext'
import { AuthContext } from '../../../context/AuthContext'
import { reviewService } from '../../../lib/firebaseServices'
import { toast } from 'react-hot-toast'

type Review = {
  id?: string;
  productCode: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: any;
  updatedAt?: any;
}

type ProductDetails = {
  id: string;
  codigo: string;
  nombre: string;
  marca?: string;
  tipo?: string;
  precio?: number; // legado
  precioOriginal?: number;
  precioActual?: number;
  imagenes?: string[];
  descripcion?: string;
  detalles?: string;
  fichaTecnica?: Record<string, string>;
  stock: number;
}

export default function ProductoDetalle({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const { addToCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)

  const loadReviews = async (productCode: string) => {
    try {
      setLoadingReviews(true)
      const productReviews = await reviewService.getByProductCode(productCode)
      setReviews(productReviews as Review[])
    } catch (error) {
      console.error('Error cargando reseñas desde Firebase:', error)
      // Fallback a localStorage como respaldo
      try {
        const savedReviews = JSON.parse(localStorage.getItem(`reviews_${params.id}`) || '[]')
        setReviews(savedReviews)
      } catch (e) {
        console.error('Error cargando reseñas desde localStorage:', e)
      }
    } finally {
      setLoadingReviews(false)
    }
  }

  useEffect(() => {
    if (!params.id) return
    fetch('/api/products').then(r => r.json()).then(list => {
      const p = list.find((x: any) => x.id === params.id || x.codigo === params.id)
      console.log('Producto encontrado:', p) // Debug temporal
      console.log('fichaTecnica:', p?.fichaTecnica) // Debug temporal
      setProduct(p || null)
      // Cargar reseñas desde Firebase
      if (p?.codigo) {
        loadReviews(p.codigo)
      }
    }).catch(error => {
      console.error('Error fetching products:', error)
      setProduct(null)
    })
  }, [params.id])

  const add = () => {
    if (!product) {
      toast.error('Producto no disponible')
      return
    }
    
    if (product.stock <= 0) {
      toast.error('Producto sin stock disponible')
      return
    }
    
    try {
      addToCart({
        codigo: product.codigo || product.id,
        nombre: product.nombre,
        precioOriginal: product.precioOriginal,
        precioActual: product.precioActual || product.precio || 0,
        imagenes: product.imagenes && product.imagenes.length > 0 ? product.imagenes : ['/logo.svg']
      })
      
      toast.success(`${product.nombre} añadido al carrito`)
    } catch (error) {
      console.error('Error al añadir al carrito:', error)
      toast.error('Error al añadir el producto al carrito')
    }
  }

  const submitReview = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para dejar una reseña')
      return
    }
    if (!comment.trim()) {
      toast.error('Por favor escribe un comentario')
      return
    }
    if (!product?.codigo) {
      toast.error('Error: No se puede identificar el producto')
      return
    }

    try {
      // Verificar si el usuario ya valoró este producto
      const existingReview = await reviewService.getUserReviewForProduct(user.rut, product.codigo)
      
      if (existingReview) {
        // Actualizar valoración existente
        await reviewService.update(existingReview.id, {
          rating,
          comment: comment.trim()
        })
        toast.success('Valoración actualizada exitosamente')
      } else {
        // Crear nueva valoración
        const newReviewData = {
          productCode: product.codigo,
          userId: user.rut,
          userName: `${user.primerNombre} ${user.apellidos}`,
          rating,
          comment: comment.trim(),
          images: [] // Por ahora vacío, se puede implementar después
        }
        await reviewService.create(newReviewData)
        toast.success('Valoración agregada exitosamente')
      }
      
      // Recargar reviews
      await loadReviews(product.codigo)
      setComment('')
      setRating(5)
    } catch (error) {
      console.error('Error guardando valoración:', error)
      toast.error('Error al guardar valoración. Inténtalo nuevamente.')
    }
  }

  if (!product) return <div className="alert alert-warning">Cargando producto...</div>
  if (!product.nombre) return <div className="alert alert-danger">Producto no encontrado</div>

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'Sin valoraciones'

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <img 
              src={product.imagenes?.[0] || '/logo.svg'} 
              className="card-img-top p-4" 
              alt={product.nombre}
              style={{ objectFit: 'contain', height: '400px' }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">{product.nombre}</h2>
          <div className="d-flex align-items-center mb-3">
            <span className="badge bg-primary me-2">{product.marca}</span>
            <span className="badge bg-secondary">{product.tipo}</span>
          </div>
          <div className="mb-4">
            {product.precioOriginal && product.precioActual && product.precioOriginal !== product.precioActual ? (
              <div className="d-flex align-items-center gap-3 mb-2">
                <span className="text-muted text-decoration-line-through fs-4">
                  ${product.precioOriginal.toLocaleString('es-CL')}
                </span>
                <h3 className="text-primary fw-bold mb-0">
                  ${product.precioActual.toLocaleString('es-CL')}
                </h3>
                <span className="badge bg-danger fs-6">
                  -{Math.round(((product.precioOriginal - product.precioActual) / product.precioOriginal) * 100)}%
                </span>
              </div>
            ) : (
              <h3 className="text-primary mb-0">
                ${Number(product.precioActual || product.precio || 0).toLocaleString('es-CL')}
              </h3>
            )}
          </div>
          
          {product.descripcion && (
            <div className="mb-4">
              <h5>Descripción</h5>
              <p>{product.descripcion}</p>
            </div>
          )}

          <div className="mb-4">
            <h5>Detalles técnicos</h5>
            <div className="card">
              <ul className="list-group list-group-flush">
                {product.fichaTecnica && typeof product.fichaTecnica === 'object' ? 
                  Object.entries(product.fichaTecnica).map(([key, value]) => (
                    <li key={key} className="list-group-item">
                      <strong>{key}:</strong> {value}
                    </li>
                  )) : (
                    <li className="list-group-item">
                      <em>Información técnica no disponible</em>
                    </li>
                  )
                }
              </ul>
            </div>
          </div>

          <div className="mb-4">
            <button className="btn btn-primary btn-lg w-100" onClick={add}>
              Añadir al carrito
            </button>
            {product.stock > 0 ? (
              <small className="text-success d-block mt-2">
                ✓ {product.stock} unidades disponibles
              </small>
            ) : (
              <small className="text-danger d-block mt-2">
                ✕ Sin stock disponible
              </small>
            )}
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Valoraciones y Reseñas</h5>
              <span className="badge bg-primary fs-6">
                {averageRating} ⭐
              </span>
            </div>
            <div className="card-body">
              {user ? (
                <div className="mb-4">
                  <h6>Deja tu valoración</h6>
                  <div className="row">
                    <div className="col-md-2">
                      <select 
                        className="form-select mb-3" 
                        value={rating} 
                        onChange={(e) => setRating(Number(e.target.value))}
                      >
                        {[5,4,3,2,1].map(n => (
                          <option key={n} value={n}>{n} ⭐</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-8">
                      <textarea
                        className="form-control mb-3"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Comparte tu experiencia con este producto..."
                      />
                    </div>
                    <div className="col-md-2">
                      <button 
                        className="btn btn-primary w-100" 
                        onClick={submitReview}
                      >
                        Publicar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="alert alert-info">
                  <Link href="/login" className="alert-link">Inicia sesión</Link> para dejar tu valoración
                </div>
              )}

              <div className="mt-4">
                {loadingReviews ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Cargando valoraciones...</span>
                    </div>
                  </div>
                ) : reviews.length === 0 ? (
                  <p className="text-muted">Sé el primero en valorar este producto</p>
                ) : (
                  reviews.map((review, index) => (
                    <div key={review.id || index} className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <h6 className="card-subtitle mb-2">{review.userName}</h6>
                          <span className="text-warning">{review.rating} ⭐</span>
                        </div>
                        <p className="card-text">{review.comment}</p>
                        <small className="text-muted">
                          {new Date(review.createdAt?.toDate?.() || review.createdAt).toLocaleDateString('es-CL', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
