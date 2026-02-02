import React, { useState } from 'react'
import { supabase } from '../services/supabase'

const SyncData = () => {
    const [syncing, setSyncing] = useState(false)
    const [progress, setProgress] = useState('')
    const [status, setStatus] = useState(null)

    const syncToSupabase = async () => {
        setSyncing(true)
        setStatus(null)
        setProgress('Buscando datos en tu computadora...')

        try {
            // 1. Obtener datos de LocalStorage (donde están atrapados)
            const localData = JSON.parse(localStorage.getItem('demo_reportes') || '[]')

            if (localData.length === 0) {
                setStatus({ success: false, message: 'No encontré datos guardados localmente en esta computadora.' })
                setSyncing(false)
                return
            }

            setProgress(`Encontrados ${localData.length} reportes. Iniciando sincronización...`)

            // 2. Obtener sucursales oficiales para mapear correctamente
            const { data: sucursales } = await supabase.from('sucursales').select('*')

            let successCount = 0
            let errorCount = 0

            for (const localR of localData) {
                try {
                    // Buscar sucursal por nombre para obtener el UUID real
                    const sucursalNombre = localR.profesional?.sucursal?.nombre
                    const sucursalOficial = sucursales.find(s => s.nombre === sucursalNombre)

                    if (!sucursalOficial) {
                        console.warn(`Sucursal ${sucursalNombre} no existe en Supabase. Saltando...`)
                        errorCount++
                        continue
                    }

                    // A. Crear o encontrar profesional en Supabase
                    const { data: profData, error: profError } = await supabase
                        .from('profesionales')
                        .upsert(
                            { nombre: localR.profesional.nombre, sucursal_id: sucursalOficial.id },
                            { onConflict: 'nombre,sucursal_id' }
                        )
                        .select()
                        .single()

                    if (profError) throw profError

                    // B. Crear reporte mensual
                    const { data: repoData, error: repoError } = await supabase
                        .from('reportes_mensuales')
                        .insert({
                            profesional_id: profData.id,
                            fecha_reporte: localR.fecha_reporte,
                            total_venta_bruta: Math.round(localR.total_venta_bruta),
                            comision_porcentaje: localR.comision_porcentaje,
                            pago_neto: Math.round(localR.pago_neto),
                            estado: 'procesado'
                        })
                        .select()
                        .single()

                    if (repoError) throw repoError

                    // C. Crear servicios vinculados
                    if (localR.servicios && localR.servicios.length > 0) {
                        const serviciosData = localR.servicios.map(s => ({
                            reporte_id: repoData.id,
                            nombre_servicio: s.nombre_servicio,
                            cantidad: s.cantidad,
                            precio_unitario: Math.round(s.precio_unitario || 0),
                            subtotal: Math.round(s.subtotal)
                        }))

                        const { error: servError } = await supabase
                            .from('servicios_reporte')
                            .insert(serviciosData)

                        if (servError) throw servError
                    }

                    successCount++
                    setProgress(`Sincronizado ${successCount} de ${localData.length}...`)
                } catch (err) {
                    console.error('Error sincronizando item:', err)
                    errorCount++
                }
            }

            setStatus({
                success: true,
                message: `¡Éxito! Se han subido ${successCount} reportes a la nube. ${errorCount > 0 ? `(Fallaron ${errorCount})` : ''}`
            })

            // OPCIONAL: Limpiar LocalStorage después de sincronizar satisfactoriamente
            // localStorage.removeItem('demo_reportes')

        } catch (error) {
            console.error('Error general de sincronización:', error)
            setStatus({ success: false, message: 'Error crítico al conectar con la base de datos.' })
        }

        setSyncing(false)
    }

    return (
        <div className="p-8 space-y-8 fade-in">
            <div className="mb-8">
                <h1 className="text-5xl font-black text-accent-red mb-2">Sincronizador de Datos</h1>
                <p className="text-gray-400">
                    Herramienta para subir reportes guardados en esta PC a la base de datos oficial en internet.
                </p>
            </div>

            <div className="card text-center p-12">
                <div className="text-6xl mb-6">☁️</div>
                <h3 className="text-2xl font-black text-white mb-4">
                    Subir datos locales a la Nube
                </h3>
                <p className="text-gray-400 max-w-lg mx-auto mb-8">
                    Usa este botón si ingresaste datos en <code className="text-accent-red">localhost</code> o si aparecía el mensaje "Modo Demo" y ahora quieres verlos en internet.
                </p>

                {syncing ? (
                    <div className="space-y-4">
                        <div className="spinner w-12 h-12 mx-auto"></div>
                        <p className="text-accent-red font-bold animate-pulse">{progress}</p>
                    </div>
                ) : (
                    <button
                        onClick={syncToSupabase}
                        className="btn-primary px-12 py-4 text-lg"
                    >
                        🚀 Iniciar Sincronización Ahora
                    </button>
                )}

                {status && (
                    <div className={`mt-8 p-4 rounded-lg border ${status.success ? 'bg-green-900/30 border-green-700 text-green-400' : 'bg-red-900/30 border-red-700 text-red-400'}`}>
                        {status.message}
                    </div>
                )}
            </div>

            <div className="card bg-dark-secondary border-gray-800">
                <h4 className="text-white font-black mb-3 text-sm uppercase">¿Cómo funciona?</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                    <li>1. Esta herramienta busca en la memoria de este navegador.</li>
                    <li>2. Copia profesional por profesional, reporte por reporte.</li>
                    <li>3. Los inyecta directamente en la base de datos oficial (Supabase).</li>
                    <li>4. Una vez terminado, los datos aparecerán en tu página de Netlify.</li>
                </ul>
            </div>
        </div>
    )
}

export default SyncData
