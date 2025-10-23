import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin(){
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { adminLogin } = useAuth();

  const handle = (e)=>{
    e.preventDefault();
    try{
      adminLogin(rut, password);
      router.push('/admin');
    }catch(err){ setError(err.message); }
  };

  return (
    <Card>
      <Card.Header><h2>Intranet - Login</h2></Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handle}>
          <Form.Group className="mb-2"><Form.Label>RUT</Form.Label><Form.Control value={rut} onChange={e=>setRut(e.target.value)} required/></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Contraseña</Form.Label><Form.Control type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></Form.Group>
          <Button type="submit">Entrar</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
