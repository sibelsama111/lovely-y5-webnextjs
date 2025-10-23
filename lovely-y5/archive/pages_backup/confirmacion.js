"use client";
import { useRouter } from 'next/router';
import { Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

export default function Confirmacion(){
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const order = user && user.pedidos ? user.pedidos.find(p=>p.id===id) : null;

  return (
    <Card>
      <Card.Header><h2>Confirmación de Pedido</h2></Card.Header>
      <Card.Body>
        <p>Pedido ID: <strong>{id}</strong></p>
        {order ? (
          <div>
            <p>Total: ${order.total?.toLocaleString('es-CL')}</p>
            <p>Estado: {order.status}</p>
          </div>
        ) : (
          <p>Tu pedido ha sido registrado (simulado). Revisa tu historial de pedidos en Perfil.</p>
        )}
      </Card.Body>
    </Card>
  );
}
