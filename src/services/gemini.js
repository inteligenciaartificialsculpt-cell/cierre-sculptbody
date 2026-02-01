import { GoogleGenerativeAI } from '@google/generative-ai'

// =============================================
// GEMINI AI CONFIGURATION
// =============================================
// INSTRUCCIONES:
// 1. Obtener API Key en https://makersuite.google.com/app/apikey
// 2. Crear archivo .env en la raíz con: VITE_GEMINI_API_KEY=tu_api_key
// 3. Reiniciar el servidor de desarrollo

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY'

let genAI
let model

try {
    genAI = new GoogleGenerativeAI(API_KEY)
    // Usamos gemini-2.5-flash-lite que ofrece la mayor cuota gratuita (1000 reportes/día) en 2026
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
} catch (error) {
    console.error('Error al inicializar Gemini AI:', error)
}

// =============================================
// PROMPT DE EXTRACCIÓN DE DATOS
// =============================================
const EXTRACTION_PROMPT = `
Eres un asistente experto en análisis de reportes de ventas para centros estéticos.

INSTRUCCIONES:
1. Analiza la imagen del reporte de ventas adjunto.
2. Extrae TODA la información en formato JSON estructurado.
3. IMPORTANTE: Identifica TODOS los servicios/tratamientos con sus cantidades y precios.
4. Si un servicio aparece múltiples veces, agrúpalos sumando cantidades.
5. Calcula el total de venta sumando todos los subtotales.

FORMATO DE SALIDA REQUERIDO (JSON):
{
  "nombre_profesional": "Nombre completo del profesional",
  "servicios": [
    {
      "nombre": "Nombre del servicio/tratamiento",
      "cantidad": número entero,
      "precio_unitario": número decimal,
      "subtotal": número decimal (cantidad * precio_unitario)
    }
  ],
  "total_venta": número decimal (suma de todos los subtotales),
  "fecha_reporte": "YYYY-MM-DD" (si aparece en la imagen, sino usar null),
  "notas": "Cualquier observación relevante o null si no hay"
}

REGLAS:
- Todos los números deben ser en formato decimal (ej: 45000.00, no "45.000")
- Si no encuentras un dato, usa null
- Responde ÚNICAMENTE con el JSON, sin texto adicional
- Asegúrate de que la suma de subtotales coincida con el total_venta
`

// =============================================
// FUNCIÓN DE EXTRACCIÓN DE DATOS DE IMAGEN
// =============================================
export const extractDataFromImage = async (imageFile) => {
    try {
        if (!model) {
            throw new Error('Gemini AI no está inicializado. Verifica tu API Key.')
        }

        // Convertir imagen a base64
        const imageBase64 = await fileToBase64(imageFile)

        // Crear el prompt con la imagen
        const imageParts = [
            {
                inlineData: {
                    data: imageBase64.split(',')[1], // Remover el prefijo data:image/...
                    mimeType: imageFile.type
                }
            }
        ]

        // Llamar a la API de Gemini
        const result = await model.generateContent([EXTRACTION_PROMPT, ...imageParts])
        const response = await result.response
        const text = response.text()

        // Extraer JSON de la respuesta
        let jsonData
        try {
            // Intentar parsear directamente
            jsonData = JSON.parse(text)
        } catch (e) {
            // Si falla, buscar JSON en el texto (por si viene con markdown)
            const jsonMatch = text.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                jsonData = JSON.parse(jsonMatch[0])
            } else {
                throw new Error('No se pudo extraer JSON de la respuesta de Gemini')
            }
        }

        // Validar estructura del JSON
        if (!jsonData.nombre_profesional || !jsonData.servicios || !jsonData.total_venta) {
            throw new Error('Estructura de JSON inválida. Faltan campos obligatorios.')
        }

        return {
            success: true,
            data: jsonData,
            error: null
        }

    } catch (error) {
        console.error('Error en extracción de datos:', error)
        return {
            success: false,
            data: null,
            error: error.message
        }
    }
}

// =============================================
// PROCESAMIENTO MASIVO DE IMÁGENES
// =============================================
export const extractDataFromMultipleImages = async (imageFiles, onProgress = null) => {
    const results = []
    let successCount = 0
    let failCount = 0

    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]

        // Notificar progreso
        if (onProgress) {
            onProgress({
                current: i + 1,
                total: imageFiles.length,
                fileName: file.name
            })
        }

        // Procesar imagen
        const result = await extractDataFromImage(file)

        results.push({
            fileName: file.name,
            file: file,
            ...result
        })

        if (result.success) {
            successCount++
        } else {
            failCount++
        }

        // Aumentamos pausa a 12 segundos para cumplir con el límite de 5 peticiones por minuto de la versión gratuita
        await sleep(12000)
    }

    return {
        results,
        summary: {
            total: imageFiles.length,
            success: successCount,
            failed: failCount
        }
    }
}

// =============================================
// UTILIDADES
// =============================================

// Convertir archivo a base64
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

// Sleep helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Validar que la imagen sea procesable
export const validateImageFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Formato de imagen no válido. Use JPG, PNG o WEBP.'
        }
    }

    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'La imagen es demasiado grande. Máximo 10MB.'
        }
    }

    return { valid: true, error: null }
}
