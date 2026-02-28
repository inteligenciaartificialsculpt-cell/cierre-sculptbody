import { GoogleGenerativeAI } from '@google/generative-ai'

// =============================================
// MOTOR DE IA - VERSIÓN 2.2 (ENGINE 2026)
// =============================================
// CLAVE PRO INYECTADA PARA MÁXIMA POTENCIA
const API_KEY = 'AIzaSyAE5ieFQRNmOFbHSquscbceusgXcfcx6_Y'
const genAI = new GoogleGenerativeAI(API_KEY)

// Canales vigentes hoy (Febrero 2026)
// Se eliminan modelos 1.5 retirados por Google
const MASTER_CHANNELS = [
    { model: 'gemini-2.0-flash', apiVersion: 'v1' },
    { model: 'gemini-2.0-flash-001', apiVersion: 'v1' },
    { model: 'gemini-2.0-pro-exp-02-05', apiVersion: 'v1' },
    { model: 'gemini-2.0-flash-lite-preview-02-05', apiVersion: 'v1' }
]

const EXTRACTION_PROMPT = `
Eres un asistente experto en análisis de reportes de ventas para centros estéticos en CHILE.

INSTRUCCIONES DE MONEDA (CLP):
1. Los montos están en PESOS CHILENOS (CLP).
2. IMPORTANTE: El punto (.) en los reportes suele ser un SEPARADOR DE MILES (ej: 11.930.000 es 11 millones).
3. NO trunques los números. Si ves "11.930.000", el valor numérico es 11930000.

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
  "total_venta": número entero (CLP),
  "fecha_reporte": "YYYY-MM-DD",
  "notas": null
}
`

export const extractDataFromImage = async (imageFile) => {
    try {
        const imageBase64 = await fileToBase64(imageFile)
        const imageParts = [{
            inlineData: {
                data: imageBase64.split(',')[1],
                mimeType: imageFile.type
            }
        }]

        let lastError = null

        // Motor de Resiliencia Industrial
        for (const channel of MASTER_CHANNELS) {
            try {
                console.log(`[AI-MASTER-2026] Intentando conexión vía ${channel.model}...`)
                const modelInstance = genAI.getGenerativeModel({ model: channel.model }, { apiVersion: channel.apiVersion })

                const result = await modelInstance.generateContent([EXTRACTION_PROMPT, ...imageParts])
                const response = await result.response
                const text = response.text()

                let jsonData
                try {
                    jsonData = JSON.parse(text)
                } catch (e) {
                    const jsonMatch = text.match(/\{[\s\S]*\}/)
                    if (jsonMatch) {
                        jsonData = JSON.parse(jsonMatch[0])
                    } else {
                        throw new Error('Formato JSON no detectado')
                    }
                }

                return { success: true, data: jsonData, error: null }
            } catch (error) {
                console.warn(`[AI-MASTER-2026] Canal ${channel.model} no disponible:`, error.message)
                lastError = error
                // Pequeña espera para no saturar el handshake
                await new Promise(r => setTimeout(r, 600))
            }
        }

        throw new Error(`Google AI ha retirado el soporte para modelos antiguos. Detalle: ${lastError?.message}`)

    } catch (error) {
        console.error('CRITICAL ENGINE ERROR:', error)
        return { success: false, data: null, error: error.message }
    }
}

export const extractDataFromMultipleImages = async (imageFiles, onProgress = null) => {
    const results = []
    let successCount = 0
    let failCount = 0

    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        if (onProgress) onProgress({ current: i + 1, total: imageFiles.length, fileName: file.name })

        const result = await extractDataFromImage(file)
        results.push({ fileName: file.name, file: file, ...result })

        if (result.success) successCount++
        else failCount++

        await sleep(1000)
    }

    return {
        results,
        summary: { total: imageFiles.length, success: successCount, failed: failCount }
    }
}

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
    if (!validTypes.includes(file.type)) return { valid: false, error: 'Formato inválido.' }
    if (file.size > 10 * 1024 * 1024) return { valid: false, error: 'Imagen muy grande (Máx 10MB).' }
    return { valid: true, error: null }
}
