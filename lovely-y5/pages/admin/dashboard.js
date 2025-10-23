import { Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard(){
  const { user } = useAuth();
  return (
    <Card>
      <Card.Header><h2>Dashboard</h2></Card.Header>
      <Card.Body>
        <p>Bienvenido{user? `, ${user.primernombre}`: ''} al panel de IntraLove.</p>
        <p>Aquí encontrarás un resumen de pedidos, productos y contactos (mock).</p>
      </Card.Body>
    </Card>
  );
}
