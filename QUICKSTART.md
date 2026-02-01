# ⚡ INICIO RÁPIDO - 5 MINUTOS

Para usuarios experimentados que quieren poner en marcha el sistema lo más rápido posible.

---

## 📦 1. INSTALAR (1 min)

```bash
cd beauty-bi-platform
npm install
```

---

## 🔐 2. CONFIGURAR SUPABASE (2 min)

1. **Crear proyecto:** https://supabase.com/dashboard
2. **Copiar credenciales:** Settings > API
3. **Ejecutar SQL:** Copiar `database/schema.sql` → SQL Editor → Run
4. **Crear bucket:** Storage > New Bucket > `reportes-imagenes` (público)

---

## 🤖 3. OBTENER GEMINI API KEY (1 min)

1. **Ir a:** https://makersuite.google.com/app/apikey
2. **Create API Key**
3. Copiar key

---

## 📝 4. CONFIGURAR .ENV (30 seg)

Crear archivo `.env` en la raíz:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GEMINI_API_KEY=AIzaSy...
```

---

## 🚀 5. INICIAR (30 seg)

```bash
npm run dev
```

Abrir: http://localhost:3000

---

## ✅ VERIFICAR

1. Ves el **Dashboard** con sidebar negro
2. Ir a **"Cargar Reportes"**
3. Seleccionar sucursal
4. Subir imagen de prueba
5. **"Procesar con IA"**

---

## 📚 MÁS INFORMACIÓN

- **Setup Detallado:** `SETUP_GUIDE.md`
- **Documentación:** `README.md`
- **APIs:** `API_DOCS.md`

---

**¡Listo para producción en 5 minutos!** 🎉
