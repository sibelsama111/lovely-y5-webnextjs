import { Table, Card, Form, Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { sendMailClient } from '../../lib/mail';
import { orderStatusUpdateClient } from '../../lib/emailTemplates';

const STATUS = ['agendado','confirmado','cancelado','preparando','enviado','en transito','recibido','reembolsado'];

export default function AdminPedidos(){
  const [orders, setOrders] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('lovely5_orders')||'[]'); }catch{ return []; }
  });
  const [details, setDetails] = useState(null);

  const persist = (items)=>{ setOrders(items); localStorage.setItem('lovely5_orders', JSON.stringify(items)); };

  const updateStatus = async (id, status) => {
    const order = orders.find(o=>o.id===id);
    if (!order) return;
    // if moving to 'enviado' require courier + tracking
    if (status === 'enviado'){
      // show modal to collect courier + tracking
      setPendingSend({ id, status });
      return;
    }
    const updated = orders.map(o=> o.id===id? { ...o, status } : o);
    persist(updated);
    try{
      if (order?.shipping?.correo || order?.shipping?.email) {
        const to = order.shipping.correo || order.shipping.email;
        const mail = orderStatusUpdateClient(order, status);
        await sendMailClient({ to, subject: mail.subject, html: mail.html, text: mail.text });
      }
    }catch(err){ console.warn('Mail send failed', err); }
  };

  const [pendingSend, setPendingSend] = useState(null);
  const [courier, setCourier] = useState('');
  const [tracking, setTracking] = useState('');

  const confirmSend = async ()=>{
    if (!pendingSend) return;
    const { id, status } = pendingSend;
    const updated = orders.map(o=> o.id===id? { ...o, status, courier, tracking } : o);
    persist(updated);
    const order = updated.find(o=>o.id===id);
    try{
      if (order?.shipping?.correo || order?.shipping?.email) {
        const to = order.shipping.correo || order.shipping.email;
        const mail = orderStatusUpdateClient(order, status, { courier, tracking });
        await sendMailClient({ to, subject: mail.subject, html: mail.html, text: mail.text });
      }
    }catch(err){ console.warn('Mail send failed', err); }
    setPendingSend(null); setCourier(''); setTracking('');
  };

  return (
    <Card>
      <Card.Header><h2>Pedidos</h2></Card.Header>
      <Card.Body>
        <Table striped bordered hover>
          <thead><tr><th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {orders.length===0 && <tr><td colSpan={5}>No hay pedidos.</td></tr>}
            {orders.map(o=> (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.shipping?.nombre || 'Anon'}</td>
                <td>${o.total?.toLocaleString('es-CL')}</td>
                <td>{o.status}</td>
                <td style={{display:'flex', gap:8}}>
                  <Form.Select value={o.status} onChange={e=> updateStatus(o.id, e.target.value)} style={{width:200}}>
                    {STATUS.map(s=> <option key={s} value={s}>{s}</option>)}
                  </Form.Select>
                  <Button onClick={()=>setDetails(o)}>Ver</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

      <Modal show={!!details} onHide={()=>setDetails(null)} size="lg">
        <Modal.Header closeButton><Modal.Title>Detalle pedido</Modal.Title></Modal.Header>
        <Modal.Body>
          {details && (
            <div>
              <p><strong>ID:</strong> {details.id}</p>
              <p><strong>Estado:</strong> {details.status}</p>
              <p><strong>Cliente:</strong> {details.shipping?.nombre} - {details.shipping?.correo || details.shipping?.email}</p>
              <h5>Items</h5>
              <ul>
                {(details.items||[]).map((it,i)=> <li key={i}>{it.nombre} x{it.cantidad} - ${Number(it.precio).toLocaleString('es-CL')}</li>)}
              </ul>
              <p><strong>Total:</strong> ${Number(details.total).toLocaleString('es-CL')}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer><Button onClick={()=>setDetails(null)}>Cerrar</Button></Modal.Footer>
      </Modal>

      <Modal show={!!pendingSend} onHide={()=>setPendingSend(null)}>
        <Modal.Header closeButton><Modal.Title>Marcar como ENVIADO</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2"><Form.Label>Empresa de envío</Form.Label><Form.Control value={courier} onChange={e=>setCourier(e.target.value)} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Número de seguimiento</Form.Label><Form.Control value={tracking} onChange={e=>setTracking(e.target.value)} /></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setPendingSend(null)}>Cancelar</Button>
          <Button onClick={confirmSend}>Confirmar y notificar cliente</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}