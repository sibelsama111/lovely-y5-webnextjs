import { Card, Button, Table, Modal, Form, Image } from 'react-bootstrap';
import { useState } from 'react';

function generateCode() {
  return 'LVL5_' + Math.random().toString(36).substring(2,10).toUpperCase();
}

function makeId() {
  return 'p_' + Date.now().toString(36) + Math.random().toString(36).substring(2,6);
}

export default function AdminProductos(){
  const [products, setProducts] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('lovely5_products')||'[]'); }catch{ return []; }
  });
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre:'', precio:0, imagen:'', descripcion:'', detalles:'', stock:0 });

  const openNew = ()=>{ setForm({ nombre:'', precio:0, imagen:'', descripcion:'', detalles:'', stock:0 }); setEditing(null); setShow(true); };

  const save = ()=>{
    const items = products.slice();
    if (!form.nombre || form.nombre.trim()==='') { alert('Nombre requerido'); return; }
    // ensure numeric fields
    const safe = { ...form, precio: Number(form.precio) || 0, stock: Number(form.stock) || 0 };
    if (editing) {
      const idx = items.findIndex(p=>p.id===editing.id);
      if (idx!==-1) items[idx] = { ...items[idx], ...safe };
    } else {
      const id = makeId();
      const codigo = generateCode();
      items.push({ id, codigo, ...safe });
    }
    setProducts(items);
    localStorage.setItem('lovely5_products', JSON.stringify(items));
    setShow(false); setEditing(null);
  };

  const remove = (id)=>{ if (!confirm('Borrar producto?')) return; const filtered = products.filter(p=>p.id!==id); setProducts(filtered); localStorage.setItem('lovely5_products', JSON.stringify(filtered)); };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center"><h2>Productos</h2><Button onClick={openNew}>Añadir Producto</Button></Card.Header>
      <Card.Body>
        <Table striped bordered hover>
          <thead><tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
          <tbody>
            {products.length===0 && <tr><td colSpan={5}>No hay productos.</td></tr>}
            {products.map(p=> (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    {p.imagen && <Image src={p.imagen} alt={p.nombre} width={48} height={48} rounded />}
                    <div>{p.nombre}</div>
                  </div>
                </td>
                <td>${Number(p.precio).toLocaleString('es-CL')}</td>
                <td>{p.stock}</td>
                <td>
                  <Button size="sm" onClick={()=>{ setEditing(p); setForm({ nombre:p.nombre, precio:p.precio, imagen:p.imagen||'', descripcion:p.descripcion||'', detalles:p.detalles||'', stock:p.stock||0 }); setShow(true); }}>Editar</Button>{' '}
                  <Button size="sm" variant="danger" onClick={()=>remove(p.id)}>Borrar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

      <Modal show={show} onHide={()=>{ setShow(false); setEditing(null); }}>
        <Modal.Header closeButton><Modal.Title>{editing? 'Editar' : 'Añadir'} Producto</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2"><Form.Label>Nombre</Form.Label><Form.Control value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Precio</Form.Label><Form.Control type="number" value={form.precio} onChange={e=>setForm({...form,precio:e.target.value})} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Imagen (URL)</Form.Label><Form.Control value={form.imagen} onChange={e=>setForm({...form,imagen:e.target.value})} /></Form.Group>
            {form.imagen && <div style={{marginBottom:8}}><Image src={form.imagen} alt="preview" width={120} height={80} /></div>}
            <Form.Group className="mb-2"><Form.Label>Stock</Form.Label><Form.Control type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Descripción</Form.Label><Form.Control as="textarea" value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Detalles</Form.Label><Form.Control value={form.detalles} onChange={e=>setForm({...form,detalles:e.target.value})} /></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{ setShow(false); setEditing(null); }}>Cancelar</Button>
          <Button onClick={save}>{editing? 'Guardar' : 'Crear'}</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}
