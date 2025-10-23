// app/producto/[id]/page.tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useContext } from 'react'
import Link from 'next/link'
import { CartContext } from '../../../context/CartContext'
import { AuthContext } from '../../../context/AuthContext'

type Review = {
  user: string;
  rating: number;
  comment: string;
  at: string;
}

type ProductDetails = {
  id: string;
  codigo: string;
  nombre: string;
  marca: string;
  tipo: string;
  precio: number;
  imagenes: string[];
  descripcion: string;
  detalles: string;
  fichaTecnica: Record<string, string>;
  stock: number;
}

export default function ProductoDetalle() {
  const params = useSearchParams()
  const id = params?.get('id') || ''
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const { addToCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    if (!id) return
    fetch('/api/products').then(r => r.json()).then(list => {
      const p = list.find((x: any) => x.id === id || x.codigo === id)
      setProduct(p || null)
      // Intentar cargar reseñas guardadas
      try {
        const savedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`) || '[]')
        setReviews(savedReviews)
      } catch (e) {
        console.error('Error cargando reseñas:', e)
      }
    })
  }, [id])

  const add = () => {
    if (!product) return
    addToCart({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagenes: product.imagenes
    })
    alert('¡Producto añadido al carrito!')
  }

  const submitReview = () => {
    if (!user) {
      alert('Debes iniciar sesión para dejar una reseña')
      return
    }
    if (!comment.trim()) {
      alert('Por favor escribe un comentario')
      return
    }
    const newReview = {
      user: `${user.primerNombre} ${user.apellidos}`,
      rating,
      comment: comment.trim(),
      at: new Date().toISOString()
    }
    const updatedReviews = [newReview, ...reviews]
    setReviews(updatedReviews)
    // Guardar en localStorage
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews))
    setComment('')
    setRating(5)
  }

  if (!product) return <div className="alert alert-warning">Cargando producto...</div>

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
          <h3 className="text-primary mb-4">${Number(product.precio).toLocaleString('es-CL')}</h3>
          
          <div className="mb-4">
            <h5>Descripción</h5>
            <p>{product.descripcion}</p>
          </div>

          <div className="mb-4">
            <h5>Detalles técnicos</h5>
            <div className="card">
              <ul className="list-group list-group-flush">
                {Object.entries(product.fichaTecnica).map(([key, value]) => (
                  <li key={key} className="list-group-item">
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
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
                {reviews.length === 0 ? (
                  <p className="text-muted">Sé el primero en valorar este producto</p>
                ) : (
                  reviews.map((review, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <h6 className="card-subtitle mb-2">{review.user}</h6>
                          <span className="text-warning">{review.rating} ⭐</span>
                        </div>
                        <p className="card-text">{review.comment}</p>
                        <small className="text-muted">
                          {new Date(review.at).toLocaleDateString('es-CL', { 
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
