// context/CartContext.tsx
'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { sendMailClient } from '../lib/mail';
import { orderConfirmationClient, orderConfirmationAdmin } from '../lib/emailTemplates';

export type CartItem = {
  codigo: string // Código del producto (ej: LVL5_IPHONE12_128GB)
  nombre: string
  precioOriginal?: number
  precioActual: number
  cantidad: number
  imagenes?: string[]
}

type OrderShipping = {
  correo?: string
  email?: string
  // Add other shipping fields as needed
}

type Order = {
  id: string
  items: Record<string, CartItem> // Map de productos por ID
  total: number
  shipping: OrderShipping
  status: string
  createdAt: string
}

type CartContextProps = {
  cartItems: Record<string, CartItem> // Map de productos por código
  addToCart: (product: Omit<CartItem, 'cantidad'>) => void
  removeFromCart: (codigo: string) => void
  updateQuantity: (codigo: string, cantidad: number) => void
  clearCart: () => void
  checkout: (orderData: OrderShipping) => Order
}

export const CartContext = createContext<CartContextProps>({
  cartItems: {}, // Mapa vacío
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  checkout: () => ({
    id: '',
    items: {},
    total: 0,
    shipping: {},
    status: '',
    createdAt: ''
  })
});

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState<Record<string, CartItem>>(() => {
    try {
      if (typeof window === 'undefined') return {};
      const storedCart = localStorage.getItem('lovely5_cart');
      return storedCart ? JSON.parse(storedCart) : {};
    } catch { return {}; }
  });

  // Guardar en localStorage cada vez que cambie
  useEffect(() => {
    try { localStorage.setItem('lovely5_cart', JSON.stringify(cartItems)); } catch {}
  }, [cartItems]);

  const addToCart = (product: Omit<CartItem, 'cantidad'>) => {
    setCartItems(prevItems => {
      const exists = prevItems[product.codigo];
      if (exists) {
        return {
          ...prevItems,
          [product.codigo]: { ...exists, cantidad: exists.cantidad + 1 }
        };
      }
      return {
        ...prevItems,
        [product.codigo]: { ...product, cantidad: 1 }
      };
    });
  };

  const removeFromCart = (codigo: string) => {
    setCartItems(prevItems => {
      const newItems = { ...prevItems };
      delete newItems[codigo];
      return newItems;
    });
  };
  
  const updateQuantity = (codigo: string, cantidad: number) => {
    setCartItems(prevItems => ({
      ...prevItems,
      [codigo]: { ...prevItems[codigo], cantidad }
    }));
  };

  const clearCart = () => setCartItems({});

  const checkout = (orderData: OrderShipping) => {
    const itemsArray = Object.values(cartItems);
    const order: Order = {
      id: `order_${Date.now()}`,
      items: cartItems, // Mantener como map para Firebase
      total: itemsArray.reduce((s,i)=> s + (i.precioActual * i.cantidad), 0),
      shipping: orderData,
      status: 'confirmado',
      createdAt: new Date().toISOString()
    };
    try{
      const all = JSON.parse(localStorage.getItem('lovely5_orders')||'[]');
      all.push(order);
      localStorage.setItem('lovely5_orders', JSON.stringify(all));
    }catch{}
    if (user) {
      try {
        const orders = JSON.parse(localStorage.getItem(`lovely5_orders_${user.correo}`)||'[]');
        orders.push(order);
        localStorage.setItem(`lovely5_orders_${user.correo}`, JSON.stringify(orders));
      } catch {}
    }
    try{
      const clientMail = orderConfirmationClient(order);
      sendMailClient({ to: order.shipping?.correo || order.shipping?.email, subject: clientMail.subject, html: clientMail.html, text: clientMail.text }).catch(e=>console.warn('mail client send failed', e));
      const adminMail = orderConfirmationAdmin(order);
      sendMailClient({ to: adminMail.to, subject: adminMail.subject, html: adminMail.html, text: adminMail.text }).catch(e=>console.warn('mail admin send failed', e));
    }catch(err){ console.warn('send mail error', err); }
    clearCart();
    return order;
  };

  const value = { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, checkout };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
