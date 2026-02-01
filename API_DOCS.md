# 📚 DOCUMENTACIÓN DE APIs - BEAUTY BI PLATFORM

Esta documentación detalla todas las funciones disponibles en los servicios del sistema.

---

## 🗄️ SUPABASE SERVICE (`src/services/supabase.js`)

### `getSucursales()`

Obtiene todas las sucursales registradas.

**Retorna:**
```javascript
{
  data: [
    {
      id: "uuid",
      nombre: "Las Condes",
      comision_porcentaje: 2.00,
      created_at: "2026-01-31T00:00:00Z",
      updated_at: "2026-01-31T00:00:00Z"
    }
  ],
  error: null
}
```

**Uso:**
```javascript
const { data, error } = await getSucursales()
if (data) {
  console.log('Sucursales:', data)
}
```

---

### `getProfesionales()`

Obtiene todos los profesionales con sus sucursales.

**Retorna:**
```javascript
{
  data: [
    {
      id: "uuid",
      nombre: "María González",
      sucursal_id: "uuid",
      sucursal: {
        id: "uuid",
        nombre: "Las Condes",
        comision_porcentaje: 2.00
      }
    }
  ],
  error: null
}
```

---

### `upsertProfesional(nombre, sucursalId)`

Crea o encuentra un profesional existente.

**Parámetros:**
- `nombre` (string): Nombre completo del profesional
- `sucursalId` (string): UUID de la sucursal

**Retorna:**
```javascript
{
  data: {
    id: "uuid",
    nombre: "María González",
    sucursal_id: "uuid"
  },
  error: null
}
```

**Uso:**
```javascript
const { data, error } = await upsertProfesional(
  "María González",
  "sucursal-uuid-here"
)
```

---

### `createReporteMensual(reporteData)`

Crea un nuevo reporte mensual.

**Parámetros:**
```javascript
{
  profesional_id: "uuid",
  fecha_reporte: "2026-01-31",
  total_venta_bruta: 125000,
  comision_porcentaje: 2.00,
  pago_neto: 122500,
  imagen_url: "https://...",
  estado: "procesado"
}
```

**Retorna:**
```javascript
{
  data: { /* reporte creado con id */ },
  error: null
}
```

---

### `createServiciosReporte(servicios)`

Crea múltiples servicios asociados a un reporte.

**Parámetros:**
```javascript
[
  {
    reporte_id: "uuid",
    nombre_servicio: "Masaje Relajante",
    cantidad: 5,
    precio_unitario: 25000,
    subtotal: 125000
  }
]
```

---

### `getReportes(fechaReporte = null)`

Obtiene reportes con todas sus relaciones.

**Parámetros:**
- `fechaReporte` (string, opcional): Fecha en formato "YYYY-MM-DD"

**Retorna:**
```javascript
{
  data: [
    {
      id: "uuid",
      total_venta_bruta: 125000,
      comision_porcentaje: 2.00,
      pago_neto: 122500,
      fecha_reporte: "2026-01-31",
      profesional: {
        nombre: "María González",
        sucursal: {
          nombre: "Las Condes"
        }
      },
      servicios: [
        {
          nombre_servicio: "Masaje",
          cantidad: 5,
          subtotal: 125000
        }
      ]
    }
  ],
  error: null
}
```

**Uso:**
```javascript
// Todos los reportes
const { data } = await getReportes()

// Reportes de una fecha específica
const { data } = await getReportes("2026-01-31")
```

---

### `deleteReporte(reporteId)`

Elimina un reporte (CASCADE: también elimina servicios asociados).

**Parámetros:**
- `reporteId` (string): UUID del reporte

**Retorna:**
```javascript
{ error: null }
```

**Uso:**
```javascript
const { error } = await deleteReporte("reporte-uuid")
if (!error) {
  console.log('Reporte eliminado correctamente')
}
```

---

### `uploadImage(file, fileName)`

Sube una imagen al bucket de Supabase Storage.

**Parámetros:**
- `file` (File): Objeto File de JavaScript
- `fileName` (string): Nombre del archivo

**Retorna:**
```javascript
{
  url: "https://xxxxx.supabase.co/storage/v1/object/public/reportes-imagenes/xxx.jpg",
  error: null
}
```

---

### `getEstadisticas(fechaReporte)`

Obtiene datos para cálculos estadísticos.

**Parámetros:**
- `fechaReporte` (string): Fecha en formato "YYYY-MM-DD"

**Retorna:** Array con reportes y sus relaciones completas.

---

## 🤖 GEMINI SERVICE (`src/services/gemini.js`)

### `extractDataFromImage(imageFile)`

Extrae datos estructurados de una imagen de reporte usando Gemini AI.

**Parámetros:**
- `imageFile` (File): Objeto File con la imagen

**Retorna:**
```javascript
{
  success: true,
  data: {
    nombre_profesional: "María González",
    servicios: [
      {
        nombre: "Masaje Relajante",
        cantidad: 5,
        precio_unitario: 25000,
        subtotal: 125000
      }
    ],
    total_venta: 125000,
    fecha_reporte: "2026-01-31",
    notas: null
  },
  error: null
}
```

**Uso:**
```javascript
const file = e.target.files[0]
const result = await extractDataFromImage(file)

if (result.success) {
  console.log('Profesional:', result.data.nombre_profesional)
  console.log('Total venta:', result.data.total_venta)
}
```

---

### `extractDataFromMultipleImages(imageFiles, onProgress)`

Procesa múltiples imágenes con callback de progreso.

**Parámetros:**
- `imageFiles` (Array<File>): Array de objetos File
- `onProgress` (Function, opcional): Callback con info de progreso

**Callback onProgress:**
```javascript
{
  current: 3,        // Imagen actual
  total: 10,         // Total de imágenes
  fileName: "img.jpg" // Nombre del archivo actual
}
```

**Retorna:**
```javascript
{
  results: [
    {
      fileName: "img1.jpg",
      file: File,
      success: true,
      data: { /* datos extraídos */ },
      error: null
    }
  ],
  summary: {
    total: 10,
    success: 8,
    failed: 2
  }
}
```

**Uso:**
```javascript
const files = Array.from(e.target.files)

const result = await extractDataFromMultipleImages(
  files,
  (progress) => {
    console.log(`Procesando ${progress.current}/${progress.total}: ${progress.fileName}`)
  }
)

console.log(`Exitosos: ${result.summary.success}`)
console.log(`Fallidos: ${result.summary.failed}`)
```

---

### `validateImageFile(file)`

Valida que un archivo sea procesable.

**Parámetros:**
- `file` (File): Archivo a validar

**Retorna:**
```javascript
{
  valid: true,
  error: null
}
// O
{
  valid: false,
  error: "Formato de imagen no válido. Use JPG, PNG o WEBP."
}
```

**Uso:**
```javascript
const validation = validateImageFile(file)
if (!validation.valid) {
  alert(validation.error)
  return
}
```

---

## 💾 REPORT GENERATOR SERVICE (`src/services/reportGenerator.js`)

### `generateReporteTXT(reporte)`

Genera un Blob de archivo TXT para un reporte individual.

**Parámetros:**
```javascript
{
  profesional: {
    nombre: "María González",
    sucursal: {
      nombre: "Las Condes"
    }
  },
  total_venta_bruta: 125000,
  comision_porcentaje: 2.00,
  pago_neto: 122500,
  servicios: [
    {
      nombre_servicio: "Masaje",
      cantidad: 5,
      precio_unitario: 25000,
      subtotal: 125000
    }
  ],
  fecha_reporte: "2026-01-31"
}
```

**Retorna:** `Blob` con contenido de texto

---

### `downloadReporteTXT(reporte)`

Genera y descarga automáticamente el archivo TXT.

**Parámetros:**
- `reporte` (Object): Objeto del reporte completo

**Uso:**
```javascript
const reporte = {
  profesional: { nombre: "María" },
  total_venta_bruta: 125000,
  // ... resto de datos
}

downloadReporteTXT(reporte)
// Se descarga: reporte_maria_gonzalez_2026-01-31.txt
```

---

### `downloadMultipleReportesTXT(reportes)`

Descarga múltiples archivos TXT (con delay entre descargas).

**Parámetros:**
- `reportes` (Array): Array de objetos de reportes

**Uso:**
```javascript
const reportes = [reporte1, reporte2, reporte3]
downloadMultipleReportesTXT(reportes)
// Se descargan 3 archivos con 300ms de delay entre cada uno
```

---

### `generateReporteConsolidadoTXT(reportes, fechaReporte)`

Genera un Blob con el reporte consolidado de todos los profesionales.

**Parámetros:**
- `reportes` (Array): Array de reportes
- `fechaReporte` (string): Fecha en formato "YYYY-MM-DD"

**Retorna:** `Blob` con el reporte consolidado

---

### `downloadReporteConsolidado(reportes, fechaReporte)`

Genera y descarga el reporte consolidado.

**Parámetros:**
- `reportes` (Array): Array de reportes
- `fechaReporte` (string): Fecha en formato "YYYY-MM-DD"

**Uso:**
```javascript
const reportes = await getReportes("2026-01-31")
downloadReporteConsolidado(reportes.data, "2026-01-31")
// Se descarga: reporte_consolidado_2026-01-31.txt
```

---

## 🔄 FLUJO COMPLETO DE PROCESAMIENTO

### Ejemplo: Carga y Procesamiento de un Reporte

```javascript
import { 
  extractDataFromImage, 
  validateImageFile 
} from './services/gemini'

import { 
  getSucursales, 
  upsertProfesional, 
  createReporteMensual, 
  createServiciosReporte,
  uploadImage
} from './services/supabase'

const procesarReporte = async (file, sucursalId, fechaReporte) => {
  // 1. Validar archivo
  const validation = validateImageFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // 2. Extraer datos con IA
  const extraction = await extractDataFromImage(file)
  if (!extraction.success) {
    throw new Error(extraction.error)
  }

  const { nombre_profesional, servicios, total_venta } = extraction.data

  // 3. Subir imagen
  const { url: imageUrl } = await uploadImage(file, file.name)

  // 4. Crear/obtener profesional
  const { data: profesional } = await upsertProfesional(
    nombre_profesional,
    sucursalId
  )

  // 5. Obtener comisión de sucursal
  const { data: sucursales } = await getSucursales()
  const sucursal = sucursales.find(s => s.id === sucursalId)
  const comisionPorcentaje = sucursal.comision_porcentaje

  // 6. Calcular pago neto
  const pagoNeto = total_venta - (total_venta * (comisionPorcentaje / 100))

  // 7. Crear reporte
  const { data: reporte } = await createReporteMensual({
    profesional_id: profesional.id,
    fecha_reporte: fechaReporte,
    total_venta_bruta: total_venta,
    comision_porcentaje: comisionPorcentaje,
    pago_neto: pagoNeto,
    imagen_url: imageUrl,
    estado: 'procesado'
  })

  // 8. Crear servicios
  const serviciosData = servicios.map(s => ({
    reporte_id: reporte.id,
    nombre_servicio: s.nombre,
    cantidad: s.cantidad,
    precio_unitario: s.precio_unitario,
    subtotal: s.subtotal
  }))

  await createServiciosReporte(serviciosData)

  return {
    success: true,
    reporte,
    profesional: nombre_profesional,
    total: total_venta
  }
}
```

---

## 🎯 EJEMPLOS DE USO EN COMPONENTES

### Cargar Dashboard

```javascript
import { getReportes, getEstadisticas } from '../services/supabase'

const Dashboard = () => {
  const [stats, setStats] = useState({})

  useEffect(() => {
    const cargarDatos = async () => {
      const fechaActual = "2026-01-31"
      const { data } = await getReportes(fechaActual)
      
      // Calcular estadísticas
      const totalVentas = data.reduce((sum, r) => sum + r.total_venta_bruta, 0)
      const totalPagos = data.reduce((sum, r) => sum + r.pago_neto, 0)
      
      setStats({ totalVentas, totalPagos })
    }
    
    cargarDatos()
  }, [])

  return (
    <div>
      <h1>Total Ventas: ${stats.totalVentas}</h1>
    </div>
  )
}
```

---

### Eliminar Reporte

```javascript
import { deleteReporte } from '../services/supabase'

const eliminar = async (reporteId) => {
  if (confirm('¿Seguro que deseas eliminar?')) {
    const { error } = await deleteReporte(reporteId)
    
    if (!error) {
      alert('Eliminado correctamente')
      // Recargar lista
      cargarReportes()
    }
  }
}
```

---

### Exportar Reporte Individual

```javascript
import { downloadReporteTXT } from '../services/reportGenerator'

const handleExport = (reporte) => {
  downloadReporteTXT(reporte)
  // Archivo se descarga automáticamente
}
```

---

**© 2026 - Beauty BI Platform - API Documentation**
