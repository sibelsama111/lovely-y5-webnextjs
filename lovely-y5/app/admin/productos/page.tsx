// app/admin/productos/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-hot-toast'

export default function AdminProductos() {
  const [products, setProducts] = useState<any[]>([])
  const [form, setForm] = useState<any>({ codigo: 'LVL5_', nombre: '', marca: '', tipo: '', precio: 0, imagenes: [], descripcion: '', detalles: '', fichaTecnica: '{}', stock: 0 })

  useEffect(()=> {
    fetch('/api/products').then(r=>r.json()).then(setProducts)
  }, [])

  const create = async (e: any) => {
    e.preventDefault()
    
    // Validaciones específicas detalladas
    if (!form.codigo.trim()) {
      toast.error('El código del producto es obligatorio')
      return
    }
    
    if (!form.codigo.startsWith('LVL5_')) {
      toast.error('El código debe comenzar con "LVL5_" (ej: LVL5_TELEFONO_001)')
      return
    }
    
    if (form.codigo.length < 8) {
      toast.error('El código debe tener al menos 8 caracteres')
      return
    }
    
    if (!form.nombre.trim()) {
      toast.error('El nombre del producto es obligatorio')
      return
    }
    
    if (form.nombre.trim().length < 3) {
      toast.error('El nombre del producto debe tener al menos 3 caracteres')
      return
    }
    
    if (!form.marca.trim()) {
      toast.error('La marca del producto es obligatoria')
      return
    }
    
    if (!form.tipo.trim()) {
      toast.error('El tipo/categoría del producto es obligatorio')
      return
    }
    
    if (!form.precio || isNaN(Number(form.precio)) || Number(form.precio) <= 0) {
      toast.error('El precio debe ser un número mayor a 0')
      return
    }
    
    if (isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      toast.error('El stock debe ser un número mayor o igual a 0')
      return
    }
    
    // Validar JSON de ficha técnica
    try {
      if (form.fichaTecnica.trim()) {
        JSON.parse(form.fichaTecnica)
      }
    } catch (jsonError) {
      toast.error('La ficha técnica debe ser un JSON válido (ej: {"ram":"8GB","color":"Negro"})')
      return
    }
    
    try {
      const fichaTecnica = form.fichaTecnica.trim() ? JSON.parse(form.fichaTecnica) : {}
      const p = { 
        id: uuidv4(), 
        ...form, 
        codigo: form.codigo.trim().toUpperCase(),
        nombre: form.nombre.trim(),
        marca: form.marca.trim(),
        tipo: form.tipo.trim(),
        precio: Number(form.precio), 
        stock: Number(form.stock), 
        imagenes: ['/logo.svg'], 
        fichaTecnica 
      }
      
      const response = await fetch('/api/products', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(p) 
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error HTTP ${response.status}`)
      }
      
      setProducts(prev => [p, ...prev])
      toast.success(`Producto "${p.nombre}" creado exitosamente`)
      setForm({ codigo: 'LVL5_', nombre: '', marca: '', tipo: '', precio: 0, imagenes: [], descripcion: '', detalles: '', fichaTecnica: '{}', stock: 0 })
    } catch (error: any) {
      console.error(error)
      if (error.message.includes('duplicate') || error.message.includes('exists')) {
        toast.error(`Ya existe un producto con el código "${form.codigo}"`)
      } else if (error.message.includes('network')) {
        toast.error('Error de conexión. Verifica tu conexión a internet')
      } else {
        toast.error(`Error al crear producto: ${error.message || 'Error desconocido'}`)
      }
    }
  }

  const remove = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${nombre}"?`)) {
      return
    }
    
    try {
      const response = await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      
      if (!response.ok) {
        throw new Error('Error al eliminar el producto')
      }
      
      setProducts(prev => prev.filter(p => p.id !== id))
      toast.success('Producto eliminado exitosamente')
    } catch (error) {
      console.error(error)
      toast.error('Error al eliminar el producto')
    }
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
              <button className="btn btn-sm btn-danger me-2" onClick={()=>remove(p.id, p.nombre)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
