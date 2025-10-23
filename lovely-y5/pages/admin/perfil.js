import { Card, ListGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

function calcularLiquido(base) {
  const afp = base * 0.11;
  const fonasa = base * 0.07;
  return base - afp - fonasa;
}

export default function AdminPerfil(){
  const { user } = useAuth();
  if (!user) return <p>Debes iniciar sesión.</p>;
  const sueldoBase = user.sueldo_base || 560000;
  return (
    <Card>
      <Card.Header><h2>Perfil</h2></Card.Header>
      <Card.Body>
        <Card.Title>{user.primernombre} {user.apellidos}</Card.Title>
        <ListGroup>
          <ListGroup.Item>RUT: {user.rut}</ListGroup.Item>
          <ListGroup.Item>Puesto: {user.puesto || 'Vendedor/a'}</ListGroup.Item>
          <ListGroup.Item>Sueldo base: ${sueldoBase.toLocaleString('es-CL')}</ListGroup.Item>
          <ListGroup.Item>Liquido aprox: ${calcularLiquido(sueldoBase).toLocaleString('es-CL')}</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
