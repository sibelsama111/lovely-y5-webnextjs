'use client'
import { useEffect, useMemo, useState } from 'react'

type Farmacia = Record<string, any>

export default function FarmaciasTurnoPage() {
  const [items, setItems] = useState<Farmacia[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [comunaFilter, setComunaFilter] = useState('')
  const [timeFrom, setTimeFrom] = useState('')
  const [timeTo, setTimeTo] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch('https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php')
      .then(r => r.json())
      .then(data => {
        if (!mounted) return
        // Normalizar: si retorna objeto, encontrar el primer array dentro
        let list: any[] = []
        if (Array.isArray(data)) list = data
        else if (data && typeof data === 'object') {
          const arr = Object.values(data).find(v => Array.isArray(v))
          if (Array.isArray(arr)) list = arr as any[]
          else list = []
        }
        // guardar
        setItems(list)
        setError(null)
      })
      .catch(e => {
        console.error(e)
        setError('No se pudo cargar la lista de farmacias de turno.')
      })
      .finally(() => setLoading(false))

    return () => { mounted = false }
  }, [])

  const comunas = useMemo(() => {
    const s = new Set<string>()
    items.forEach(it => {
      const c = getComuna(it)
      if (c) s.add(c)
    })
    return Array.from(s).sort((a,b)=>a.localeCompare(b))
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const from = parseTime(timeFrom)
    const to = parseTime(timeTo)

    return items
      .filter(it => {
        // texto
        if (q) {
          const text = JSON.stringify(it).toLowerCase()
          if (!text.includes(q)) return false
        }
        // comuna
        if (comunaFilter) {
          const c = (getComuna(it) || '').toLowerCase()
          if (c !== comunaFilter.toLowerCase()) return false
        }
        // horario (si existe y si se definieron from/to)
        const horario = getHorarioString(it)
        if ((from || to) && horario) {
          const times = extractTimes(horario)
          if (times.length === 0) return false
          // tomar primera par como opening-closing
          const t0 = parseTime(times[0])
          const t1 = times[1] ? parseTime(times[1]) : null
          if (from && t0 && t0 < from) return false
          if (to && t1 && t1 > to) return false
        }
        return true
      })
      .sort((a,b) => {
        const na = (getName(a) || '').toLowerCase()
        const nb = (getName(b) || '').toLowerCase()
        return na.localeCompare(nb)
      })
  }, [items, query, comunaFilter, timeFrom, timeTo])

  return (
    <div className="container py-4">
      <h2 className="mb-4">Farmacias de turno</h2>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <input className="form-control" placeholder="Buscar por nombre, dirección, teléfono..." value={query} onChange={(e)=>setQuery(e.target.value)} />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={comunaFilter} onChange={(e)=>setComunaFilter(e.target.value)}>
                <option value="">Todas las comunas</option>
                {comunas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <input type="time" className="form-control" value={timeFrom} onChange={e=>setTimeFrom(e.target.value)} />
            </div>
            <div className="col-md-2">
              <input type="time" className="form-control" value={timeTo} onChange={e=>setTimeTo(e.target.value)} />
            </div>
            <div className="col-md-1 text-end">
              <button className="btn btn-outline-secondary" onClick={()=>{ setQuery(''); setComunaFilter(''); setTimeFrom(''); setTimeTo('') }}>Limpiar</button>
            </div>
          </div>
        </div>
      </div>

      {loading && <div className="alert alert-info">Cargando farmacias de turno...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        {filtered.map((f, idx) => {
          const nombre = formatDisplayName(getName(f))
          const comuna = cleanText(getComuna(f)) || '—'
          const direccion = formatDisplayAddress(getDireccion(f)) || '—'
          const horarioRaw = getHorarioString(f)
          const horarioDisplay = formatHorarioForDisplay(horarioRaw)
          const telefono = formatPhoneString(getTelefono(f)) || '—'
          const openState = horarioRaw ? isOpenNow(horarioRaw) : null

          return (
            <div key={idx} className="col-md-6">
              <div className="card h-100">
                <div className="card-body text-center">
                  {/* icon / logo placeholder */}
                  <div style={{width:40, height:40, margin:'0 auto 8px', borderRadius:8, background:'#5b2e9a', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff'}}>
                    <span style={{fontSize:18}}>🏥</span>
                  </div>
                  <h5 className="card-title" style={{color:'#3b0b87', fontWeight:700}}>{nombre}</h5>
                  <div className="mb-1" style={{color:'#6f6f6f', textTransform:'uppercase'}}>{comuna}</div>
                  <div className="mb-1">
                    <div style={{textDecoration:'underline', textDecorationStyle:'dotted', color:'#3b0b87', fontWeight:600}}>{direccion}</div>
                  </div>
                  <div className="mb-1" style={{color:'#333'}}><strong>Horario hoy:</strong> {horarioDisplay || '—'}</div>
                  <div className="mb-3" style={{color:'#333'}}><strong>Teléfono:</strong> {telefono}</div>
                  <div>
                    <div className={"btn " + (openState ? 'btn-success' : openState === false ? 'btn-danger' : 'btn-secondary')} style={{width:'100%', borderRadius:20}}>
                      {openState === null ? 'Horario no disponible' : openState ? 'Farmacia abierta' : 'Cerrado'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {(!loading && filtered.length === 0) && (
          <div className="col-12">
            <div className="alert alert-warning">No se encontraron farmacias con los filtros aplicados.</div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helpers: heurísticos para leer campos comunes de la API
function getName(item: Farmacia) {
  return (item.nombre || item.NOMBRE || item.nombre_local || item.nombre_fantasia || item.RAZON_SOCIAL || item.local || item.Nombre || item.nombreLocal)
}

function getComuna(item: Farmacia) {
  return (item.comuna_nombre || item.comuna || item.COMUNA || item.nombre_comuna || item.comunaNombre)
}

function getDireccion(item: Farmacia) {
  return (item.direccion || item.DIRECCION || item.direccion_local || item.DOMICILIO || item.direccionLocal)
}

function getTelefono(item: Farmacia) {
  return (item.telefono || item.TELEFONO || item.telefono_local || item.telefonoContacto)
}

function getHorarioString(item: Farmacia) {
  // buscar propiedades que contengan 'horar' o 'turno' o 'atencion'
  const keys = Object.keys(item || {})
  for (const k of keys) {
    const lower = k.toLowerCase()
    if (lower.includes('horar') || lower.includes('turno') || lower.includes('atencion') || lower.includes('funcion')) {
      const v = item[k]
      if (typeof v === 'string' && v.trim()) return v
    }
  }
  // fallback: buscar cualquier string con ':' (hora)
  for (const k of keys) {
    const v = item[k]
    if (typeof v === 'string' && v.includes(':')) return v
  }
  return null
}

function extractTimes(horario: string): string[] {
  if (!horario) return []
  const re = /([01]?\d|2[0-3]):[0-5]\d/g
  const m = horario.match(re)
  return m || []
}

function parseTime(t: string | null | undefined) {
  if (!t) return null
  // t expected like 'HH:MM'
  const m = /^([0-1]?\d|2[0-3]):([0-5]\d)$/.exec(t)
  if (!m) return null
  const hh = Number(m[1])
  const mm = Number(m[2])
  return hh * 60 + mm
}

// --- Utilities for display and sanitization ---
function cleanText(v: any) {
  if (v == null) return ''
  let s = String(v)
  // replace non-breaking spaces and control chars
  s = s.replace(/\u00A0/g, ' ')
  s = s.replace(/[\u2000-\u200B\uFEFF]/g, '')
  // collapse multiple whitespace
  s = s.replace(/\s+/g, ' ').trim()
  return s
}

function formatDisplayName(v: any) {
  const s = cleanText(v)
  return s ? s.toUpperCase() : ''
}

function formatDisplayAddress(v: any) {
  const s = cleanText(v)
  return s ? s.toUpperCase() : ''
}

function formatPhoneString(v: any) {
  if (!v) return null
  let s = String(v)
  // try to extract digits
  const digits = s.replace(/\D+/g, '')
  if (!digits) return null
  if (digits.startsWith('56') && digits.length >= 10) return '+' + digits
  if (digits.length === 9) return '+56' + digits
  if (digits.length >= 8) return '+56' + digits
  // fallback: return cleaned original
  return s.trim()
}

function isOpenNow(horario: string) {
  if (!horario) return null
  const times = extractTimes(horario)
  if (!times || times.length === 0) return null
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  for (let i = 0; i < times.length; i += 2) {
    const t0 = parseTime(times[i])
    const t1 = times[i + 1] ? parseTime(times[i + 1]) : null
    if (t0 == null) continue
    if (t1 == null) {
      // only opening time provided - assume open from t0 onwards
      if (nowMinutes >= t0) return true
      continue
    }
    // handle overnight ranges where t1 < t0
    if (t1 >= t0) {
      if (nowMinutes >= t0 && nowMinutes <= t1) return true
    } else {
      // overnight: open if now >= t0 OR now <= t1
      if (nowMinutes >= t0 || nowMinutes <= t1) return true
    }
  }

  return false
}

function formatHorarioForDisplay(horario: string | null) {
  if (!horario) return null
  const times = extractTimes(horario)
  if (!times || times.length === 0) return cleanText(horario)
  const pairs: string[] = []
  for (let i = 0; i < times.length; i += 2) {
    const a = times[i]
    const b = times[i + 1]
    if (b) pairs.push(`${a} - ${b}`)
    else pairs.push(a)
  }
  return pairs.join(' / ')
}