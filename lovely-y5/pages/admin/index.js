import { Card } from 'react-bootstrap';

export default function AdminIndex(){
  return (
    <Card>
      <Card.Header><h2>Intranet - Dashboard</h2></Card.Header>
      <Card.Body>
        <p>Bienvenido al panel de administración. Aquí podrá ver pedidos recientes, gestionar productos y contactos.</p>
      </Card.Body>
    </Card>
  );
}
