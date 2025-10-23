// app/carrito/page.tsx
'use client'
import { useContext, useState } from 'react'
import { CartContext } from '../../context/CartContext'
import { AuthContext } from '../../context/AuthContext'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'

export default function CarritoPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const [shipping, setShipping] = useState(user?.direccion || '')
  const [name, setName] = useState(user ? `${user.primerNombre} ${user.apellidos}` : '')
  const [phone, setPhone] = useState(user?.telefono || '')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  const total = cartItems.reduce((s, c) => s + c.precio * c.quantity, 0)

  const confirmOrder = async () => {
    if (cartItems.length === 0) { alert('Carrito vacío'); return }
    if (!name || !phone || !shipping) { alert('Completa datos de envío'); return }
    setProcessing(true)
    const order = {
      id: uuidv4(),
      items: cartItems,
      total,
      shipping: { name, phone, address: shipping },
      payment: { method: 'card', cardLast4: cardNumber.slice(-4) || '0000' },
      customer: user ? { id: user.rut, primerNombre: user.primerNombre } : { id: 'guest', primerNombre: name },
      status: 'confirmado',
      createdAt: new Date().toISOString()
    }
    try {
      await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) })
      clearCart()
      alert('Compra efectuada ✅')
      router.push('/confirmacion')
    } catch (err) {
      alert('Error creando orden (demo)')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div>
      <h3>Carrito</h3>
      {cartItems.length === 0 && <div className="alert alert-info">Tu carrito está vacío.</div>}
      {cartItems.length > 0 && (
        <div className="row">
          <div className="col-md-7">
            {cartItems.map(item => (
              <div key={item.id} className="d-flex align-items-center border p-2 mb-2">
                <img src={item.imagenes?.[0] || '/logo.svg'} width={72} height={72} alt={item.nombre} />
                <div className="ms-3 flex-grow-1">
                  <strong>{item.nombre}</strong>
                  <div>${item.precio.toLocaleString('es-CL')}</div>
                  <div className="d-flex align-items-center mt-2">
                    <input type="number" className="form-control me-2" style={{ width: 80 }} value={item.quantity} min={1} onChange={(e) => updateQuantity(item.id, Number(e.target.value))} />
                    <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.id)}>Quitar</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-3"><strong>Total: ${total.toLocaleString('es-CL')}</strong></div>
          </div>

          <div className="col-md-5">
            <div className="card p-3">
              <h5>Datos de envío</h5>
              <input className="form-control mb-2" placeholder="Nombre completo" value={name} onChange={e => setName(e.target.value)} />
              <input className="form-control mb-2" placeholder="Teléfono" value={phone} onChange={e => setPhone(e.target.value)} />
              <input className="form-control mb-2" placeholder="Dirección" value={shipping} onChange={e => setShipping(e.target.value)} />
              <hr />
              <h6>Pago (modo TEST)</h6>
              <input className="form-control mb-2" placeholder="Número de tarjeta" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
              <input className="form-control mb-2" placeholder="Nombre en tarjeta" value={cardName} onChange={e => setCardName(e.target.value)} />
              <div className="d-flex">
                <input className="form-control me-2" placeholder="MM/AA" value={cardExp} onChange={e => setCardExp(e.target.value)} />
                <input className="form-control" placeholder="CVV" value={cardCvv} onChange={e => setCardCvv(e.target.value)} />
              </div>
              <button className="btn btn-success w-100 mt-3" onClick={confirmOrder} disabled={processing}>{processing ? 'Procesando...' : 'Confirmar compra (TEST)'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
