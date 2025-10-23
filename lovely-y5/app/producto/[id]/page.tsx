// app/producto/[id]/page.tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useContext } from 'react'
import { CartContext } from '../../../context/CartContext'
import { AuthContext } from '../../../context/AuthContext'

export default function ProductoDetalle() {
  const params = useSearchParams()
  const id = params?.get('id') || ''
  const [product, setProduct] = useState<any | null>(null)
  const { addToCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(()=> {
    if (!id) return
    fetch('/api/products').then(r=> r.json()).then(list => {
      const p = list.find((x:any) => x.id === id || x.codigo === id)
      setProduct(p || null)
    })
  }, [id])

  const add = () => {
    if (!product) return
    addToCart({ id: product.id, nombre: product.nombre, precio: product.precio, imagenes: product.imagenes })
    alert('Añadido al carrito')
  }

  const submitReview = () => {
    if (!user) { alert('Debes iniciar sesión'); return }
    const r = { user: user.primerNombre, rating, comment, at: new Date().toISOString() }
    setReviews(prev => [r, ...prev])
    setComment('')
  }

  if (!product) return <div className="alert alert-warning">Cargando...</div>

  return (
    <div className="row">
      <div className="col-md-5">
        <img src={product.imagenes?.[0] || '/svgs/logo.svg'} className="img-fluid" alt={product.nombre} />
      </div>
      <div className="col-md-7">
        <h2>{product.nombre}</h2>
        <p className="text-muted">{product.marca} • {product.tipo}</p>
        <h4>${Number(product.precio).toLocaleString('es-CL')}</h4>
        <p>{product.descripcion}</p>
        <p><strong>Detalles:</strong> {product.detalles}</p>
        <div>
          <button className="btn btn-primary me-2" onClick={add}>Añadir al carrito</button>
        </div>
      </div>

      <div className="col-12 mt-4">
        <h5>Reseñas</h5>
        {user ? (
          <div>
            <div className="mb-2">
              <label>Valoración</label>
              <select className="form-select w-auto" value={rating} onChange={(e)=>setRating(Number(e.target.value))}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
              </select>
            </div>
            <textarea className="form-control mb-2" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Comentario..." />
            <button className="btn btn-success" onClick={submitReview}>Enviar reseña</button>
          </div>
        ) : <div className="alert alert-secondary">Inicia sesión para dejar reseña</div>}
        {reviews.map((r,i)=> (
          <div key={i} className="border p-2 mb-2">
            <strong>{r.user}</strong> • {r.rating} ⭐
            <div>{r.comment}</div>
            <small>{new Date(r.at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  )
}
