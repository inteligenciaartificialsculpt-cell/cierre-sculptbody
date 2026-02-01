# 💎 BEAUTY BI PLATFORM - PROYECTO COMPLETO

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║         ✨ SISTEMA DE BUSINESS INTELLIGENCE ✨                ║
║              PARA CENTROS ESTÉTICOS                           ║
║                                                               ║
║  🤖 IA + 📊 Analytics + 💾 Exportación + 🎨 Dark Premium     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## ⚡ INICIO ULTRARRÁPIDO

```bash
# 1. Instalar
npm install

# 2. Configurar .env (ver .env.example)
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
# VITE_GEMINI_API_KEY=...

# 3. Ejecutar schema.sql en Supabase

# 4. Iniciar
npm run dev
```

---

## 📦 ¿QUÉ INCLUYE ESTE PROYECTO?

### ✅ **5 COMPONENTES REACT COMPLETOS**
```
1. 💎 Sidebar          → Navegación + Logo Premium
2. 📊 Dashboard        → KPIs + Gráficos de Barras
3. 📤 BulkUpload       → Carga Masiva con IA
4. 📋 ReportesManager  → CRUD Completo
5. 💾 ExportManager    → Generación de TXT
```

### ✅ **3 SERVICIOS API**
```
1. 🗄️ Supabase        → Base de Datos + Storage
2. 🤖 Gemini AI        → Extracción de Datos
3. 📄 Report Generator → Archivos TXT
```

### ✅ **SISTEMA DE BASE DE DATOS**
```
4 Tablas Relacionales
├── sucursales (5 predefinidas)
├── profesionales
├── reportes_mensuales
└── servicios_reporte
```

### ✅ **DOCUMENTACIÓN COMPLETA**
```
📚 README.md          → Documentación principal
⚡ QUICKSTART.md      → Inicio en 5 minutos
📖 SETUP_GUIDE.md     → Paso a paso detallado
🔧 API_DOCS.md        → Documentación técnica
📊 PROJECT_SUMMARY.md → Resumen ejecutivo
📁 STRUCTURE.md       → Estructura del proyecto
```

---

## 🎨 DISEÑO HIGH-END DARK MODE

### **Paleta de Colores**
```css
Background:      #000000  ⬛ Negro Absoluto
Cards:           #1a1a1a  ⬛ Negro Card
Secondary:       #0f0f0f  ⬛ Negro Secundario
Accent:          #ff0033  🟥 Rojo Vibrante
Accent Hover:    #cc0029  🟥 Rojo Oscuro
```

### **Tipografía**
```
Fuente:  Inter (Google Fonts)
Títulos: font-weight: 900 (Ultra Bold)
Estilo:  Industrial / Strong
```

### **Componentes UI**
- ✅ Botones con efecto scale + shadow
- ✅ Cards con border gradient en hover
- ✅ Tablas interactivas
- ✅ Modals con backdrop blur
- ✅ Progress bars animadas
- ✅ Badges de estado
- ✅ Scrollbars personalizados

---

## 🚀 FUNCIONALIDADES

### **1. CARGA MASIVA DE REPORTES**
- Drag & Drop de imágenes
- Validación automática (JPG, PNG, WEBP)
- Procesamiento con Gemini AI
- Barra de progreso en tiempo real
- Guardado automático en Supabase

### **2. DASHBOARD EJECUTIVO**
- 4 KPIs principales
- Gráfico de Ventas por Sucursal (BARRAS)
- Gráfico de Top 10 Servicios (BARRAS)
- Tabla resumen detallada

### **3. GESTIÓN CRUD**
- Ver todos los reportes
- Filtrar por fecha
- Ver detalles completos
- Eliminar con confirmación (CASCADE)

### **4. EXPORTACIÓN TXT**
- Reportes individuales
- Selección múltiple
- Reporte consolidado
- Formato profesional estructurado

---

## 🗄️ BASE DE DATOS SUPABASE

### **Sucursales Predefinidas**
| Nombre | Comisión |
|--------|----------|
| San Miguel | 2.0% |
| Las Condes | 2.0% |
| La Dehesa | 2.0% |
| Antofagasta | 2.0% |
| **Hendaya** | **2.5%** ⭐ |

### **Características**
- ✅ Row Level Security (RLS)
- ✅ Triggers automáticos
- ✅ Índices optimizados
- ✅ Eliminación en cascada
- ✅ Storage público configurado

---

## 🤖 INTELIGENCIA ARTIFICIAL

### **Gemini 2.5 Pro (2.0 Flash compatible)**
```javascript
// Prompt Especializado
- Analiza imágenes de reportes
- Extrae nombre del profesional
- Identifica TODOS los servicios
- Calcula totales automáticamente
- Retorna JSON estructurado
```

### **JSON de Respuesta**
```json
{
  "nombre_profesional": "María González",
  "servicios": [
    {
      "nombre": "Masaje Relajante",
      "cantidad": 5,
      "precio_unitario": 25000,
      "subtotal": 125000
    }
  ],
  "total_venta": 125000,
  "fecha_reporte": "2026-01-31"
}
```

---

## 💾 EXPORTACIÓN TXT

### **Formato del Reporte Individual**
```
═══════════════════════════════════════
    REPORTE MENSUAL DE VENTAS
═══════════════════════════════════════

PROFESIONAL: María González
SUCURSAL: Las Condes
FECHA: 31 de enero de 2026

───────────────────────────────────────

DETALLE DE SERVICIOS

SERVICIO              CANT.  SUBTOTAL
───────────────────────────────────────
Masaje Relajante      5      $125.000

RESUMEN FINANCIERO

Venta Total Bruta:    $125.000
% Comisión:           2.00%
Monto Comisión:       $2.500

═══════════════════════════════════════
PAGO NETO FINAL:      $122.500
═══════════════════════════════════════
```

---

## 📊 STACK TECNOLÓGICO

```
Frontend
├── React 18
├── Vite 5
├── Tailwind CSS 3
└── Chart.js 4

Backend
├── Supabase
│   ├── PostgreSQL
│   ├── Storage
│   └── Auth (RLS)

AI
└── Google Gemini 2.5 Pro

Design
├── Dark Mode Premium
├── Tipografía Industrial
└── Paleta Negro/Rojo
```

---

## 🎯 ESTADO DEL PROYECTO

```
✅ Componentes: 5/5 COMPLETO
✅ Servicios:   3/3 COMPLETO
✅ DB Schema:   4/4 COMPLETO
✅ Docs:        6/6 COMPLETO
✅ Testing:     MANUAL OK
✅ Production:  READY
```

---

## 📚 ¿POR DÓNDE EMPEZAR?

### **Si tienes 5 minutos:**
→ Lee `QUICKSTART.md`

### **Si tienes 15 minutos:**
→ Lee `SETUP_GUIDE.md`

### **Si quieres entenderlo todo:**
→ Lee `README.md`

### **Si vas a programar:**
→ Lee `API_DOCS.md`

### **Si eres manager:**
→ Lee `PROJECT_SUMMARY.md`

---

## 🔧 COMANDOS NPM

```bash
npm install          # Instalar dependencias
npm run dev          # Desarrollo (localhost:3000)
npm run build        # Build producción
npm run preview      # Vista previa del build
```

---

## ⚠️ ANTES DE EMPEZAR

### **Necesitas:**
1. ✅ Node.js >= 18
2. ✅ Cuenta Supabase (gratis)
3. ✅ API Key de Gemini (gratis)

### **Debes configurar:**
1. ✅ Archivo `.env` (ver .env.example)
2. ✅ Ejecutar `database/schema.sql` en Supabase
3. ✅ Crear bucket `reportes-imagenes` (público)

---

## 🎯 CASOS DE USO

### **Día 31 del Mes - Cierre Mensual**
```
1. Recibir reportes en papel/digital
2. Fotografiar reportes
3. Subir imágenes al sistema
4. Procesar con IA
5. Revisar datos en Dashboard
6. Exportar TXT individuales
7. Enviar a cada profesional
8. Generar reporte consolidado
9. Archivar
```

---

## 🚀 DESPLIEGUE

### **Vercel (Recomendado)**
```bash
npm run build
vercel --prod
```

### **Netlify**
```bash
npm run build
netlify deploy --prod --dir=dist
```

### **Configurar Variables**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`

---

## 📞 SOPORTE

### **Documentación:**
- README.md - General
- SETUP_GUIDE.md - Setup
- API_DOCS.md - Programación

### **Troubleshooting:**
Ver sección "Solución de Problemas" en `SETUP_GUIDE.md`

---

## 🎉 CARACTERÍSTICAS DESTACADAS

✨ **Sin datos ficticios** - Base de datos vacía  
✨ **Modular** - Componentes reutilizables  
✨ **Escalable** - Fácil de extender  
✨ **Production Ready** - Listo para usar  
✨ **Documentado** - 6 archivos de docs  
✨ **Seguro** - RLS + validaciones  
✨ **Rápido** - Vite + optimizaciones  
✨ **Bonito** - Dark Mode Premium  

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              🚀 LISTO PARA PRODUCCIÓN 🚀                      ║
║                                                               ║
║         Creado con ❤️ como Fintech Specialist                 ║
║              High-End Dark Mode Design                        ║
║                                                               ║
║              © 2026 - Beauty BI Platform                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

**¡Comienza ahora!** → `npm install` → `npm run dev`
