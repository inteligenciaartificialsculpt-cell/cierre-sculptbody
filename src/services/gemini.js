import { GoogleGenerativeAI } from '@google/generative-ai'

// =============================================
// MOTOR DE IA - VERSIÓN MAESTRA 2.1 (ESTABLE)
// =============================================
// Inyectamos la clave directamente para evitar fallos de entorno
const API_KEY = 'AIzaSyAE5ieFQRNmOFbHSquscbceusgXcfcx6_Y'
const genAI = new GoogleGenerativeAI(API_KEY)

// Usamos únicamente modelos estables v1 para evitar 404 regionales
const STABLE_CHANNELS = [
    { model: 'gemini-1.5-flash', apiVersion: 'v1' },
    { model: 'gemini-1.5-pro', apiVersion: 'v1' }
]

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

        // Rotación de canales estables
        for (const channel of STABLE_CHANNELS) {
            try {
                console.log(`[AI-MASTER] Conectando a ${channel.model} (v1 Stable)...`)
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
                        throw new Error('Formato de datos irreconocible')
                    }
                }

                return { success: true, data: jsonData, error: null }
            } catch (error) {
                console.error(`[AI-MASTER] Error en canal ${channel.model}:`, error.message)
                lastError = error
                continue
            }
        }

        throw new Error(`Google AI no disponible temporalmente. Intente nuevamente en unos segundos. Detalle: ${lastError?.message}`)

    } catch (error) {
        return { success: false, data: null, error: error.message }
    }
}

const EXTRACTION_PROMPT = `Analiza este reporte de ventas estéticas en Chile (CLP). Extrae profesional, servicios, cantidades, precios unitarios y total en JSON puro: { "nombre_profesional": "", "servicios": [{ "nombre": "", "cantidad": 0, "precio_unitario": 0, "subtotal": 0 }], "total_venta": 0 }`

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

        await sleep(500) // Pausa mínima para fluidez
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
    if (file.size > 10 * 1024 * 1024) return { valid: false, error: 'Imagen muy grande.' }
    return { valid: true, error: null }
}
