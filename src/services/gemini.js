import { GoogleGenerativeAI } from '@google/generative-ai'

// =============================================
// MOTOR DE IA DE ALTA DISPONIBILIDAD (FAILOVER)
// =============================================
// LLAVE PRO PARA CUENTA DE PAGO
const API_KEY = 'AIzaSyAE5ieFQRNmOFbHSquscbceusgXcfcx6_Y'
const genAI = new GoogleGenerativeAI(API_KEY)

// Canales de respaldo: Combinaciones de modelos y versiones de API
const CHANNELS = [
    { model: 'gemini-1.5-flash', apiVersion: 'v1' },
    { model: 'gemini-1.5-flash', apiVersion: 'v1beta' },
    { model: 'gemini-1.5-pro', apiVersion: 'v1' },
    { model: 'gemini-1.5-pro', apiVersion: 'v1beta' }
]

// =============================================
// PROMPT DE EXTRACCIÓN DE DATOS
// =============================================
const EXTRACTION_PROMPT = `
Eres un asistente experto en análisis de reportes de ventas para centros estéticos en CHILE.

INSTRUCCIONES DE MONEDA (CLP):
1. Los montos están en PESOS CHILENOS (CLP).
2. IMPORTANTE: El punto (.) en los reportes suele ser un SEPARADOR DE MILES (ej: 11.930.000 es 11 millones).
3. NO trunques los números. Si ves "11.930.000", el valor numérico es 11930000.
4. Si ves un número como "11.930" en un total general, es altamente probable que sea "11.930.000". Usa el sentido común según el tipo de servicio (un tratamiento suele costar entre 20.000 y 800.000 CLP).

INSTRUCCIONES DE EXTRACCIÓN:
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
      "precio_unitario": número entero (CLP),
      "subtotal": número entero (CLP)
    }
  ],
  "total_venta": número entero (CLP - suma de todos los subtotales),
  "fecha_reporte": "YYYY-MM-DD" (si aparece en la imagen, sino usar null),
  "notas": "Cualquier observación relevante o null si no hay"
}

REGLAS:
- Los montos DEBEN ser números enteros (ej: 45000, no 45.000 o 45000.00).
- Si no encuentras un dato, usa null.
- Responde ÚNICAMENTE con el JSON, sin texto adicional.
- Asegúrate de que la suma de subtotales coincida EXACTAMENTE con el total_venta.
`

// =============================================
// FUNCIÓN DE EXTRACCIÓN DE DATOS DE IMAGEN
// =============================================
export const extractDataFromImage = async (imageFile) => {
    try {
        const imageBase64 = await fileToBase64(imageFile)
        const imageParts = [
            {
                inlineData: {
                    data: imageBase64.split(',')[1],
                    mimeType: imageFile.type
                }
            }
        ]

        let lastError = null

        // Bucle de Resiliencia: Intenta cada canal hasta que uno funcione
        for (const channel of CHANNELS) {
            try {
                console.log(`[AI-MASTER] Intentando canal: ${channel.model} (${channel.apiVersion})...`)
                const modelInstance = genAI.getGenerativeModel({ model: channel.model }, { apiVersion: channel.apiVersion })

                const result = await modelInstance.generateContent([EXTRACTION_PROMPT, ...imageParts])
                const response = await result.response
                const text = response.text()

                // Intentar parsear el JSON
                let jsonData
                try {
                    jsonData = JSON.parse(text)
                } catch (e) {
                    const jsonMatch = text.match(/\{[\s\S]*\}/)
                    if (jsonMatch) {
                        jsonData = JSON.parse(jsonMatch[0])
                    } else {
                        throw new Error('No se detectó JSON válido')
                    }
                }

                // Validar estructura mínima
                if (!jsonData.nombre_profesional || !jsonData.servicios) {
                    throw new Error('Estructura incompleta')
                }

                return {
                    success: true,
                    data: jsonData,
                    error: null
                }
            } catch (error) {
                console.warn(`[AI-MASTER] Falló ${channel.model} en ${channel.apiVersion}:`, error.message)
                lastError = error
                // Pasar al siguiente canal
            }
        }

        throw new Error(`Servicio no disponible. Reintentos agotados. Detalle: ${lastError?.message}`)

    } catch (error) {
        console.error('Error final extraction:', error)
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

        if (onProgress) {
            onProgress({
                current: i + 1,
                total: imageFiles.length,
                fileName: file.name
            })
        }

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

        // 1 segundo de pausa para orden (con tu clave pro no hay límites de velocidad)
        await sleep(1000)
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

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

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
