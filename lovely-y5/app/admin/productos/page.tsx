// app/admin/productos/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function AdminProductos() {
  const [products, setProducts] = useState<any[]>([])
  const [form, setForm] = useState<any>({ codigo: 'LVL5_', nombre: '', marca: '', tipo: '', precio: 0, imagenes: [], descripcion: '', detalles: '', fichaTecnica: '{}', stock: 0 })

  useEffect(()=> {
    fetch('/api/products').then(r=>r.json()).then(setProducts)
  }, [])

  const create = async (e: any) => {
    e.preventDefault()
    if (!form.codigo.startsWith('LVL5_')) { alert('El código debe comenzar con LVL5_'); return }
    const p = { id: uuidv4(), ...form, precio: Number(form.precio), stock: Number(form.stock), imagenes: ['/svgs/logo.svg'], fichaTecnica: JSON.parse(form.fichaTecnica || '{}') }
    await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) })
    setProducts(prev => [p, ...prev])
    alert('Producto creado (demo)')
    setForm({ codigo: 'LVL5_', nombre: '', marca: '', tipo: '', precio: 0, imagenes: [], descripcion: '', detalles: '', fichaTecnica: '{}', stock: 0 })
  }

  const remove = async (id: string) => {
    await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div>
      <h3>Productos (Intranet)</h3>
      <div className="card p-3 mb-3">
        <h5>Crear producto</h5>
        <form onSubmit={create}>
          <div className="row">
            <div className="col-md-4 mb-2"><input className="form-control" placeholder="Código (LVL5_...)" value={form.codigo} onChange={e=>setForm({...form, codigo: e.target.value})} /></div>
            <div className="col-md-4 mb-2"><input className="form-control" placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form, nombre: e.target.value})} /></div>
            <div className="col-md-4 mb-2"><input className="form-control" placeholder="Marca" value={form.marca} onChange={e=>setForm({...form, marca: e.target.value})} /></div>
            <div className="col-md-3 mb-2"><input className="form-control" placeholder="Tipo" value={form.tipo} onChange={e=>setForm({...form, tipo: e.target.value})} /></div>
            <div className="col-md-3 mb-2"><input className="form-control" placeholder="Precio" type="number" value={form.precio} onChange={e=>setForm({...form, precio: e.target.value})} /></div>
            <div className="col-md-3 mb-2"><input className="form-control" placeholder="Stock" type="number" value={form.stock} onChange={e=>setForm({...form, stock: e.target.value})} /></div>
            <div className="col-12 mb-2"><input className="form-control" placeholder="Descripción" value={form.descripcion} onChange={e=>setForm({...form, descripcion: e.target.value})} /></div>
            <div className="col-12 mb-2"><input className="form-control" placeholder="Detalles" value={form.detalles} onChange={e=>setForm({...form, detalles: e.target.value})} /></div>
            <div className="col-12 mb-2"><textarea className="form-control" placeholder='Ficha técnica JSON (ej: {"ram":"6GB"})' value={form.fichaTecnica} onChange={e=>setForm({...form, fichaTecnica: e.target.value})} /></div>
            <div className="col-12"><button className="btn btn-success">Crear producto</button></div>
          </div>
        </form>
      </div>

      <div>
        {products.map(p => (
          <div key={p.id} className="border p-2 mb-2 d-flex justify-content-between align-items-center">
            <div>
              <strong>{p.nombre}</strong> <div className="text-muted">{p.codigo} • {p.marca}</div>
            </div>
            <div>
              <button className="btn btn-sm btn-danger me-2" onClick={()=>remove(p.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
