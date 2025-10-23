import { useAuth } from '../context/AuthContext';
import { Card, ListGroup, Button, Form, Modal } from 'react-bootstrap';
import { useState } from 'react';

export default function Perfil(){
  const { user, updateProfile } = useAuth();
  const [show, setShow] = useState(false);
  const [addr, setAddr] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editValue, setEditValue] = useState('');

  if(!user) return <p>Debes iniciar sesión.</p>;

  const handleAddAddress = ()=>{
  const direcciones = user.direcciones ? [...user.direcciones, addr] : [addr];
  updateProfile({ direcciones });
    alert('Dirección añadida (simulado).');
    setAddr(''); setShow(false);
  };

  const handleSetDefault = (index) => {
    if (!user.direcciones || index < 0 || index >= user.direcciones.length) return;
    const arr = [...user.direcciones];
    const [item] = arr.splice(index,1);
    arr.unshift(item);
    updateProfile({ direcciones: arr });
    alert('Dirección marcada como predeterminada.');
  };

  const handleEditAddress = (index) => {
    setEditingIndex(index);
    setEditValue(user.direcciones[index] || '');
  };

  const handleSaveEdit = () => {
    if (editingIndex < 0) return;
    const arr = [...(user.direcciones||[])];
    arr[editingIndex] = editValue;
    updateProfile({ direcciones: arr });
    setEditingIndex(-1);
    setEditValue('');
    alert('Dirección actualizada.');
  };

  const handleDeleteAddress = (index) => {
    if (!confirm('Eliminar dirección?')) return;
    const arr = [...(user.direcciones||[])];
    arr.splice(index,1);
    updateProfile({ direcciones: arr });
    alert('Dirección eliminada.');
  };

  return (
    <Card>
      <Card.Header><h2>Perfil</h2></Card.Header>
      <Card.Body>
        <Card.Title>Hola, {user.primernombre}!</Card.Title>
        <ListGroup className="mb-3">
          <ListGroup.Item>Email: {user.correo}</ListGroup.Item>
          <ListGroup.Item>Teléfono: {user.telefono}</ListGroup.Item>
          <ListGroup.Item>Direcciones:
            <ul>
              {(user.direcciones||[]).map((d,i)=>(
                <li key={i} style={{marginBottom:8}}>
                  <strong>{i===0? '(Predeterminada) ' : ''}</strong>{d}
                  <div style={{display:'inline-block', marginLeft:12}}>
                    <Button size="sm" variant="outline-primary" onClick={()=>handleSetDefault(i)}>Marcar predet.</Button>{' '}
                    <Button size="sm" variant="outline-secondary" onClick={()=>handleEditAddress(i)}>Editar</Button>{' '}
                    <Button size="sm" variant="outline-danger" onClick={()=>handleDeleteAddress(i)}>Eliminar</Button>
                  </div>
                </li>
              ))}
            </ul>
          </ListGroup.Item>
        </ListGroup>

        <h4>Historial de pedidos</h4>
        {(user.pedidos||[]).length===0 ? <p>No tienes pedidos.</p> : (
          <ListGroup>
            {(user.pedidos||[]).map(p=> (
              <ListGroup.Item key={p.id}>{p.id} - ${p.total?.toLocaleString('es-CL')} - {p.status}</ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <Button className="mt-3" onClick={()=> setShow(true)}>Añadir dirección</Button>
        <Modal show={show} onHide={()=>setShow(false)}>
          <Modal.Header closeButton><Modal.Title>Añadir dirección</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group><Form.Label>Dirección</Form.Label><Form.Control value={addr} onChange={e=>setAddr(e.target.value)} /></Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>setShow(false)}>Cancelar</Button>
            <Button onClick={handleAddAddress}>Guardar</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={editingIndex>=0} onHide={()=>{setEditingIndex(-1); setEditValue('');}}>
          <Modal.Header closeButton><Modal.Title>Editar dirección</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group><Form.Label>Dirección</Form.Label><Form.Control value={editValue} onChange={e=>setEditValue(e.target.value)} /></Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={()=>{setEditingIndex(-1); setEditValue('');}}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Guardar</Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
}
