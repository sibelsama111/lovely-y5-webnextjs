"use client";
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import products from '../../data/products';
import { useState } from 'react';
import '../../styles/selectable.css';

export default function Productos() {
  const [query, setQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = products
    .filter(p => p.nombre.toLowerCase().includes(query.toLowerCase()) || p.marca.toLowerCase().includes(query.toLowerCase()))
    .sort((a,b) => sortAsc ? a.precio - b.precio : b.precio - a.precio);

  return (
    <div>
      <h1>Productos</h1>
      <Form className="mb-3">
        <Row>
          <Col md={6}><Form.Control placeholder="Buscar por nombre o marca" value={query} onChange={e=>setQuery(e.target.value)} /></Col>
          <Col md={3}>
            <Form.Select onChange={e=>setSortAsc(e.target.value==='asc')}> 
              <option value="asc">Precio: Menor a Mayor</option>
              <option value="desc">Precio: Mayor a Menor</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>
      <Row>
        {filtered.map(p => (
          <Col md={4} className="mb-3" key={p.id}>
            <Card className="selectable">
              <Card.Img variant="top" src={p.imagen} alt={p.nombre} />
              <Card.Body>
                <Card.Title>{p.nombre}</Card.Title>
                <Card.Text>{p.descripcion}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <strong>${p.precio.toLocaleString('es-CL')}</strong>
                  <Link href={`/producto/${p.id}`} passHref><Button variant="primary">Ver</Button></Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
  </div>

      );
    }
