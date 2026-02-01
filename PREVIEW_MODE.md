# 👀 VISTA PREVIA SIN CONFIGURACIÓN

## ⚠️ Problema de PowerShell

Tu sistema tiene la ejecución de scripts deshabilitada. Necesitas ejecutar este comando **UNA SOLA VEZ**:

### **Abrir PowerShell como Administrador**

1. Presiona `Windows + X`
2. Selecciona **"Windows PowerShell (Admin)"** o **"Terminal (Administrador)"**
3. Ejecuta:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

4. Confirma con `S` (Sí)

---

## 📦 INSTALAR Y VER LA INTERFAZ

Una vez habilitados los scripts, ejecuta estos comandos en la terminal **NORMAL** (no admin):

### **1. Navegar al proyecto**
```bash
cd C:\Users\jgarr\.gemini\antigravity\scratch\beauty-bi-platform
```

### **2. Instalar dependencias**
```bash
npm install
```

**Tiempo:** 2-3 minutos (descarga paquetes)

### **3. Iniciar servidor de desarrollo**
```bash
npm run dev
```

### **4. Abrir en el navegador**

La aplicación se abrirá automáticamente en `http://localhost:3000`

---

## 👁️ QUÉ VERÁS SIN CONFIGURACIÓN

### ✅ **Dashboard**
- Verás la estructura completa
- Cards de estadísticas en **0**
- Mensaje: "No hay reportes para mostrar"
- Todo el diseño Dark Mode funcional

### ✅ **Sidebar**
- Logo premium 💎
- Navegación completa
- Todos los botones funcionan

### ✅ **Cargar Reportes**
- Interfaz de drag & drop
- Selector de sucursales **VACÍO** (porque no hay Supabase)
- Campo de fecha funcional

### ✅ **Gestión de Reportes**
- Tabla vacía con mensaje
- Filtros funcionan
- Diseño completo visible

### ✅ **Exportar TXT**
- Interfaz completa
- Sin datos para exportar
- Todo el UI visible

---

## 🎨 BENEFICIO DE VER SIN DATOS

Esto es **PERFECTO** para:

✅ Ver el diseño Dark Premium  
✅ Revisar la tipografía Industrial  
✅ Probar la navegación  
✅ Ver las animaciones y hover effects  
✅ Validar la paleta de colores  
✅ Revisar la estructura de componentes  

---

## ⚠️ LO QUE NO FUNCIONARÁ

❌ Carga de imágenes (no hay Gemini AI configurado)  
❌ Procesamiento con IA  
❌ Guardado en base de datos  
❌ Mostrar datos reales  

**PERO** verás toda la interfaz funcionando con estados vacíos profesionales.

---

## 🔄 DESPUÉS DE VER

Cuando quieras configuración REAL:

1. Sigue `SETUP_GUIDE.md`
2. Configura Supabase real
3. Obtén Gemini API Key real
4. Reemplaza valores en `.env`
5. Reinicia `npm run dev`

---

## 🚀 COMANDOS RESUMIDOS

```bash
# En PowerShell como ADMIN (una sola vez)
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# En terminal normal
cd C:\Users\jgarr\.gemini\antigravity\scratch\beauty-bi-platform
npm install
npm run dev
```

---

**¡Ya tienes un archivo .env temporal creado para preview!** 🎉

Solo necesitas habilitar scripts y ejecutar `npm install` + `npm run dev`
