import { createClient } from '@supabase/supabase-js'

// =============================================
// SUPABASE CONFIGURATION
// =============================================
// INSTRUCCIONES:
// 1. Crear un proyecto en https://supabase.com
// 2. Ir a Settings > API
// 3. Copiar "Project URL" y "anon/public key"
// 4. Reemplazar los valores abajo
// 5. Ejecutar el schema.sql en SQL Editor de Supabase

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)

// =============================================
// FUNCIONES DE BASE DE DATOS
// =============================================

// Obtener todas las sucursales
export const getSucursales = async () => {
    try {
        const { data, error } = await supabase
            .from('sucursales')
            .select('*')
            .order('nombre')

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error al obtener sucursales:', error)
        return { data: null, error }
    }
}

// Obtener todos los profesionales con su sucursal
export const getProfesionales = async () => {
    try {
        const { data, error } = await supabase
            .from('profesionales')
            .select(`
        *,
        sucursal:sucursales(*)
      `)
            .order('nombre')

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error al obtener profesionales:', error)
        return { data: null, error }
    }
}

// Crear o encontrar profesional
export const upsertProfesional = async (nombre, sucursalId) => {
    try {
        const { data, error } = await supabase
            .from('profesionales')
            .upsert(
                { nombre, sucursal_id: sucursalId },
                { onConflict: 'nombre,sucursal_id' }
            )
            .select()
            .single()

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error al crear profesional:', error)
        return { data: null, error }
    }
}

// Crear o actualizar reporte mensual (evita duplicados por mes)
export const createReporteMensual = async (reporteData) => {
    try {
        // Verificar si ya existe un reporte para este profesional en este mes exacto
        const { data: existing } = await supabase
            .from('reportes_mensuales')
            .select('id')
            .eq('profesional_id', reporteData.profesional_id)
            .eq('fecha_reporte', reporteData.fecha_reporte)
            .maybeSingle()

        if (existing) {
            // Si ya existe, actualizamos el actual (evita sumas dobles)
            const { data, error } = await supabase
                .from('reportes_mensuales')
                .update(reporteData)
                .eq('id', existing.id)
                .select()
                .single()

            if (error) throw error
            // También deberíamos limpiar servicios antiguos si los vamos a reemplazar, 
            // pero para simplicidad y seguridad aquí devolvemos el reporte.
            return { data, error: null, isUpdate: true }
        }

        // Si no existe, insertamos normal
        const { data, error } = await supabase
            .from('reportes_mensuales')
            .insert(reporteData)
            .select()
            .single()

        if (error) throw error
        return { data, error: null, isUpdate: false }
    } catch (error) {
        console.error('Error al manejar el reporte mensual:', error)
        return { data: null, error }
    }
}

// Crear servicios de un reporte
export const createServiciosReporte = async (servicios) => {
    try {
        const { data, error } = await supabase
            .from('servicios_reporte')
            .insert(servicios)
            .select()

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error al crear servicios:', error)
        return { data: null, error }
    }
}

// Obtener reportes con relaciones por mes (YYYY-MM)
export const getReportes = async (mesAno = null) => {
    try {
        let query = supabase
            .from('reportes_mensuales')
            .select(`
                *,
                profesional:profesionales(
                    *,
                    sucursal:sucursales(*)
                ),
                servicios:servicios_reporte(*)
            `)
            .order('fecha_reporte', { ascending: false })

        if (mesAno) {
            const [year, month] = mesAno.split('-').map(Number)
            const firstDay = `${mesAno}-01`
            const lastDay = new Date(year, month, 0).getDate()
            const lastDayStr = `${mesAno}-${String(lastDay).padStart(2, '0')}`

            query = query.gte('fecha_reporte', firstDay).lte('fecha_reporte', lastDayStr)
        }

        const { data, error } = await query

        if (error || !data) {
            const localData = JSON.parse(localStorage.getItem('demo_reportes') || '[]')
            if (mesAno) {
                return {
                    data: localData.filter(r => r.fecha_reporte.startsWith(mesAno)),
                    error: null
                }
            }
            return { data: localData, error: null }
        }

        return { data, error: null }
    } catch (error) {
        const localData = JSON.parse(localStorage.getItem('demo_reportes') || '[]')
        return { data: localData, error: null }
    }
}

// Eliminar reporte (CASCADE eliminará servicios asociados)
export const deleteReporte = async (reporteId) => {
    try {
        const { error } = await supabase
            .from('reportes_mensuales')
            .delete()
            .eq('id', reporteId)

        if (error) throw error
        return { error: null }
    } catch (error) {
        console.error('Error al eliminar reporte:', error)
        return { error }
    }
}

// Subir imagen a Supabase Storage
export const uploadImage = async (file, fileName) => {
    try {
        const { data, error } = await supabase.storage
            .from('reportes')
            .upload(`${Date.now()}_${fileName}`, file)

        if (error) throw error

        // Obtener URL pública
        const { data: urlData } = supabase.storage
            .from('reportes')
            .getPublicUrl(data.path)

        return { url: urlData.publicUrl, error: null }
    } catch (error) {
        console.error('Error al subir imagen:', error)
        return { url: null, error }
    }
}

// Obtener estadísticas para dashboard por mes (YYYY-MM)
export const getEstadisticas = async (mesAno) => {
    try {
        const [year, month] = mesAno.split('-').map(Number)
        const firstDay = `${mesAno}-01`
        const lastDay = new Date(year, month, 0).getDate()
        const lastDayStr = `${mesAno}-${String(lastDay).padStart(2, '0')}`

        const { data, error } = await supabase
            .from('reportes_mensuales')
            .select(`
                total_venta_bruta,
                pago_neto,
                profesional:profesionales(
                    nombre,
                    sucursal:sucursales(nombre)
                ),
                servicios:servicios_reporte(
                    nombre_servicio,
                    cantidad,
                    subtotal
                )
            `)
            .gte('fecha_reporte', firstDay)
            .lte('fecha_reporte', lastDayStr)

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error al obtener estadísticas:', error)
        return { data: null, error }
    }
}
