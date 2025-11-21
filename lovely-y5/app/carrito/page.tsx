'use client'
import { useContext, useState, FormEvent } from 'react'
import { CartContext } from '../../context/CartContext'
import { AuthContext } from '../../context/AuthContext'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

// Funciones de validación
const validateRut = (rut: string) => {
  if (!rut) return 'El RUT es obligatorio'
  const rutRegex = /^[0-9]+-[0-9kK]$/
  if (!rutRegex.test(rut)) {
    return 'RUT debe tener formato 12345678-9'
  }
  return ''
}

const validatePhone = (phone: string) => {
  if (!phone) return 'El teléfono es obligatorio'
  const digits = phone.replace(/[\s-]/g, '')
  if (digits.length !== 9) {
    return 'El número debe tener 9 dígitos'
  }
  if (!/^[0-9]+$/.test(digits)) {
    return 'El número solo debe contener dígitos'
  }
  return ''
}

const validateAddress = (address: string) => {
  if (!address) return 'La dirección es obligatoria'
  if (address.trim().length < 5) {
    return 'La dirección debe tener al menos 5 caracteres'
  }
  return ''
}

const validateCardNumber = (number: string) => {
  if (!number) return 'El número de tarjeta es obligatorio'
  const digits = number.replace(/\s/g, '')
  if (!/^[0-9]{16}$/.test(digits)) {
    return 'El número de tarjeta debe tener 16 dígitos'
  }
  // Algoritmo de Luhn (validación básica de tarjetas)
  let sum = 0
  let isEven = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i])
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    sum += digit
    isEven = !isEven
  }
  if (sum % 10 !== 0) {
    return 'Número de tarjeta inválido'
  }
  return ''
}

const validateCardExp = (exp: string) => {
  if (!exp) return 'La fecha de vencimiento es obligatoria'
  if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(exp)) {
    return 'Fecha debe tener formato MM/AA'
  }
  const [month, year] = exp.split('/')
  const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1)
  const today = new Date()
  if (expDate < today) {
    return 'La tarjeta está vencida'
  }
  return ''
}

const validateCVV = (cvv: string) => {
  if (!cvv) return 'El CVV es obligatorio'
  if (!/^[0-9]{3,4}$/.test(cvv)) {
    return 'CVV debe tener 3 o 4 dígitos'
  }
  return ''
}

const validateName = (name: string) => {
  if (!name) return 'El nombre es obligatorio'
  if (name.trim().length < 3) {
    return 'El nombre debe tener al menos 3 caracteres'
  }
  return ''
}

export default function CarritoPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const [rut, setRut] = useState(user?.rut || '')
  const [shipping, setShipping] = useState(user?.direccion || '')
  const [name, setName] = useState(user ? `${user.primerNombre} ${user.apellidos}` : '')
  const [phone, setPhone] = useState(user?.telefono || '')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  // Estados para los errores
  const [formErrors, setFormErrors] = useState({
    rut: '',
    name: '',
    phone: '',
    shipping: '',
    cardNumber: '',
    cardName: '',
    cardExp: '',
    cardCvv: ''
  })

  const cartItemsArray = Object.values(cartItems)
  const total = cartItemsArray.reduce((s, c) => s + c.precioActual * c.cantidad, 0)

  const validateForm = () => {
    const newErrors = {
      rut: validateRut(rut),
      name: validateName(name),
      phone: validatePhone(phone),
      shipping: validateAddress(shipping),
      cardNumber: validateCardNumber(cardNumber),
      cardName: validateName(cardName),
      cardExp: validateCardExp(cardExp),
      cardCvv: validateCVV(cardCvv)
    }

    setFormErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!cartItemsArray.length) {
      toast.error('El carrito está vacío')
      return
    }

    if (!validateForm()) {
      toast.error('Por favor, corrija los errores en el formulario')
      return
    }

    setProcessing(true)
    const order = {
      id: uuidv4(),
      items: cartItems,
      total,
      shipping: { rut, name, phone, address: shipping },
      payment: { 
        method: 'card', 
        cardNumber: cardNumber.replace(/\s/g, '').slice(-4),
        cardName,
        cardExp
      },
      customer: user ? { id: user.rut, primerNombre: user.primerNombre } : { id: rut, primerNombre: name },
      status: 'confirmado',
      createdAt: new Date().toISOString()
    }

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      })
      clearCart()
      toast.success('Orden procesada exitosamente!')
      router.push('/confirmacion')
    } catch (error) {
      console.error(error)
      toast.error('Error al procesar la orden')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div>
      <h3>Carrito</h3>
      {cartItemsArray.length === 0 && <div className="alert alert-info">Tu carrito está vacío.</div>}
      {cartItemsArray.length > 0 && (
        <div className="row">
          <div className="col-md-7">
            {cartItemsArray.map(item => (
              <div key={item.codigo} className="d-flex align-items-center border p-2 mb-2">
                <img src={item.imagenes?.[0] || '/logo.svg'} width={72} height={72} alt={item.nombre} />
                <div className="ms-3 flex-grow-1">
                  <strong>{item.nombre}</strong>
                  <div>${item.precioActual.toLocaleString('es-CL')}</div>
                  <div className="d-flex align-items-center mt-2">
                    <input 
                      type="number" 
                      className="form-control me-2" 
                      style={{ width: 80 }} 
                      value={item.cantidad} 
                      min={1} 
                      onChange={(e) => updateQuantity(item.codigo, Number(e.target.value))} 
                    />
                    <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.codigo)}>
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-3">
              <strong>Total: ${total.toLocaleString('es-CL')}</strong>
            </div>
          </div>

          <div className="col-md-5">
            <form onSubmit={handleSubmit} className="card p-3">
              <h5>Datos de envío</h5>
              
              <div className="mb-3">
                <label className="form-label">RUT <span className="text-danger">*</span></label>
                <input 
                  className={`form-control ${formErrors.rut ? 'is-invalid' : ''}`}
                  placeholder="12345678-9"
                  value={rut}
                  onChange={(e) => {
                    const value = e.target.value
                    setRut(value)
                    setFormErrors(prev => ({...prev, rut: validateRut(value)}))
                  }}
                  required
                />
                {formErrors.rut && <div className="invalid-feedback">{formErrors.rut}</div>}
                <small className="text-muted">Sin puntos, con guión</small>
              </div>

              <div className="mb-3">
                <label className="form-label">Nombre completo <span className="text-danger">*</span></label>
                <input 
                  className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                  placeholder="Nombre y apellidos"
                  value={name}
                  onChange={(e) => {
                    const value = e.target.value
                    setName(value)
                    setFormErrors(prev => ({...prev, name: validateName(value)}))
                  }}
                  required
                />
                {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Teléfono <span className="text-danger">*</span></label>
                <input 
                  className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                  placeholder="912345678"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 9)
                    setPhone(value)
                    setFormErrors(prev => ({...prev, phone: validatePhone(value)}))
                  }}
                  required
                />
                {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Dirección de envío <span className="text-danger">*</span></label>
                <input 
                  className={`form-control ${formErrors.shipping ? 'is-invalid' : ''}`}
                  placeholder="Calle, número, depto, comuna"
                  value={shipping}
                  onChange={(e) => {
                    const value = e.target.value
                    setShipping(value)
                    setFormErrors(prev => ({...prev, shipping: validateAddress(value)}))
                  }}
                  required
                />
                {formErrors.shipping && <div className="invalid-feedback">{formErrors.shipping}</div>}
              </div>

              <hr />
              <h6>Pago online</h6>
              
              <div className="mb-3">
                <label className="form-label">Número de tarjeta <span className="text-danger">*</span></label>
                <input 
                  className={`form-control ${formErrors.cardNumber ? 'is-invalid' : ''}`}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim()
                    setCardNumber(value)
                    setFormErrors(prev => ({...prev, cardNumber: validateCardNumber(value)}))
                  }}
                  maxLength={19}
                  required
                />
                {formErrors.cardNumber && <div className="invalid-feedback">{formErrors.cardNumber}</div>}
              </div>
              
              <div className="mb-3">
                <label className="form-label">Nombre en la tarjeta <span className="text-danger">*</span></label>
                <input 
                  className={`form-control ${formErrors.cardName ? 'is-invalid' : ''}`}
                  placeholder="Nombre como aparece en la tarjeta"
                  value={cardName}
                  onChange={(e) => {
                    const value = e.target.value
                    setCardName(value)
                    setFormErrors(prev => ({...prev, cardName: validateName(value)}))
                  }}
                  required
                />
                {formErrors.cardName && <div className="invalid-feedback">{formErrors.cardName}</div>}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha de vencimiento <span className="text-danger">*</span></label>
                  <input 
                    className={`form-control ${formErrors.cardExp ? 'is-invalid' : ''}`}
                    placeholder="MM/AA"
                    value={cardExp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      const formattedValue = value.length > 2 ? value.slice(0, 2) + '/' + value.slice(2, 4) : value
                      setCardExp(formattedValue)
                      setFormErrors(prev => ({...prev, cardExp: validateCardExp(formattedValue)}))
                    }}
                    maxLength={5}
                    required
                  />
                  {formErrors.cardExp && <div className="invalid-feedback">{formErrors.cardExp}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">CVV <span className="text-danger">*</span></label>
                  <input 
                    className={`form-control ${formErrors.cardCvv ? 'is-invalid' : ''}`}
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                      setCardCvv(value)
                      setFormErrors(prev => ({...prev, cardCvv: validateCVV(value)}))
                    }}
                    maxLength={4}
                    required
                    type="password"
                  />
                  {formErrors.cardCvv && <div className="invalid-feedback">{formErrors.cardCvv}</div>}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 mt-3"
                disabled={processing || !cartItemsArray.length}
              >
                {processing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Procesando...
                  </>
                ) : (
                  'Confirmar compra'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}