import React, { useState, useRef } from 'react'
import { extractDataFromMultipleImages, validateImageFile } from '../services/gemini'
import { getSucursales, upsertProfesional, createReporteMensual, createServiciosReporte, uploadImage } from '../services/supabase'

const BulkUpload = ({ onSuccess }) => {
    const [files, setFiles] = useState([])
    const [dragActive, setDragActive] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState({ current: 0, total: 0, fileName: '' })
    const [results, setResults] = useState([])
    const [sucursales, setSucursales] = useState([])
    const [selectedSucursal, setSelectedSucursal] = useState('')
    const getInitialDate = () => {
        const d = new Date()
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const lastDay = new Date(year, d.getMonth() + 1, 0).getDate()
        return `${year}-${month}-${String(lastDay).padStart(2, '0')}`
    }

    const getInitialMonth = () => {
        const d = new Date()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    }

    const [mesSeleccionado, setMesSeleccionado] = useState(getInitialMonth())

    // Función para obtener el último día de un mes (YYYY-MM)
    const getLastDayDate = (yearMonth) => {
        const [year, month] = yearMonth.split('-').map(Number)
        const lastDay = new Date(year, month, 0).getDate()
        return `${yearMonth}-${String(lastDay).padStart(2, '0')}`
    }
    const fileInputRef = useRef(null)

    // Sucursales de respaldo para modo Demo/Offline
    const fallbackSucursales = [
        { id: 'suc-1', nombre: 'San Miguel', comision_porcentaje: 2.0 },
        { id: 'suc-2', nombre: 'Las Condes', comision_porcentaje: 2.0 },
        { id: 'suc-3', nombre: 'La Dehesa', comision_porcentaje: 2.0 },
        { id: 'suc-4', nombre: 'Antofagasta', comision_porcentaje: 2.0 },
        { id: 'suc-5', nombre: 'Hendaya', comision_porcentaje: 2.5 },
    ]

    React.useEffect(() => {
        cargarSucursales()
    }, [])

    const cargarSucursales = async () => {
        const { data, error } = await getSucursales()
        if (data && data.length > 0) {
            setSucursales(data)
            setSelectedSucursal(data[0].id)
        } else {
            console.warn('Usando sucursales de respaldo debido a error en Supabase:', error)
            setSucursales(fallbackSucursales)
            setSelectedSucursal(fallbackSucursales[0].id)
        }
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const droppedFiles = Array.from(e.dataTransfer.files)
        agregarArchivos(droppedFiles)
    }

    const handleFileInput = (e) => {
        const selectedFiles = Array.from(e.target.files)
        agregarArchivos(selectedFiles)
    }

    const agregarArchivos = (newFiles) => {
        const validFiles = newFiles.filter(file => {
            const validation = validateImageFile(file)
            if (!validation.valid) {
                alert(`${file.name}: ${validation.error}`)
                return false
            }
            return true
        })

        setFiles(prevFiles => [...prevFiles, ...validFiles])
    }

    const removeFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
    }

    const procesarArchivos = async () => {
        if (files.length === 0) {
            alert('No hay archivos para procesar')
            return
        }

        if (!selectedSucursal) {
            alert('Debe seleccionar una sucursal')
            return
        }

        setProcessing(true)
        setResults([])

        // Extraer datos con IA
        const extractionResult = await extractDataFromMultipleImages(
            files,
            (progressInfo) => {
                setProgress(progressInfo)
            }
        )

        // Guardar en base de datos
        const savedResults = []
        for (const result of extractionResult.results) {
            if (result.success) {
                try {
                    // Si estamos en modo DEMO (sucursal temporal), guardamos en local y mostramos
                    if (selectedSucursal.startsWith('suc-')) {
                        const tempReporte = {
                            id: Math.random().toString(36).substr(2, 9),
                            profesional_id: 'demo-prof-' + Math.random().toString(36).substr(2, 5),
                            fecha_reporte: result.data.fecha_reporte || getLastDayDate(mesSeleccionado),
                            total_venta_bruta: result.data.total_venta,
                            comision_porcentaje: sucursales.find(s => s.id === selectedSucursal).comision_porcentaje,
                            pago_neto: result.data.total_venta * (1 - sucursales.find(s => s.id === selectedSucursal).comision_porcentaje / 100),
                            estado: 'demo',
                            profesional: {
                                nombre: result.data.nombre_profesional,
                                sucursal: sucursales.find(s => s.id === selectedSucursal)
                            },
                            servicios: result.data.servicios.map(s => ({
                                nombre_servicio: s.nombre,
                                cantidad: s.cantidad,
                                precio_unitario: s.precio_unitario,
                                subtotal: s.subtotal
                            }))
                        }

                        const currentLocal = JSON.parse(localStorage.getItem('demo_reportes') || '[]')
                        localStorage.setItem('demo_reportes', JSON.stringify([tempReporte, ...currentLocal]))

                        savedResults.push({
                            fileName: result.fileName,
                            success: true,
                            profesional: result.data.nombre_profesional,
                            total: result.data.total_venta,
                            isDemo: true
                        })
                        continue
                    }

                    // Subir imagen
                    const { url: imageUrl } = await uploadImage(result.file, result.fileName)

                    // Crear/obtener profesional
                    const { data: profesional } = await upsertProfesional(
                        result.data.nombre_profesional,
                        selectedSucursal
                    )

                    if (!profesional) {
                        throw new Error('No se pudo crear el profesional')
                    }

                    // Obtener comisión de la sucursal
                    const sucursal = sucursales.find(s => s.id === selectedSucursal)
                    const comisionPorcentaje = sucursal?.comision_porcentaje || 2.0

                    // Calcular pago neto
                    const totalVenta = result.data.total_venta
                    const pagoNeto = totalVenta - (totalVenta * (comisionPorcentaje / 100))

                    // Crear reporte
                    const { data: reporte } = await createReporteMensual({
                        profesional_id: profesional.id,
                        fecha_reporte: result.data.fecha_reporte || getLastDayDate(mesSeleccionado),
                        total_venta_bruta: totalVenta,
                        comision_porcentaje: comisionPorcentaje,
                        pago_neto: pagoNeto,
                        imagen_url: imageUrl,
                        estado: 'procesado'
                    })

                    if (!reporte) {
                        throw new Error('No se pudo crear el reporte')
                    }

                    // Crear servicios
                    const serviciosData = result.data.servicios.map(servicio => ({
                        reporte_id: reporte.id,
                        nombre_servicio: servicio.nombre,
                        cantidad: servicio.cantidad,
                        precio_unitario: servicio.precio_unitario,
                        subtotal: servicio.subtotal
                    }))

                    await createServiciosReporte(serviciosData)

                    savedResults.push({
                        fileName: result.fileName,
                        success: true,
                        profesional: result.data.nombre_profesional,
                        total: totalVenta
                    })
                } catch (error) {
                    savedResults.push({
                        fileName: result.fileName,
                        success: false,
                        error: error.message
                    })
                }
            } else {
                savedResults.push({
                    fileName: result.fileName,
                    success: false,
                    error: result.error
                })
            }
        }

        setResults(savedResults)
        setProcessing(false)
        setProgress({ current: 0, total: 0, fileName: '' })

        // Notificar éxito
        if (onSuccess) {
            onSuccess()
        }
    }

    return (
        <div className="p-8 space-y-8 fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-5xl font-black text-accent-red mb-2">Carga Masiva de Reportes</h1>
                <p className="text-gray-400">
                    Sube imágenes de reportes de ventas para procesamiento automático con IA
                </p>
                {selectedSucursal?.startsWith('suc-') && (
                    <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                        <p className="text-yellow-400 font-bold">
                            ⚠️ MODO DEMO ACTIVO: No se detectaron sucursales en Supabase.
                            Los datos se guardarán localmente en este navegador.
                        </p>
                    </div>
                )}
            </div>

            {/* Configuración */}
            <div className="card">
                <h3 className="text-2xl font-black text-white mb-6">Configuración</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">
                            Sucursal
                        </label>
                        <select
                            value={selectedSucursal}
                            onChange={(e) => setSelectedSucursal(e.target.value)}
                            className="select-field"
                            disabled={processing}
                        >
                            <option value="">Seleccione una sucursal</option>
                            {sucursales.map(sucursal => (
                                <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.nombre} - Comisión: {sucursal.comision_porcentaje}%
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">
                            Mes del Reporte
                        </label>
                        <input
                            type="month"
                            value={mesSeleccionado}
                            onChange={(e) => setMesSeleccionado(e.target.value)}
                            className="input-field"
                            disabled={processing}
                        />
                    </div>
                </div>
            </div>

            {/* Zona de Drop */}
            <div
                className={`file-upload-zone ${dragActive ? 'drag-over' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !processing && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={processing}
                />

                <div className="text-6xl mb-4">📤</div>
                <h3 className="text-2xl font-black text-white mb-2">
                    Arrastra archivos aquí o haz clic para seleccionar
                </h3>
                <p className="text-gray-400 mb-4">
                    Formatos admitidos: JPG, PNG, WEBP (máx. 10MB por archivo)
                </p>
                <p className="text-sm text-gray-500">
                    Cada imagen = 1 Profesional
                </p>
            </div>

            {/* Lista de Archivos */}
            {files.length > 0 && (
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-black text-white">
                            Archivos Seleccionados ({files.length})
                        </h3>
                        {!processing && (
                            <button
                                onClick={() => setFiles([])}
                                className="btn-secondary text-sm"
                            >
                                Limpiar Todo
                            </button>
                        )}
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-dark-secondary rounded-lg border border-gray-800"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">📄</span>
                                    <div>
                                        <div className="font-bold text-white">{file.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </div>
                                    </div>
                                </div>
                                {!processing && (
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="btn-danger"
                                    >
                                        ✕ Eliminar
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Botón de Procesar */}
                    <div className="mt-6">
                        <button
                            onClick={procesarArchivos}
                            disabled={processing || !selectedSucursal}
                            className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? '⏳ Procesando...' : '🚀 Procesar con IA'}
                        </button>
                    </div>
                </div>
            )}

            {/* Barra de Progreso */}
            {processing && progress.total > 0 && (
                <div className="card">
                    <h3 className="text-xl font-black text-white mb-4">Procesando Imágenes...</h3>
                    <div className="progress-bar mb-2">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                            {progress.current} de {progress.total}
                        </span>
                        <span className="text-white font-bold">{progress.fileName}</span>
                    </div>
                </div>
            )}

            {/* Resultados */}
            {results.length > 0 && (
                <div className="card">
                    <h3 className="text-2xl font-black text-white mb-6">Resultados del Procesamiento</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="card-stat bg-dark-secondary">
                            <div className="stat-label">Total Procesados</div>
                            <div className="stat-number text-white">{results.length}</div>
                        </div>
                        <div className="card-stat bg-green-900/20">
                            <div className="stat-label">Exitosos</div>
                            <div className="stat-number text-green-400">
                                {results.filter(r => r.success).length}
                            </div>
                        </div>
                        <div className="card-stat bg-red-900/20">
                            <div className="stat-label">Fallidos</div>
                            <div className="stat-number text-red-400">
                                {results.filter(r => !r.success).length}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border ${result.success
                                    ? 'bg-green-900/10 border-green-700'
                                    : 'bg-red-900/10 border-red-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">
                                            {result.success ? '✅' : '❌'}
                                        </span>
                                        <div>
                                            <div className="font-bold text-white">{result.fileName}</div>
                                            {result.success ? (
                                                <div className="text-sm text-green-400">
                                                    {result.profesional} - ${result.total?.toLocaleString('es-CL')}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-red-400">{result.error}</div>
                                            )}
                                        </div>
                                    </div>
                                    <span className={result.success ? 'badge-success' : 'badge-error'}>
                                        {result.success ? 'GUARDADO' : 'ERROR'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default BulkUpload
