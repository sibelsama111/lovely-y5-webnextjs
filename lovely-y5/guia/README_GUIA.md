# Guías de Desarrollo - Lovely Y5 Tienda Web

Esta carpeta contiene toda la documentación y guías del proyecto. Puedes descargar estos archivos para referencia y después eliminar la carpeta completa para mantener tu código limpio.

## 📁 Archivos Incluidos

### 1. `FIRESTORE_SECURITY_RULES.md`
**Reglas de Seguridad de Firebase Firestore**
- Documentación completa de las reglas de seguridad implementadas
- Explicación de roles y permisos por colección
- Funciones de utilidad y validaciones
- Específico para tienda web (sin farmacias)

### 2. `FIRESTORE_SETUP_GUIDE.md` 
**Guía de Configuración de Firebase**
- Pasos para configurar Firebase Console
- Instrucciones para crear colecciones manualmente
- Configuración de variables de entorno
- Comandos útiles para desarrollo

### 3. `DATABASE_STRUCTURE.md`
**Estructura Completa de la Base de Datos**
- Esquema detallado de todas las colecciones
- Ejemplos de documentos JSON
- Sistema de roles explicado
- Comandos de desarrollo
- Enfoque exclusivo en tienda web

### 4. `DEV_CONFIG.md`
**Configuración de Desarrollo**
- Setup para emuladores de Firebase
- Variables de entorno para desarrollo
- URLs y puertos de desarrollo
- Ventajas del modo desarrollo

### 5. `DATABASE_READY.md`
**Estado Actual de la Base de Datos**
- Resumen del progreso de configuración
- Estado de implementación de Firebase
- Próximos pasos y recomendaciones

### 6. `README_GUIA.md` (este archivo)
**Índice de documentación**

## 🎯 Uso Recomendado

1. **Descarga** todos estos archivos para tu referencia personal
2. **Consulta** la documentación según necesites durante el desarrollo
3. **Elimina** la carpeta `guia/` completa del proyecto para mantenerlo limpio

## 🚀 Comandos Importantes

```bash
# Desplegar reglas de seguridad
firebase deploy --only firestore:rules

# Desplegar índices
firebase deploy --only firestore:indexes

# Iniciar emuladores para desarrollo
firebase emulators:start --only firestore

# Probar conexión a Firebase
npm run firestore:test
```

## 📞 Soporte

Esta documentación cubre todos los aspectos técnicos del proyecto. Si necesitas hacer cambios o tienes dudas, consulta los archivos correspondientes.

---
**Proyecto:** Lovely Y5 - Tienda Web de Tecnología Apple Reacondicionada  
**Fecha:** Noviembre 2025