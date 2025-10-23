import { Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { useState } from 'react';
import { sendMailClient } from '../../lib/mail';

export default function AdminContactos(){
  const [contacts, setContacts] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('lovely5_contacts')||'[]'); }catch{ return []; }
  });
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const openReply = (c, idx)=>{ setReplyTo({ ...c, idx }); setReplyText(`Hola ${c.Nombre||c.nombre||''},\n\nGracias por contactarnos...\n`); };

  const doReply = async ()=>{
    if (!replyTo) return;
      const to = replyTo.Email || replyTo.email || replyTo.correo;
    try{
      await sendMailClient({ to, subject: 'Respuesta a tu mensaje en Lovely Y5', text: replyText });
      const arr = contacts.slice(); arr[replyTo.idx] = { ...arr[replyTo.idx], replied: true, replyAt: Date.now(), replyText };
      setContacts(arr); localStorage.setItem('lovely5_contacts', JSON.stringify(arr));
      setReplyTo(null); setReplyText('');
      alert('Respuesta enviada (simulado si no hay credenciales).');
    }catch(err){ alert('Error enviando: '+err.message); }
  };

  return (
    <Card>
      <Card.Header><h2>Contactos enviados</h2></Card.Header>
      <Card.Body>
        <Table striped bordered hover>
          <thead><tr><th>Fecha</th><th>Nombre</th><th>Email</th><th>Mensaje</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {contacts.length===0 && <tr><td colSpan={6}>No hay mensajes.</td></tr>}
            {contacts.map((c,i)=> (
              <tr key={i}>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
                <td>{c.Nombre || c.nombre || 'Anon'}</td>
                <td>{c.Email || c.email || c.correo}</td>
                <td style={{maxWidth:300, whiteSpace:'pre-wrap'}}>{c.Mensaje || c.mensaje || c.mensaje}</td>
                <td>{c.replied? 'Respondido' : 'Pendiente'}</td>
                <td>
                  <Button size="sm" onClick={()=>openReply(c,i)}>Responder</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

      <Modal show={!!replyTo} onHide={()=>setReplyTo(null)}>
        <Modal.Header closeButton><Modal.Title>Responder mensaje</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2"><Form.Label>Para</Form.Label><Form.Control readOnly value={replyTo? (replyTo.Email||replyTo.email||replyTo.correo) : ''} /></Form.Group>
            <Form.Group><Form.Label>Mensaje</Form.Label><Form.Control as="textarea" rows={6} value={replyText} onChange={e=>setReplyText(e.target.value)} /></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setReplyTo(null)}>Cancelar</Button>
          <Button onClick={doReply}>Enviar</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}
