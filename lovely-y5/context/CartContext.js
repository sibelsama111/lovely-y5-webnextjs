import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { sendMailClient } from '../lib/mail';
import { orderConfirmationClient, orderNotificationAdmin } from '../lib/emailTemplates';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user, addOrderToHistory } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
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

  const addToCart = (product) => {
    // Lógica para añadir (verificando si ya existe, etc.)
    setCartItems(prevItems => {
      const exists = prevItems.find(i => i.id === product.id);
      if (exists) return prevItems.map(i => i.id===product.id ? { ...i, quantity: (i.quantity||1)+1 } : i);
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId, quantity) => {
    setCartItems(prevItems => prevItems.map(i=> i.id===productId? { ...i, quantity } : i));
  };

  const clearCart = () => setCartItems([]);

  const checkout = (orderData) => {
    // orderData contains shipping and payment info
    const order = {
      id: `order_${Date.now()}`,
      items: cartItems,
      total: cartItems.reduce((s,i)=> s + (i.precio*(i.quantity||1)), 0),
      shipping: orderData,
      status: 'confirmado',
      createdAt: new Date().toISOString()
    };
    // Persist to global orders list (for admin view)
    try{
      const all = JSON.parse(localStorage.getItem('lovely5_orders')||'[]');
      all.push(order);
      localStorage.setItem('lovely5_orders', JSON.stringify(all));
    }catch{}
    // If user is logged, store in their history
    if (user && addOrderToHistory) addOrderToHistory(order);
    // send emails: confirmation to client and notify admin
    try{
      const clientMail = orderConfirmationClient(order);
      sendMailClient({ to: order.shipping?.correo || order.shipping?.email, subject: clientMail.subject, html: clientMail.html, text: clientMail.text }).catch(e=>console.warn('mail client send failed', e));
      const adminMail = orderNotificationAdmin(order);
      sendMailClient({ to: adminMail.to || adminMail.email || adminMail.to, subject: adminMail.subject, html: adminMail.html, text: adminMail.text }).catch(e=>console.warn('mail admin send failed', e));
    }catch(err){ console.warn('send mail error', err); }
    clearCart();
    return order;
  };
  
  // ... más funciones (updateQuantity, clearCart)

  const value = { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, checkout };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}