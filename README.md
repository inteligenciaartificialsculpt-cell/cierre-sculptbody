# 💎 Beauty BI Platform

**Sistema de Business Intelligence para Cierre Mensual de Centros Estéticos**

Plataforma completa desarrollada con **React + Tailwind CSS + Chart.js + Supabase + Gemini AI** que procesa imágenes de reportes de ventas, extrae datos mediante IA y consolida KPIs financieros con estética **High-End Dark Mode**.

---

## 📋 Índice

1. [Características Principales](#-características-principales)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Requisitos Previos](#-requisitos-previos)
4. [Instalación](#-instalación)
5. [Configuración](#-configuración)
6. [Estructura del Proyecto](#-estructura-del-proyecto)
7. [Uso del Sistema](#-uso-del-sistema)
8. [Base de Datos](#-base-de-datos)
9. [API de Gemini](#-api-de-gemini)
10. [Exportación de Reportes](#-exportación-de-reportes)
11. [Despliegue](#-despliegue)

---

## ✨ Características Principales

### 🤖 **Inteligencia Artificial**
- Procesamiento automático de imágenes con **Gemini 2.0 Flash**
- Extracción estructurada de datos (profesional, servicios, montos)
- Carga masiva (bulk upload) con barra de progreso

### 📊 **Dashboard Ejecutivo**
- KPIs en tiempo real: Ventas Brutas, Comisiones, Pagos Netos
- Gráficos de BARRAS (Chart.js) por sucursal y servicios
- Tabla resumen con detalle financiero

### 🗄️ **Gestión CRUD**
- Visualización completa de reportes procesados
- Eliminación en cascada (reportes + servicios)
- Modal de detalles con imagen original

### 💾 **Exportación TXT**
- Reportes individuales por profesional
- Reporte consolidado con todos los profesionales
- Formato estructurado: Header, Body (servicios), Footer (resumen)

### 🎨 **Diseño Premium**
- Paleta Dark Mode: `#000000`, `#1a1a1a`, `#ff0033`
- Tipografía Industrial/Strong (`font-weight: 900`)
- Animaciones y micro-interacciones
- Componentes glassmorphism

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS 3 |
| **Charts** | Chart.js 4 + react-chartjs-2 |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| **AI Engine** | Google Gemini 2.0 Flash |
| **Build Tool** | Vite 5 |

---

## 📦 Requisitos Previos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- Cuenta en [Supabase](https://supabase.com)
- API Key de [Google AI Studio](https://makersuite.google.com/app/apikey)

---

## 🚀 Instalación

### 1️⃣ Clonar/Descargar el Proyecto

```bash
cd beauty-bi-platform
```

### 2️⃣ Instalar Dependencias

```bash
npm install
```

**Nota:** Si hay problemas de ejecución de scripts en PowerShell, ejecuta:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

## ⚙️ Configuración

### 🔐 Variables de Entorno

1. Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

2. Edita `.env` con tus credenciales:

```env
# SUPABASE
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon_aqui

# GEMINI AI
VITE_GEMINI_API_KEY=tu_api_key_gemini_aqui
```

### 🗄️ Configuración de Supabase

#### A. Crear Proyecto en Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Crea un nuevo proyecto
3. Copia **Project URL** y **anon/public key** desde `Settings > API`

#### B. Ejecutar Schema SQL

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Abre el archivo `database/schema.sql`
3. Copia todo el contenido y ejecútalo en el editor
4. Verifica que se crearon las tablas:
   - `sucursales`
   - `profesionales`
   - `reportes_mensuales`
   - `servicios_reporte`

#### C. Configurar Storage

1. Ve a **Storage** en el dashboard
2. Crea un bucket llamado `reportes-imagenes`
3. Configura como **público** para permitir visualización de imágenes

### 🤖 Configuración de Gemini AI

1. Obtén tu API Key en [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Agrégala al archivo `.env` como `VITE_GEMINI_API_KEY`

---

## 📁 Estructura del Proyecto

```
beauty-bi-platform/
├── database/
│   └── schema.sql                 # Schema de PostgreSQL
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx           # Navegación lateral
│   │   ├── Dashboard.jsx         # Vista de KPIs y gráficos
│   │   ├── BulkUpload.jsx        # Carga masiva de imágenes
│   │   ├── ReportesManager.jsx   # Gestión CRUD
│   │   └── ExportManager.jsx     # Exportación TXT
│   ├── services/
│   │   ├── supabase.js           # Cliente y funciones DB
│   │   ├── gemini.js             # Extracción con IA
│   │   └── reportGenerator.js    # Generación de TXT
│   ├── App.jsx                    # Componente principal
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Estilos globales
├── .env.example                   # Template de variables
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🎯 Uso del Sistema

### 1️⃣ Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 2️⃣ Flujo de Trabajo Completo

#### **PASO 1: Cargar Reportes**

1. Ve a **"Cargar Reportes"** en el sidebar
2. Selecciona la **sucursal** correspondiente
3. Ajusta la **fecha de reporte** (por defecto: día 31 del mes actual)
4. Arrastra o selecciona las imágenes de reportes
   - Formatos: JPG, PNG, WEBP
   - Tamaño máximo: 10MB por archivo
   - 1 imagen = 1 profesional
5. Haz clic en **"Procesar con IA"**
6. Espera a que Gemini extraiga los datos
7. Revisa los resultados (exitosos/fallidos)

#### **PASO 2: Visualizar Dashboard**

1. Ve a **"Dashboard"**
2. Visualiza:
   - **Tarjetas de KPIs:** Ventas, Comisiones, Pagos Netos, Profesionales
   - **Gráfico de Ventas por Sucursal** (barras)
   - **Top 10 Servicios más Vendidos** (barras)
   - **Tabla Resumen por Sucursal**

#### **PASO 3: Gestionar Reportes**

1. Ve a **"Gestión de Reportes"**
2. Filtra por fecha si necesitas
3. Acciones disponibles:
   - **👁️ Ver:** Abre modal con detalle completo + imagen original
   - **🗑️ Eliminar:** Elimina el reporte y sus servicios (CASCADE)

#### **PASO 4: Exportar Reportes TXT**

1. Ve a **"Exportar TXT"**
2. Selecciona la fecha de reporte
3. Opciones de exportación:
   - **📄 Exportar TXT Individual:** Un archivo por profesional
   - **☑️ Seleccionar múltiples:** Exporta varios reportes
   - **📊 Reporte Consolidado:** Un archivo con todos los profesionales

---

## 🗄️ Base de Datos

### Modelo Relacional

```
sucursales (5 registros predefinidos)
├── id (UUID)
├── nombre (VARCHAR)
├── comision_porcentaje (DECIMAL) → 2.00% o 2.50%
└── timestamps

profesionales
├── id (UUID)
├── nombre (VARCHAR)
├── sucursal_id (FK → sucursales)
└── timestamps

reportes_mensuales
├── id (UUID)
├── profesional_id (FK → profesionales) [ON DELETE CASCADE]
├── fecha_reporte (DATE)
├── total_venta_bruta (DECIMAL)
├── comision_porcentaje (DECIMAL)
├── pago_neto (DECIMAL)
├── imagen_url (TEXT)
└── estado (VARCHAR)

servicios_reporte
├── id (UUID)
├── reporte_id (FK → reportes_mensuales) [ON DELETE CASCADE]
├── nombre_servicio (VARCHAR)
├── cantidad (INT)
├── precio_unitario (DECIMAL)
└── subtotal (DECIMAL)
```

### Sucursales Predefinidas

| Sucursal | Comisión |
|----------|----------|
| San Miguel | 2.0% |
| Las Condes | 2.0% |
| La Dehesa | 2.0% |
| Antofagasta | 2.0% |
| Hendaya | 2.5% |

---

## 🤖 API de Gemini

### Prompt de Extracción

El sistema utiliza un prompt especializado que instruye a Gemini 2.0 Flash para:

1. Analizar la imagen del reporte de ventas
2. Identificar el nombre del profesional
3. Extraer TODOS los servicios/tratamientos con:
   - Nombre del servicio
   - Cantidad
   - Precio unitario
   - Subtotal
4. Calcular el total de venta
5. Retornar un JSON estructurado

### Formato de Respuesta Esperado

```json
{
  "nombre_profesional": "Juan Pérez",
  "servicios": [
    {
      "nombre": "Masaje Relajante",
      "cantidad": 5,
      "precio_unitario": 25000,
      "subtotal": 125000
    }
  ],
  "total_venta": 125000,
  "fecha_reporte": "2026-01-31",
  "notas": null
}
```

---

## 💾 Exportación de Reportes

### Formato de Archivo TXT Individual

```
═══════════════════════════════════════════════════════════════════
    REPORTE MENSUAL DE VENTAS - CENTRO ESTÉTICO
═══════════════════════════════════════════════════════════════════

PROFESIONAL: Juan Pérez
SUCURSAL: Las Condes
FECHA DE REPORTE: 31 de enero de 2026
FECHA DE GENERACIÓN: 31/01/2026 17:30:00

──────────────────────────────────────────────────────────────────

DETALLE DE SERVICIOS Y TRATAMIENTOS

SERVICIO                                CANT.     P. UNIT.       SUBTOTAL       
──────────────────────────────────────────────────────────────────
Masaje Relajante                        5         $25.000        $125.000       
Limpieza Facial                         3         $30.000        $90.000        
──────────────────────────────────────────────────────────────────

RESUMEN FINANCIERO

Venta Total Bruta:                      $215.000
Porcentaje de Comisión:                 2.00%
Monto de Comisión:                      $4.300

═══════════════════════════════════════════════════════════════════
PAGO NETO FINAL:                        $210.700
═══════════════════════════════════════════════════════════════════

NOTAS:
- Este documento es de carácter informativo.
- Cualquier discrepancia debe ser reportada a administración.
- Los montos están expresados en pesos chilenos (CLP).

Generado por: Beauty BI Platform
Sistema de Business Intelligence - Cierre Mensual
```

---

## 🌐 Despliegue

### Opciones Recomendadas

#### **Vercel (Recomendado)**

```bash
npm run build
vercel --prod
```

Configurar variables de entorno en Vercel Dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`

#### **Netlify**

```bash
npm run build
netlify deploy --prod --dir=dist
```

#### **Build Local**

```bash
npm run build
```

Genera los archivos estáticos en `dist/`

---

## 🎨 Paleta de Colores

| Nombre | Hex | Uso |
|--------|-----|-----|
| Dark BG | `#000000` | Fondo principal |
| Dark Card | `#1a1a1a` | Tarjetas y modales |
| Dark Secondary | `#0f0f0f` | Backgrounds secundarios |
| Accent Red | `#ff0033` | Botones, acentos, hover |
| Accent Red Hover | `#cc0029` | Estado hover de botones |

---

## 🔒 Seguridad

- **Row Level Security (RLS)** habilitado en Supabase
- Variables de entorno NO committed al repositorio
- Validación de archivos en frontend y backend
- Anon key de Supabase (solo para operaciones públicas)

---

## 📄 Licencia

Este proyecto es privado y está desarrollado específicamente para centros estéticos.

---

## 👨‍💻 Soporte

Para preguntas o soporte técnico:

1. Revisa la documentación completa
2. Verifica la configuración de `.env`
3. Comprueba que las tablas de Supabase estén creadas
4. Valida que el bucket de Storage esté configurado como público

---

## 🚀 Roadmap Futuro

- [ ] Autenticación de usuarios (Supabase Auth)
- [ ] Roles y permisos (Admin, Contador, Profesional)
- [ ] Gráficos comparativos mes a mes
- [ ] Notificaciones por email
- [ ] Exportación a Excel/PDF
- [ ] Dashboard mobile-responsive
- [ ] Integración con sistemas de pago

---

**Desarrollado con ❤️ usando:**
React • Tailwind CSS • Chart.js • Supabase • Gemini AI

**© 2026 - Fintech Specialist - High-End Dark Mode**
