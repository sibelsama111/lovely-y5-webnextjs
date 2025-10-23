import { Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

export default function AdminRegistro() {
  const [formData, setFormData] = useState({ rut:'', primernombre:'', segundonombre:'', apellidos:'', correo:'', direccion:'', afp:'', salud:'', password:'' });
  const [accessCode, setAccessCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { registerWorker } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accessCode !== 'LVLWRKR5') {
      setError('Código de acceso incorrecto.');
      return;
    }
    if (!agreed) {
      setError('Debes aceptar los términos laborales.');
      return;
    }
    setError('');
    try{
      registerWorker(formData, accessCode);
      alert('Registro de trabajador creado (simulado).');
      router.push('/admin');
    }catch(err){ setError(err.message); }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-2"><Form.Label>RUT</Form.Label><Form.Control value={formData.rut} onChange={e=>setFormData({...formData,rut:e.target.value})} required/></Form.Group>
      <Form.Group className="mb-2"><Form.Label>Primer Nombre</Form.Label><Form.Control value={formData.primernombre} onChange={e=>setFormData({...formData,primernombre:e.target.value})} required/></Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Código de Acceso</Form.Label>
        <Form.Control 
          type="text" 
          value={accessCode} 
          onChange={e => setAccessCode(e.target.value)}
          required
        />
      </Form.Group>
      
      <Form.Check 
        type="checkbox"
        label="Entiendo que mis datos se solicitan con fines exclusivamente laborales."
        checked={agreed}
        onChange={e => setAgreed(e.target.checked)}
        required
      />

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      
      <Button type="submit" className="mt-3">Registrar Trabajador</Button>
    </Form>
  );
}