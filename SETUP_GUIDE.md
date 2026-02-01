# 🚀 GUÍA DE CONFIGURACIÓN INICIAL - BEAUTY BI PLATFORM

Esta guía te llevará paso a paso desde cero hasta tener el sistema completamente funcional.

---

## ✅ CHECKLIST DE CONFIGURACIÓN

- [ ] 1. Instalar Dependencias
- [ ] 2. Configurar Supabase (Proyecto + Base de Datos + Storage)
- [ ] 3. Obtener API Key de Gemini
- [ ] 4. Configurar Variables de Entorno
- [ ] 5. Iniciar Servidor de Desarrollo
- [ ] 6. Probar Carga de Reportes

---

## 📋 PASO 1: INSTALAR DEPENDENCIAS

### Verificar Node.js y npm

```bash
node --version   # Debe ser >= 18.0.0
npm --version    # Debe ser >= 9.0.0
```

### Instalar Dependencias del Proyecto

```bash
cd beauty-bi-platform
npm install
```

**Tiempo estimado:** 2-3 minutos

---

## 🗄️ PASO 2: CONFIGURAR SUPABASE

### A. Crear Proyecto en Supabase

1. **Ir a:** https://supabase.com
2. Haz clic en **"Start your project"** ó **"New Project"**
3. Completa los datos:
   - **Name:** `beauty-bi-platform` (o el nombre que prefieras)
   - **Database Password:** **Guarda esta contraseña** (la necesitarás)
   - **Region:** Elige la más cercana (South America / Sao Paulo)
4. Haz clic en **"Create new project"**
5. **Espera 2-3 minutos** mientras Supabase crea tu proyecto

### B. Obtener Credenciales de API

1. Una vez creado el proyecto, ve a **Settings** (⚙️ en el sidebar izquierdo)
2. Selecciona **"API"**
3. Copia los siguientes valores:

   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Guárdalos** para el Paso 4

### C. Ejecutar Schema de Base de Datos

1. En el dashboard de Supabase, ve a **SQL Editor** (en el sidebar)
2. Haz clic en **"New query"**
3. Abre el archivo `database/schema.sql` de este proyecto
4. **Copia TODO el contenido** y pégalo en el editor de Supabase
5. Haz clic en **"Run"** (▶️ abajo a la derecha)
6. Deberías ver: **"Success. No rows returned"**

### D. Verificar Tablas Creadas

1. Ve a **Table Editor** en el sidebar
2. Deberías ver 4 tablas:
   - ✅ `sucursales` (5 filas insertadas)
   - ✅ `profesionales` (0 filas)
   - ✅ `reportes_mensuales` (0 filas)
   - ✅ `servicios_reporte` (0 filas)

3. Haz clic en `sucursales` y verifica que contenga:
   ```
   San Miguel - 2.00%
   Las Condes - 2.00%
   La Dehesa - 2.00%
   Antofagasta - 2.00%
   Hendaya - 2.50%
   ```

### E. Configurar Storage para Imágenes

1. Ve a **Storage** en el sidebar
2. Haz clic en **"Create a new bucket"**
3. Completa:
   - **Name:** `reportes-imagenes`
   - **Public bucket:** ✅ **SÍ** (marca el checkbox)
4. Haz clic en **"Create bucket"**

**Tiempo estimado:** 5-7 minutos

---

## 🤖 PASO 3: OBTENER API KEY DE GEMINI

### Opción A: Si tienes cuenta de Google

1. **Ir a:** https://makersuite.google.com/app/apikey
2. Haz clic en **"Create API Key"**
3. Selecciona un proyecto de Google Cloud o crea uno nuevo
4. **Copia la API Key** que se genera
5. **Guárdala** para el Paso 4

### Opción B: Si no tienes cuenta

1. **Ir a:** https://ai.google.dev/
2. Haz clic en **"Get API Key in Google AI Studio"**
3. Inicia sesión con tu cuenta de Google
4. Sigue el proceso de Opción A

**⚠️ IMPORTANTE:** La API Key es gratuita con límites generosos para pruebas.

**Tiempo estimado:** 3-5 minutos

---

## 🔐 PASO 4: CONFIGURAR VARIABLES DE ENTORNO

### Crear archivo .env

1. En la raíz del proyecto `beauty-bi-platform/`, crea un archivo llamado **`.env`**

   **En Windows (PowerShell):**
   ```powershell
   New-Item .env -ItemType File
   ```

   **O manualmente:** Crea un archivo de texto y nómbralo `.env` (sin extensión)

2. Abre el archivo `.env` con un editor de texto

3. **Copia y pega** el siguiente contenido:

   ```env
   # SUPABASE CONFIGURATION
   VITE_SUPABASE_URL=PEGA_AQUI_TU_PROJECT_URL
   VITE_SUPABASE_ANON_KEY=PEGA_AQUI_TU_ANON_KEY

   # GEMINI AI CONFIGURATION
   VITE_GEMINI_API_KEY=PEGA_AQUI_TU_GEMINI_API_KEY
   ```

4. **Reemplaza** los valores con tus credenciales reales:

   ```env
   # EJEMPLO (con valores reales):
   VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU0NzE1MjcsImV4cCI6MTk2MTA0NzUyN30.XXXXXXXXXXXXXXXXXXXXX
   VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

5. **Guarda el archivo**

**⚠️ NUNCA SUBAS ESTE ARCHIVO A GITHUB/GIT**

**Tiempo estimado:** 2 minutos

---

## 🚀 PASO 5: INICIAR SERVIDOR DE DESARROLLO

### Iniciar la Aplicación

```bash
npm run dev
```

Deberías ver algo como:

```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Abrir en el Navegador

1. Tu navegador debería abrirse automáticamente en `http://localhost:3000`
2. Si no, **abre manualmente:** `http://localhost:3000`

### Verificar que Cargó Correctamente

Deberías ver:

- ✅ Sidebar negro a la izquierda con el logo **💎 Beauty BI**
- ✅ Dashboard principal con 4 tarjetas de estadísticas (en 0)
- ✅ Mensaje: "No hay reportes para mostrar"
- ✅ Diseño oscuro (negro) con acentos rojos

**Tiempo estimado:** 1 minuto

---

## 🧪 PASO 6: PROBAR CARGA DE REPORTES

### Preparar Imagen de Prueba

1. **Opción A:** Usa una captura de pantalla de un reporte real de ventas
2. **Opción B:** Crea una imagen de prueba con texto como:

   ```
   Reporte de Ventas
   Profesional: María González
   
   Servicios:
   - Masaje Relajante x2 - $25.000 c/u = $50.000
   - Limpieza Facial x1 - $30.000 c/u = $30.000
   
   Total: $80.000
   ```

### Cargar en el Sistema

1. En el sidebar, haz clic en **"Cargar Reportes"** (📤)
2. Selecciona **Sucursal:** "Las Condes"
3. **Fecha de Reporte:** Deja la que viene por defecto (31 del mes actual)
4. **Arrastra o selecciona** tu imagen de prueba
5. Haz clic en **"🚀 Procesar con IA"**

### Verificar Procesamiento

1. Deberás ver una **barra de progreso**
2. Gemini analizará la imagen (tarda 5-10 segundos)
3. Al finalizar, verás el **resultado:**
   - ✅ **GUARDADO** (exitoso) → Datos extraídos correctamente
   - ❌ **ERROR** → Revisa que la imagen contenga texto claro

### Verificar Dashboard

1. Ve a **"Dashboard"** en el sidebar
2. Deberías ver:
   - ✅ Estadísticas actualizadas
   - ✅ Gráficos con datos
   - ✅ Tabla con el profesional

**Tiempo estimado:** 2-3 minutos

---

## ✅ CONFIGURACIÓN COMPLETA

**¡Felicitaciones!** 🎉

Tu sistema Beauty BI Platform está **100% funcional**.

### Próximos Pasos

1. **Cargar más reportes** en "Cargar Reportes"
2. **Visualizar datos** en "Dashboard"
3. **Gestionar reportes** en "Gestión de Reportes"
4. **Exportar TXT** en "Exportar TXT"

---

## ❓ SOLUCIÓN DE PROBLEMAS COMUNES

### Error: "Gemini AI no está inicializado"

**Causa:** API Key incorrecta o no configurada

**Solución:**
1. Verifica que `.env` contenga `VITE_GEMINI_API_KEY=...`
2. Reinicia el servidor: `Ctrl+C` → `npm run dev`

---

### Error: "Error al obtener sucursales"

**Causa:** Credenciales de Supabase incorrectas o schema no ejecutado

**Solución:**
1. Verifica `.env` con credenciales correctas
2. Ejecuta el schema en Supabase SQL Editor
3. Reinicia el servidor

---

### Error: "Cannot find module"

**Causa:** Dependencias no instaladas

**Solución:**
```bash
npm install
```

---

### La aplicación no abre automáticamente

**Solución:**
Abre manualmente: http://localhost:3000

---

### "Formato de imagen no válido"

**Causa:** Archivo no es JPG/PNG/WEBP o es muy grande

**Solución:**
- Usa formato: JPG, PNG o WEBP
- Tamaño máximo: 10MB

---

## 📞 CONTACTO DE SOPORTE

Si después de seguir esta guía tienes problemas:

1. Revisa que **TODOS** los pasos estén completos
2. Verifica el archivo `.env` con valores reales
3. Comprueba la consola del navegador (F12) para errores
4. Revisa la terminal donde corre `npm run dev`

---

**© 2026 - Beauty BI Platform - High-End Dark Mode**
