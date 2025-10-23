// context/CartContext.tsx
'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { sendMailClient } from '../lib/mail';
import { orderConfirmationClient, orderNotificationAdmin } from '../lib/emailTemplates';

export type CartItem = {
  id: string
  nombre: string
  precio: number
  quantity: number
  imagenes?: string[]
}

type OrderShipping = {
  correo?: string
  email?: string
  // Add other shipping fields as needed
}

type Order = {
  id: string
  items: CartItem[]
  total: number
  shipping: OrderShipping
  status: string
  createdAt: string
}

type CartContextProps = {
  cartItems: CartItem[]
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  checkout: (orderData: OrderShipping) => Order
}

export const CartContext = createContext<CartContextProps>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  checkout: () => ({
    id: '',
    items: [],
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
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      if (typeof window === 'undefined') return [];
      const storedCart = localStorage.getItem('lovely5_cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch { return []; }
  });

  // Guardar en localStorage cada vez que cambie
  useEffect(() => {
    try { localStorage.setItem('lovely5_cart', JSON.stringify(cartItems)); } catch {}
  }, [cartItems]);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const exists = prevItems.find(i => i.id === product.id);
      if (exists) return prevItems.map(i => i.id===product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prevItems => prevItems.map(i=> i.id===productId? { ...i, quantity } : i));
  };

  const clearCart = () => setCartItems([]);

  const checkout = (orderData: OrderShipping) => {
    const order: Order = {
      id: `order_${Date.now()}`,
      items: cartItems,
      total: cartItems.reduce((s,i)=> s + (i.precio * i.quantity), 0),
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
      const adminMail = orderNotificationAdmin(order);
      sendMailClient({ to: adminMail.to || adminMail.email || adminMail.to, subject: adminMail.subject, html: adminMail.html, text: adminMail.text }).catch(e=>console.warn('mail admin send failed', e));
    }catch(err){ console.warn('send mail error', err); }
    clearCart();
    return order;
  };

  const value = { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, checkout };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
