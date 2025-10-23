import { Card, Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function Login(){
  const router = useRouter();

  const handle = (e)=>{ e.preventDefault(); alert('Login simulado.'); router.push('/'); }

  return (
    <Card>
      <Card.Header><h2>Iniciar Sesión</h2></Card.Header>
      <Card.Body>
        <Form onSubmit={handle}>
          <Form.Group className="mb-2"><Form.Label>Email o Teléfono</Form.Label><Form.Control required/></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Contraseña</Form.Label><Form.Control type="password" required/></Form.Group>
          <Button type="submit">Entrar</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
