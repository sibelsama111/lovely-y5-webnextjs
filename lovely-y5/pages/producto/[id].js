import { useRouter } from 'next/router';
import products from '../../data/products';
import { Card, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import '../../styles/selectable.css';

export default function Producto() {
  const router = useRouter();
  const { id } = router.query;
  const product = products.find(p => p.id === id) || products[0];
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleAdd = () => {
    addToCart(product);
    router.push('/carrito');
  };

  return (
  <Card className="selectable">
      <Card.Header><h2>{product.nombre}</h2></Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}><Image src={product.imagen} alt={product.nombre} fluid /></Col>
          <Col md={6}>
            <h3>${product.precio.toLocaleString('es-CL')}</h3>
            <p>{product.descripcion}</p>
            <p><strong>Detalles:</strong> {product.detalles}</p>
            <p><strong>Specs:</strong> {JSON.stringify(product.specs)}</p>
            <Button onClick={handleAdd}>Añadir al Carrito</Button>
          </Col>
        </Row>
        <hr />
        <h4>Comentarios</h4>
        {user ? (
          <Form onSubmit={(e)=>{e.preventDefault(); setComment(''); alert('Comentario agregado (simulado)');}}>
            <Form.Group className="mb-2">
              <Form.Label>Valoración</Form.Label>
              <Form.Select value={rating} onChange={e=>setRating(Number(e.target.value))}>
                {[5,4,3,2,1].map(n=> <option key={n} value={n}>{n} estrellas</option>) }
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control as="textarea" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Deja tu comentario" />
            </Form.Group>
            <Button type="submit">Enviar</Button>
          </Form>
        ) : (
          <p><Link href="/login">Inicia sesión</Link> para dejar un comentario.</p>
        )}
      </Card.Body>
    </Card>
  );
}