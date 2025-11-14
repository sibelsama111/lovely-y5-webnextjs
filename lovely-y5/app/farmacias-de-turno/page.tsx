'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Farmacia = Record<string, any>

export default function FarmaciasTurnoPage() {
  const [items, setItems] = useState<Farmacia[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [comunaFilter, setComunaFilter] = useState('')
  const [timeFrom, setTimeFrom] = useState('')
  const [timeTo, setTimeTo] = useState('')
  
  const [userLocation, setUserLocation] = useState<{lat:number, lon:number} | null>(null)
  const [sortByDistance, setSortByDistance] = useState(false)

  const locateAndSort = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      alert('Geolocation no está disponible en este navegador')
      return
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      setUserLocation({lat, lon})
      setSortByDistance(true)
    }, (err) => {
      console.error('Error al obtener ubicación', err)
      alert('No se pudo obtener la ubicación')
    })
  }

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
        // texto (buscar en campos comunes y en nombre de región)
        if (q) {
          const textFields = [getName(it), getDireccion(it), getTelefono(it), getComuna(it), getLocalidad(it), getRegionCode(it) ? getRegionName(String(getRegionCode(it))) : '']
            .map(v => String(v || '').toLowerCase())
            .join(' ')
          if (!textFields.includes(q) && !JSON.stringify(it).toLowerCase().includes(q)) return false
        }
  // region filtering removed intentionally
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
        if (sortByDistance && userLocation) {
          const da = distanceBetween(userLocation, getCoords(a) || userLocation)
          const db = distanceBetween(userLocation, getCoords(b) || userLocation)
          return da - db
        }
        const na = (getName(a) || '').toLowerCase()
        const nb = (getName(b) || '').toLowerCase()
        return na.localeCompare(nb)
      })
  }, [items, query, comunaFilter, timeFrom, timeTo, sortByDistance, userLocation])

  return (
    <div className="container py-4">
      {/* Fixed small header: fecha/hora (top-left under navbar) - breadcrumb removed because UI already has a back button */}
      <div style={{position:'fixed', top:70, left:12, zIndex:1050}}>
        <div style={{background:'#fff', padding:'8px 12px', borderRadius:8, boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
          <div style={{fontSize:12, color:'#333', fontWeight:600}}>{formatNow()}</div>
        </div>
      </div>

      <h2 className="mb-4">Farmacias de turno</h2>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-md-3">
              <input className="form-control" placeholder="Buscar por nombre, dirección, teléfono, localidad..." value={query} onChange={(e)=>setQuery(e.target.value)} />
            </div>
            {/* region select removed */}
            <div className="col-md-2">
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
            <div className="col-md-2 d-flex justify-content-end gap-2">
              <button className="btn btn-outline-primary btn-sm" onClick={()=>locateAndSort()}>Cerca de mi</button>
              <button className="btn btn-outline-secondary btn-sm" onClick={()=>{ setQuery(''); setComunaFilter(''); setTimeFrom(''); setTimeTo(''); setSortByDistance(false); setUserLocation(null) }}>Limpiar</button>
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
          // Mostrar únicamente el campo local_direccion tal y como viene en el JSON
          const direccion = getLocalDireccion(f) || '—'
          const horarioRaw = getHorarioFromFields(f) || getHorarioString(f)
          const horarioDisplay = horarioRaw ? (getHorarioFromFields(f) ? horarioRaw : formatHorarioForDisplay(horarioRaw)) : '—'
          const telefono = getLocalTelefono(f) || (formatPhoneString(getTelefono(f)) || '—')
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
                  <div className="mb-1" style={{color:'#333'}}><strong>Horario:</strong> {horarioDisplay || '—'}</div>
                  <div className="mb-1" style={{color:'#333'}}><strong>Dirección:</strong> {direccion}</div>
                  <div className="mb-1" style={{color:'#6f6f6f'}}><strong>Localidad:</strong> {cleanText(getLocalidad(f)) || '—'}</div>
                  <div className="mb-1" style={{color:'#6f6f6f'}}><strong>Comuna:</strong> {comuna}</div>
                  <div className="mb-1" style={{color:'#6f6f6f'}}><strong>Región:</strong> {getRegionDisplay(f) || getRegionName(getRegionCode(f) || '') || '—'}</div>
                  <div className="mb-0" style={{color:'#333'}}><strong>Teléfono:</strong> {telefono}</div>
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
  return (item.local_nombre || item.localNombre || item.nombre || item.NOMBRE || item.nombre_local || item.nombre_fantasia || item.RAZON_SOCIAL || item.local || item.Nombre || item.nombreLocal)
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

function getHorarioFromFields(item: Farmacia) {
  if (!item) return null
  const a = item.funcionamiento_hora_apertura || item.hora_apertura || item.apertura || item.funcionamiento_inicio || item.hora_inicio
  const b = item.funcionamiento_hora_cierre || item.hora_cierre || item.cierre || item.funcionamiento_fin || item.hora_fin
  if (a && b) {
    // normalize to HH:MM if possible
    const pa = String(a).trim()
    const pb = String(b).trim()
    return `${pa} - ${pb}`
  }
  if (a) return String(a).trim()
  return null
}

function getLocalTelefono(item: Farmacia) {
  if (!item) return null
  // return local_telefono exactly if present
  if (item.local_telefono) return String(item.local_telefono)
  if (item.localTelefono) return String(item.localTelefono)
  if (item.telefono_local) return String(item.telefono_local)
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

// --- Región / ubicación / utilidades ---
function getLocalidad(item: Farmacia) {
  return (item.localidad || item.localidad_nombre || item.localidadNombre || item.localidad_local || item.localidadName)
}

function getLocalDireccion(item: Farmacia) {
  if (!item) return null
  // devolver exactamente el campo local_direccion si existe
  if (item.local_direccion) return String(item.local_direccion)
  if (item.localDireccion) return String(item.localDireccion)
  if (item.direccion_local) return String(item.direccion_local)
  return null
}

function getRegionCode(item: Farmacia) {
  // busca varias claves que puedan contener la región
  const v = item.region || item.fk_region || item.region_id || item.cod_region || item.codigo_region || item.REGION
  if (v == null) return null
  const s = String(v).trim()
  // si viene en formato roman like 'V' -> map later
  return s
}

function getRegionName(code: string | number | null) {
  if (code == null) return ''
  const c = String(code).trim()
  const map: Record<string,string> = {
    '1': 'I Región de Tarapacá',
    '2': 'II Región de Antofagasta',
    '3': 'III Región de Atacama',
    '4': 'IV Región de Coquimbo',
    '5': 'V Región de Valparaíso',
    '6': 'VI Región del Libertador General Bernardo O’Higgins',
    '7': 'VII Región del Maule',
    '8': 'VIII Región del Biobío',
    '9': 'IX Región de La Araucanía',
    '10': 'X Región de Los Lagos',
    '11': 'XI Región de Aysén del General Carlos Ibáñez del Campo',
    '12': 'XII Región de Magallanes y de la Antártica Chilena',
    '13': 'Región Metropolitana de Santiago',
    '14': 'XIV Región de Los Ríos',
    '15': 'XV Región de Arica y Parinacota',
    '16': 'XVI Región de Ñuble',
    'RM': 'Región Metropolitana de Santiago',
    'V': 'V Región de Valparaíso'
  }
  return map[c] || map[String(Number(c))] || ''
}

// Prefer the region display name as provided by the API when available.
// Tries several common keys that might contain the full region text.
function getRegionDisplay(item: Farmacia) {
  if (!item) return ''
  const candidates = [
    'region_nombre', 'region_nombre_completo', 'region_nombre_completo', 'regionName', 'region_nombre_local',
    'region_descripcion', 'region_desc', 'region_text', 'region', 'REGION', 'region_nombre_real'
  ]
  for (const k of candidates) {
    if (k in item && item[k] != null) {
      const v = String(item[k]).trim()
      if (v) return v
    }
  }
  // Sometimes API returns an object like { region: { nombre: '...' } }
  if (item.region && typeof item.region === 'object') {
    const r = (item.region.nombre || item.region.name || item.region.descripcion)
    if (r) return String(r).trim()
  }
  return ''
}

function getCoords(item: Farmacia): {lat:number, lon:number} | null {
  const latKeys = ['lat', 'latitude', 'latitud', 'y', 'posy']
  const lonKeys = ['lon', 'lng', 'longitude', 'longitud', 'x', 'posx']
  let lat:number|undefined, lon:number|undefined
  for (const k of latKeys) {
    if (k in item && item[k] != null) { lat = Number(String(item[k]).replace(',', '.')); break }
  }
  for (const k of lonKeys) {
    if (k in item && item[k] != null) { lon = Number(String(item[k]).replace(',', '.')); break }
  }
  if (typeof lat === 'number' && !Number.isNaN(lat) && typeof lon === 'number' && !Number.isNaN(lon)) return {lat, lon}
  // sometimes coordinates come as 'lat,lon' in a single field
  for (const k of Object.keys(item)) {
    const v = item[k]
    if (typeof v === 'string' && v.includes(',')) {
      const parts = v.split(',').map(p=>p.trim())
      if (parts.length === 2) {
        const a = Number(parts[0].replace(',', '.'))
        const b = Number(parts[1].replace(',', '.'))
        if (!Number.isNaN(a) && !Number.isNaN(b)) return {lat:a, lon:b}
      }
    }
  }
  return null
}

function distanceBetween(a:{lat:number, lon:number}, b:{lat:number, lon:number}) {
  const toRad = (v:number) => v * Math.PI / 180
  const R = 6371 // km
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const sinDLat = Math.sin(dLat/2)
  const sinDLon = Math.sin(dLon/2)
  const aa = sinDLat*sinDLat + Math.cos(lat1)*Math.cos(lat2)*sinDLon*sinDLon
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1-aa))
  return R * c
}
function formatNow() {
  const now = new Date()
  const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
  const dd = String(now.getDate()).padStart(2,'0')
  const mm = String(now.getMonth()+1).padStart(2,'0')
  const yyyy = now.getFullYear()
  const hh = String(now.getHours()).padStart(2,'0')
  const min = String(now.getMinutes()).padStart(2,'0')
  return `${days[now.getDay()]} ${dd}/${mm}/${yyyy} ${hh}:${min}`
}

// Breadcrumb compact removed: layout already provides navigation/back button