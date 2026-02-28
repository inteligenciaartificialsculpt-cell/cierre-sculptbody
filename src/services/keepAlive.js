import { supabase } from './supabase'

/**
 * Servicio de Anti-hibernación (Keep-Alive)
 * Genera actividad legítima en la API de Supabase para evitar pausas en el plan gratuito.
 */
export const keepAliveService = {
    /**
     * Ejecuta un ping ligero a la base de datos.
     * Se recomienda llamar esto al iniciar la aplicación.
     */
    async ping() {
        const lastPingKey = 'supabase_last_keep_alive_ping'
        const now = Date.now()
        const dayInMs = 24 * 60 * 60 * 1000

        // Verificar si ya se hizo un ping en las últimas 12 horas para no saturar
        const lastPing = localStorage.getItem(lastPingKey)
        if (lastPing && (now - parseInt(lastPing)) < (dayInMs / 2)) {
            return { success: true, message: 'Skipped: Recent ping already exists' }
        }

        try {
            // Intentar insertar un registro en la tabla de logs
            const { error } = await supabase
                .from('_keep_alive')
                .insert([
                    { source: 'frontend_app', status: 'ping_ok' }
                ])

            if (error) {
                // Si la tabla no existe aún, hacemos un SELECT 1 como fallback
                const { error: fallbackError } = await supabase.rpc('version')
                if (fallbackError) throw fallbackError
            }

            localStorage.setItem(lastPingKey, now.toString())
            console.log('[Keep-Alive] Supabase activity heartbeat sent successfully.')
            return { success: true }
        } catch (error) {
            console.warn('[Keep-Alive] Heartbeat failed:', error.message)
            return { success: false, error: error.message }
        }
    }
}
