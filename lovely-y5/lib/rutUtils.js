// lib/rutUtils.js
// Utilidades para manejo de RUT chileno como UID universal

/**
 * Limpia el RUT removiendo puntos, guiones y espacios
 * @param {string} rut - RUT con formato (12.345.678-9)
 * @returns {string} RUT sin formato (123456789)
 */
export function limpiarRUT(rut) {
  if (!rut) return '';
  return rut.toString().replace(/[^0-9kK]/g, '').toLowerCase();
}

/**
 * Formatea el RUT agregando puntos y guión
 * @param {string} rut - RUT sin formato (123456789)
 * @returns {string} RUT formateado (12.345.678-9)
 */
export function formatearRUT(rut) {
  const rutLimpio = limpiarRUT(rut);
  
  if (rutLimpio.length < 8) return rut;
  
  const dv = rutLimpio.slice(-1);
  const numero = rutLimpio.slice(0, -1);
  
  // Agregar puntos cada 3 dígitos desde la derecha
  const numeroFormateado = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${numeroFormateado}-${dv}`;
}

/**
 * Valida el dígito verificador de un RUT chileno
 * @param {string} rut - RUT completo (123456789 o 12345678-9)
 * @returns {boolean} true si es válido
 */
export function validarRUT(rut) {
  const rutLimpio = limpiarRUT(rut);
  
  if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;
  
  const dv = rutLimpio.slice(-1);
  const numero = rutLimpio.slice(0, -1);
  
  // Calcular dígito verificador
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = numero.length - 1; i >= 0; i--) {
    suma += parseInt(numero[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const dvCalculado = 11 - (suma % 11);
  const dvFinal = dvCalculado === 11 ? '0' : 
                  dvCalculado === 10 ? 'k' : 
                  dvCalculado.toString();
  
  return dv === dvFinal;
}

/**
 * Convierte RUT formateado a UID para usar en Firebase
 * @param {string} rut - RUT con o sin formato
 * @returns {string} UID limpio para usar como ID de documento
 */
export function rutAUID(rut) {
  return limpiarRUT(rut);
}

/**
 * Convierte UID de Firebase de vuelta a RUT formateado
 * @param {string} uid - UID de Firebase (RUT sin formato)
 * @returns {string} RUT formateado
 */
export function uidARUT(uid) {
  return formatearRUT(uid);
}

/**
 * Valida formato de RUT y retorna versión limpia si es válido
 * @param {string} rut - RUT a validar
 * @returns {Object} {esValido: boolean, rutLimpio: string, rutFormateado: string}
 */
export function procesarRUT(rut) {
  const rutLimpio = limpiarRUT(rut);
  const esValido = validarRUT(rutLimpio);
  const rutFormateado = esValido ? formatearRUT(rutLimpio) : '';
  
  return {
    esValido,
    rutLimpio: esValido ? rutLimpio : '',
    rutFormateado
  };
}

/**
 * Genera un RUT de prueba válido (solo para testing)
 * @param {number} base - Número base para generar RUT
 * @returns {string} RUT válido formateado
 */
export function generarRUTPrueba(base = 12345678) {
  const numero = base.toString();
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = numero.length - 1; i >= 0; i--) {
    suma += parseInt(numero[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const dvCalculado = 11 - (suma % 11);
  const dv = dvCalculado === 11 ? '0' : 
             dvCalculado === 10 ? 'K' : 
             dvCalculado.toString();
  
  return formatearRUT(numero + dv);
}

// Ejemplos de uso:
/*
import { limpiarRUT, formatearRUT, validarRUT, rutAUID, uidARUT, procesarRUT } from '@/lib/rutUtils';

// Limpiar RUT para usar como UID
const uid = rutAUID('12.345.678-9'); // '123456789'

// Formatear UID de vuelta a RUT
const rutFormateado = uidARUT('123456789'); // '12.345.678-9'

// Validar RUT
const esValido = validarRUT('12.345.678-9'); // true o false

// Procesar RUT completo
const resultado = procesarRUT('12345678-9');
console.log(resultado);
// {
//   esValido: true,
//   rutLimpio: '123456789',
//   rutFormateado: '12.345.678-9'
// }
*/