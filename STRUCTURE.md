# 📁 ESTRUCTURA DEL PROYECTO

```
beauty-bi-platform/
│
├── 📄 README.md                    # Documentación principal completa
├── 📄 QUICKSTART.md               # Inicio rápido (5 minutos)
├── 📄 SETUP_GUIDE.md              # Guía paso a paso detallada
├── 📄 API_DOCS.md                 # Documentación de APIs
├── 📄 PROJECT_SUMMARY.md          # Resumen ejecutivo del proyecto
│
├── ⚙️ package.json                # Dependencias y scripts
├── ⚙️ vite.config.js              # Configuración de Vite
├── ⚙️ tailwind.config.js          # Configuración de Tailwind CSS
├── ⚙️ postcss.config.js           # Configuración de PostCSS
│
├── 🔒 .env.example                # Template de variables de entorno
├── 🔒 .gitignore                  # Archivos a ignorar en Git
│
├── 🌐 index.html                  # HTML principal + fuentes
│
├── 🗄️ database/
│   └── schema.sql                 # Schema PostgreSQL completo
│
└── 💻 src/
    │
    ├── 🎨 index.css               # Estilos globales + design system
    ├── 🚀 main.jsx                # Entry point de React
    ├── 📦 App.jsx                 # Componente principal + routing
    │
    ├── 🧩 components/
    │   ├── Sidebar.jsx            # Navegación lateral
    │   ├── Dashboard.jsx          # KPIs + Gráficos de barras
    │   ├── BulkUpload.jsx         # Carga masiva con IA
    │   ├── ReportesManager.jsx    # CRUD de reportes
    │   └── ExportManager.jsx      # Exportación TXT
    │
    └── 🔧 services/
        ├── supabase.js            # Cliente Supabase + funciones DB
        ├── gemini.js              # Extracción con Gemini AI
        └── reportGenerator.js     # Generador de archivos TXT
```

---

## 📊 ESTADÍSTICAS

| Categoría | Cantidad |
|-----------|----------|
| **Documentación** | 5 archivos |
| **Configuración** | 5 archivos |
| **Componentes React** | 5 componentes |
| **Servicios API** | 3 servicios |
| **Archivos SQL** | 1 schema |
| **Total Archivos** | 25+ archivos |

---

## 🎯 ARCHIVOS CLAVE

### **📚 Documentación (Lee primero)**
1. **README.md** - Documentación completa
2. **QUICKSTART.md** - Inicio rápido
3. **SETUP_GUIDE.md** - Setup paso a paso

### **⚙️ Configuración (Editar)**
1. **.env** (crear desde .env.example)
2. **database/schema.sql** (ejecutar en Supabase)

### **💻 Desarrollo (No modificar sin necesidad)**
- `src/components/*` - Componentes UI
- `src/services/*` - Lógica de negocio
- `src/index.css` - Sistema de diseño

---

## 🚀 COMANDOS DISPONIBLES

```bash
# Instalar dependencias
npm install

# Desarrollo (puerto 3000)
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

---

## 📖 GUÍA DE LECTURA

### **Para empezar rápido:**
→ `QUICKSTART.md`

### **Para setup detallado:**
→ `SETUP_GUIDE.md`

### **Para entender el sistema:**
→ `README.md`

### **Para programar:**
→ `API_DOCS.md`

### **Para resumen ejecutivo:**
→ `PROJECT_SUMMARY.md`

---

## 🔄 FLUJO DE DATOS

```
┌─────────────┐
│   USUARIO   │
│  (Browser)  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  React Frontend │ ◄── Tailwind CSS + Chart.js
│  (5 Components) │
└────────┬────────┘
         │
         ├──────────────┐
         ▼              ▼
  ┌──────────┐   ┌──────────┐
  │ Supabase │   │ Gemini   │
  │ Database │   │ AI (2.5) │
  │ Storage  │   │ Vision   │
  └──────────┘   └──────────┘
         │              │
         └──────┬───────┘
                ▼
         ┌──────────────┐
         │  TXT Export  │
         │  Generator   │
         └──────────────┘
```

---

## 🎨 COMPONENTES UI

```
App.jsx
├── Sidebar.jsx (Navegación)
└── [Vista Activa]
    ├── Dashboard.jsx
    │   ├── Stats Cards (4)
    │   ├── Bar Chart - Sucursales
    │   ├── Bar Chart - Servicios
    │   └── Table - Resumen
    │
    ├── BulkUpload.jsx
    │   ├── Drag & Drop Zone
    │   ├── File List
    │   ├── Progress Bar
    │   └── Results Summary
    │
    ├── ReportesManager.jsx
    │   ├── Filter Controls
    │   ├── Reportes Table
    │   ├── Details Modal
    │   └── Delete Modal
    │
    └── ExportManager.jsx
        ├── Date Filter
        ├── Select All Checkbox
        ├── Reportes Table
        └── Export Buttons
```

---

## 🗄️ MODELO DE BASE DE DATOS

```
┌──────────────┐
│  sucursales  │
│ (5 records)  │
└──────┬───────┘
       │ 1
       │
       │ N
┌──────▼────────┐
│ profesionales │
└──────┬────────┘
       │ 1
       │
       │ N
┌──────▼──────────────┐
│ reportes_mensuales  │
└──────┬──────────────┘
       │ 1
       │
       │ N
┌──────▼──────────────┐
│ servicios_reporte   │
└─────────────────────┘
```

---

## 🎯 PRÓXIMO PASO

**Lee:** `QUICKSTART.md` o `SETUP_GUIDE.md`

---

**© 2026 - Beauty BI Platform**
