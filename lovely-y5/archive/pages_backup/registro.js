"use client";
import { Form, Button, Card } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

export default function Registro(){
  
  const router = useRouter();
  const { /*login*/ } = useAuth();

  const handle = (e)=>{ e.preventDefault(); alert('Registro simulado.'); router.push('/login'); }

  return (
    <Card>
      <Card.Header><h2>Registro</h2></Card.Header>
      <Card.Body>
        <Form onSubmit={handle}>
          <Form.Group className="mb-2"><Form.Label>RUT / DNI</Form.Label><Form.Control required/></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Primer Nombre</Form.Label><Form.Control required/></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Segundo Nombre (opcional)</Form.Label><Form.Control/></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Apellidos</Form.Label><Form.Control required/></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Email</Form.Label><Form.Control type="email" required/></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Teléfono</Form.Label><Form.Control required/></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Dirección</Form.Label><Form.Control required/></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Contraseña</Form.Label><Form.Control type="password" required/></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Confirmar Contraseña</Form.Label><Form.Control type="password" required/></Form.Group>
          <Button type="submit">Registrarse</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
