// components/ProductFilter.tsx
'use client'
import React from 'react'

export default function ProductFilter({ marcas, tipos, onFilter }: any) {
  // onFilter = ({query, marca, tipo, minPrice, maxPrice, sort})
  return (
    <div className="card p-3 mb-3">
      <h6>Filtros</h6>
      <div className="mb-2">
        <input placeholder="Buscar por nombre..." className="form-control" onChange={(e) => onFilter({ query: e.target.value })} />
      </div>
      <div className="row">
        <div className="col"><select className="form-select" onChange={(e) => onFilter({ marca: e.target.value })}>
          <option value="">Todas las marcas</option>
          {marcas.map((m: string) => <option key={m} value={m}>{m}</option>)}
        </select></div>
        <div className="col"><select className="form-select" onChange={(e) => onFilter({ tipo: e.target.value })}>
          <option value="">Todos los tipos</option>
          {tipos.map((t: string) => <option key={t} value={t}>{t}</option>)}
        </select></div>
      </div>
      <div className="row mt-2">
        <div className="col"><input type="number" placeholder="Precio min" className="form-control" onChange={e => onFilter({ minPrice: e.target.value })} /></div>
        <div className="col"><input type="number" placeholder="Precio max" className="form-control" onChange={e => onFilter({ maxPrice: e.target.value })} /></div>
      </div>
    </div>
  )
}
