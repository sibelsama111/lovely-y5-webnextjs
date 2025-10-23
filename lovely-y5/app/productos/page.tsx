// app/productos/page.tsx
'use client'
import { useEffect, useState } from 'react'
import ProductCard from '../../components/ProductCard'
import ProductFilter from '../../components/ProductFilter'

export default function ProductosPage() {
  const [products, setProducts] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [marcas, setMarcas] = useState<string[]>([])
  const [tipos, setTipos] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(data => {
      setProducts(data)
      setFiltered(data.sort((a:any,b:any)=> a.precio - b.precio))
      setMarcas(Array.from(new Set(data.map((p:any)=>p.marca))))
      setTipos(Array.from(new Set(data.map((p:any)=>p.tipo))))
    })
  }, [])

  function handleFilter(change: any) {
    const next = { query: '', marca: '', tipo: '', minPrice: '', maxPrice: '', ...change }
    // Merge with current values by reading form fields? Simplificamos por re-filtrado básico:
    const q = (change.query ?? '').toLowerCase()
    let list = [...products]
    if (q) list = list.filter(p => p.nombre.toLowerCase().includes(q))
    if (change.marca) list = list.filter(p=> p.marca === change.marca)
    if (change.tipo) list = list.filter(p => p.tipo === change.tipo)
    if (change.minPrice) list = list.filter(p => p.precio >= Number(change.minPrice))
    if (change.maxPrice) list = list.filter(p => p.precio <= Number(change.maxPrice))
    setFiltered(list)
  }

  return (
    <div className="row">
      <div className="col-md-3">
        <ProductFilter marcas={marcas} tipos={tipos} onFilter={handleFilter} />
      </div>
      <div className="col-md-9">
        <div className="row g-3">
          {filtered.length === 0 && <div className="alert alert-info">No hay productos.</div>}
          {filtered.map(p => (
            <div key={p.id} className="col-md-4">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
