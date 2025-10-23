"use client";
import { useCart } from '../../context/CartContext';
import { Card, Button, Form, ListGroup } from 'react-bootstrap';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Carrito() {
  const { cartItems, removeFromCart } = useCart();
  const [shipping, setShipping] = useState({nombre:'', direccion:'', telefono:''});

  const total = cartItems.reduce((s,i)=> s + (i.precio*(i.quantity||1)), 0);

  const router = useRouter();
  const handleCheckout = (e) => {
    e.preventDefault();
    const order = checkout(shipping);
    router.push(`/confirmacion?id=${order.id}`);
  };

  return (
    <div>
      <h1>Carrito</h1>
      <Card>
        <Card.Body>
          <ListGroup>
            {cartItems.length===0 && <ListGroup.Item>No hay productos en el carrito.</ListGroup.Item>}
            {cartItems.map(item => (
              <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{item.nombre}</strong>
                  <div>${item.precio.toLocaleString('es-CL')}</div>
                </div>
                <div>
                  <Button variant="danger" size="sm" onClick={()=>removeFromCart(item.id)}>Quitar</Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <hr />
          <h4>Total: ${total.toLocaleString('es-CL')}</h4>
          <Form onSubmit={handleCheckout} className="mt-3">
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={shipping.nombre} onChange={e=>setShipping({...shipping,nombre:e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Dirección</Form.Label>
              <Form.Control value={shipping.direccion} onChange={e=>setShipping({...shipping,direccion:e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control value={shipping.telefono} onChange={e=>setShipping({...shipping,telefono:e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Datos de Tarjeta (simulados)</Form.Label>
              <Form.Control placeholder="Número de tarjeta" required />
            </Form.Group>
            <Button type="submit">Confirmar Compra (simulado)</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
