import React, { useEffect, useState } from 'react'
import { getReportes } from '../services/supabase'
import {
    downloadReporteTXT,
    downloadMultipleReportesTXT,
    downloadReporteConsolidado
} from '../services/reportGenerator'

const ExportManager = () => {
    const [reportes, setReportes] = useState([])
    const [loading, setLoading] = useState(true)
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
    const [selectedReportes, setSelectedReportes] = useState([])
    const [selectAll, setSelectAll] = useState(false)

    useEffect(() => {
        cargarReportes()
    }, [mesSeleccionado])

    const cargarReportes = async () => {
        setLoading(true)
        const { data } = await getReportes(getLastDayDate(mesSeleccionado))
        if (data) {
            // Añadir información de sucursal a cada reporte
            const reportesConSucursal = data.map(reporte => ({
                ...reporte,
                profesional: {
                    ...reporte.profesional,
                    sucursal: reporte.profesional?.sucursal || { nombre: 'Sin Sucursal' }
                }
            }))
            setReportes(reportesConSucursal)
        }
        setLoading(false)
        setSelectedReportes([])
        setSelectAll(false)
    }

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedReportes([])
        } else {
            setSelectedReportes(reportes.map(r => r.id))
        }
        setSelectAll(!selectAll)
    }

    const toggleSelectReporte = (reporteId) => {
        if (selectedReportes.includes(reporteId)) {
            setSelectedReportes(selectedReportes.filter(id => id !== reporteId))
            setSelectAll(false)
        } else {
            const newSelected = [...selectedReportes, reporteId]
            setSelectedReportes(newSelected)
            if (newSelected.length === reportes.length) {
                setSelectAll(true)
            }
        }
    }

    const handleExportIndividual = (reporte) => {
        downloadReporteTXT(reporte)
    }

    const handleExportSelected = () => {
        if (selectedReportes.length === 0) {
            alert('Selecciona al menos un reporte para exportar')
            return
        }

        const reportesAExportar = reportes.filter(r => selectedReportes.includes(r.id))
        downloadMultipleReportesTXT(reportesAExportar)
    }

    const handleExportConsolidado = () => {
        if (reportes.length === 0) {
            alert('No hay reportes para exportar')
            return
        }

        downloadReporteConsolidado(reportes, getLastDayDate(mesSeleccionado))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="spinner w-16 h-16 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando reportes...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8 fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-5xl font-black text-accent-red mb-2">Exportación de Reportes</h1>
                <p className="text-gray-400">
                    Genera archivos .txt individuales o consolidados para todos los profesionales
                </p>
            </div>

            {/* Filtros y Acciones */}
            <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">
                            Mes del Reporte
                        </label>
                        <input
                            type="month"
                            value={mesSeleccionado}
                            onChange={(e) => setMesSeleccionado(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={handleExportConsolidado}
                            disabled={reportes.length === 0}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            📊 Exportar Reporte Consolidado
                        </button>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            {reportes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card-stat">
                        <div className="stat-label">Total Reportes</div>
                        <div className="stat-number text-white">{reportes.length}</div>
                    </div>
                    <div className="card-stat">
                        <div className="stat-label">Seleccionados</div>
                        <div className="stat-number text-accent-red">{selectedReportes.length}</div>
                    </div>
                    <div className="card-stat">
                        <div className="stat-label">Total Ventas</div>
                        <div className="stat-number text-green-400 text-3xl">
                            ${reportes.reduce((sum, r) => sum + r.total_venta_bruta, 0).toLocaleString('es-CL')}
                        </div>
                    </div>
                </div>
            )}

            {/* Acciones Masivas */}
            {reportes.length > 0 && (
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={toggleSelectAll}
                                    className="w-5 h-5 rounded bg-dark-secondary border-gray-700 text-accent-red focus:ring-accent-red focus:ring-2"
                                />
                                <span className="font-bold text-white">Seleccionar Todos</span>
                            </label>
                            <span className="text-gray-400">
                                ({selectedReportes.length} de {reportes.length} seleccionados)
                            </span>
                        </div>

                        <button
                            onClick={handleExportSelected}
                            disabled={selectedReportes.length === 0}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            💾 Exportar Seleccionados ({selectedReportes.length})
                        </button>
                    </div>
                </div>
            )}

            {/* Tabla de Reportes */}
            {reportes.length > 0 ? (
                <div className="card">
                    <h3 className="text-2xl font-black text-white mb-6">
                        Reportes Disponibles para Exportación
                    </h3>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="w-12">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                            className="w-5 h-5 rounded bg-dark-secondary border-gray-700 text-accent-red focus:ring-accent-red"
                                        />
                                    </th>
                                    <th>Profesional</th>
                                    <th>Sucursal</th>
                                    <th>Total Ventas</th>
                                    <th>Comisión</th>
                                    <th>Servicios</th>
                                    <th className="text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportes.map(reporte => (
                                    <tr key={reporte.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedReportes.includes(reporte.id)}
                                                onChange={() => toggleSelectReporte(reporte.id)}
                                                className="w-5 h-5 rounded bg-dark-secondary border-gray-700 text-accent-red focus:ring-accent-red"
                                            />
                                        </td>
                                        <td className="font-bold text-white">
                                            {reporte.profesional?.nombre || 'N/A'}
                                        </td>
                                        <td className="text-blue-400">
                                            {reporte.profesional?.sucursal?.nombre || 'N/A'}
                                        </td>
                                        <td className="text-green-400 font-bold">
                                            ${reporte.total_venta_bruta?.toLocaleString('es-CL')}
                                        </td>
                                        <td className="text-accent-red font-bold">
                                            {reporte.comision_porcentaje}%
                                            <span className="text-gray-400 text-xs block">
                                                ${((reporte.total_venta_bruta * reporte.comision_porcentaje) / 100)?.toLocaleString('es-CL')}
                                            </span>
                                        </td>
                                        <td className="text-purple-400">
                                            {reporte.servicios?.length || 0} items
                                        </td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => handleExportIndividual(reporte)}
                                                className="btn-secondary py-2 px-4 text-sm"
                                            >
                                                📄 Exportar TXT
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="card text-center py-12">
                    <div className="text-6xl mb-4">📁</div>
                    <h3 className="text-2xl font-black text-white mb-2">
                        No hay reportes para exportar
                    </h3>
                    <p className="text-gray-400">
                        Selecciona una fecha diferente o carga nuevos reportes
                    </p>
                </div>
            )}

            {/* Información sobre el formato TXT */}
            <div className="card bg-dark-secondary border-accent-red/30">
                <h3 className="text-xl font-black text-white mb-4">
                    ℹ️ Información sobre Archivos TXT
                </h3>
                <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-start gap-3">
                        <span className="text-accent-red font-bold">•</span>
                        <div>
                            <strong className="text-white">Reporte Individual:</strong> Genera un archivo .txt
                            por cada profesional con el detalle completo de servicios, ventas y comisiones.
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-accent-red font-bold">•</span>
                        <div>
                            <strong className="text-white">Reporte Consolidado:</strong> Genera un único archivo
                            .txt con el resumen de todos los profesionales agrupados por sucursal.
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-accent-red font-bold">•</span>
                        <div>
                            <strong className="text-white">Formato:</strong> Los archivos incluyen header con
                            información del profesional, body con detalle de servicios y footer con resumen financiero.
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-accent-red font-bold">•</span>
                        <div>
                            <strong className="text-white">Múltiples Descargas:</strong> Al exportar varios
                            reportes, se descargarán múltiples archivos con un pequeño delay entre cada uno.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExportManager
