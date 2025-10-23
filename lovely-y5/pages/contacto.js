import { Card, Form, Button } from 'react-bootstrap';

export default function Contacto(){
  const handleSubmit = (e)=>{
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target));
    try {
      const stored = JSON.parse(localStorage.getItem('lovely5_contacts') || '[]');
      stored.push({ ...form, createdAt: new Date().toISOString() });
      localStorage.setItem('lovely5_contacts', JSON.stringify(stored));
      alert('Formulario enviado (simulado) y guardado.');
      e.target.reset();
    } catch (err) { console.error(err); alert('Error al enviar.'); }
  }
  return (
    <Card>
      <Card.Header><h2>Contacto</h2></Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2"><Form.Label>Nombre</Form.Label><Form.Control required/></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Email</Form.Label><Form.Control type="email" required/></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Mensaje</Form.Label><Form.Control as="textarea" required/></Form.Group>
          <Button type="submit">Enviar</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
