import React, { useEffect, useState } from 'react'
import { getReportes, deleteReporte } from '../services/supabase'

const ReportesManager = ({ refreshTrigger }) => {
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
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    useEffect(() => {
        cargarReportes()
    }, [mesSeleccionado, refreshTrigger])

    const cargarReportes = async () => {
        setLoading(true)
        const { data } = await getReportes(mesSeleccionado)
        if (data) {
            setReportes(data)
        }
        setLoading(false)
    }

    const handleDelete = async (reporte) => {
        setReporteSeleccionado(reporte)
        setShowDeleteModal(true)
    }

    const confirmarEliminacion = async () => {
        if (!reporteSeleccionado) return

        const { error } = await deleteReporte(reporteSeleccionado.id)

        if (error) {
            alert('Error al eliminar el reporte: ' + error.message)
        } else {
            alert('Reporte eliminado correctamente (incluidos servicios asociados)')
            cargarReportes()
        }

        setShowDeleteModal(false)
        setReporteSeleccionado(null)
    }

    const viewDetails = (reporte) => {
        setReporteSeleccionado(reporte)
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
                <h1 className="text-5xl font-black text-accent-red mb-2">Gestión de Reportes</h1>
                <p className="text-gray-400">
                    Administra, visualiza y elimina reportes procesados (CRUD)
                </p>
            </div>

            {/* Filtros */}
            <div className="card">
                <div className="flex items-center justify-between">
                    <div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">
                                Filtrar por Mes
                            </label>
                            <input
                                type="month"
                                value={mesSeleccionado}
                                onChange={(e) => setMesSeleccionado(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="stat-number text-white">{reportes.length}</div>
                        <div className="stat-label">Reportes Encontrados</div>
                    </div>
                </div>
            </div>

            {/* Tabla de Reportes */}
            {reportes.length > 0 ? (
                <div className="card">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Profesional</th>
                                    <th>Sucursal</th>
                                    <th>Total Ventas</th>
                                    <th>Comisión %</th>
                                    <th>Fecha</th>
                                    <th>Servicios</th>
                                    <th>Estado</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportes.map(reporte => (
                                    <tr key={reporte.id}>
                                        <td className="font-mono text-xs text-gray-500">
                                            {reporte.id.substring(0, 8)}...
                                        </td>
                                        <td className="font-bold text-white">
                                            {reporte.profesional?.nombre || 'N/A'}
                                        </td>
                                        <td className="text-blue-400">
                                            {reporte.profesional?.sucursal?.nombre || 'N/A'}
                                        </td>
                                        <td className="text-green-400 font-bold">
                                            ${reporte.total_venta_bruta?.toLocaleString('es-CL') || 0}
                                        </td>
                                        <td className="text-accent-red font-bold">
                                            {reporte.comision_porcentaje}%
                                        </td>
                                        <td className="text-gray-400">
                                            {new Date(reporte.fecha_reporte).toLocaleDateString('es-CL')}
                                        </td>
                                        <td className="text-purple-400">
                                            {reporte.servicios?.length || 0} items
                                        </td>
                                        <td>
                                            <span className="badge-success">
                                                {reporte.estado || 'procesado'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => viewDetails(reporte)}
                                                    className="btn-secondary py-2 px-3 text-xs"
                                                    title="Ver Detalles"
                                                >
                                                    👁️ Ver
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(reporte)}
                                                    className="btn-danger py-2 px-3 text-xs"
                                                    title="Eliminar"
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="card text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-2xl font-black text-white mb-2">
                        No hay reportes para la fecha seleccionada
                    </h3>
                    <p className="text-gray-400">
                        Cambia la fecha o carga nuevos reportes
                    </p>
                </div>
            )}

            {/* Modal de Detalles */}
            {reporteSeleccionado && !showDeleteModal && (
                <div className="modal-overlay" onClick={() => setReporteSeleccionado(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-black text-white">Detalle del Reporte</h2>
                            <button
                                onClick={() => setReporteSeleccionado(null)}
                                className="btn-icon text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Información del Profesional */}
                        <div className="card mb-6 bg-dark-secondary">
                            <h3 className="text-xl font-black text-white mb-4">
                                Información del Profesional
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-400">Nombre</div>
                                    <div className="text-lg font-bold text-white">
                                        {reporteSeleccionado.profesional?.nombre}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Sucursal</div>
                                    <div className="text-lg font-bold text-blue-400">
                                        {reporteSeleccionado.profesional?.sucursal?.nombre}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Fecha de Reporte</div>
                                    <div className="text-lg font-bold text-white">
                                        {new Date(reporteSeleccionado.fecha_reporte).toLocaleDateString('es-CL')}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Estado</div>
                                    <div>
                                        <span className="badge-success">
                                            {reporteSeleccionado.estado}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resumen Financiero */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="card bg-green-900/20 border-green-700">
                                <div className="stat-label">Total Ventas</div>
                                <div className="stat-number text-green-400 text-3xl">
                                    ${reporteSeleccionado.total_venta_bruta?.toLocaleString('es-CL')}
                                </div>
                            </div>
                            <div className="card bg-red-900/20 border-red-700">
                                <div className="stat-label">Comisión ({reporteSeleccionado.comision_porcentaje}%)</div>
                                <div className="stat-number text-accent-red text-3xl">
                                    ${((reporteSeleccionado.total_venta_bruta * reporteSeleccionado.comision_porcentaje) / 100)?.toLocaleString('es-CL')}
                                </div>
                            </div>
                        </div>

                        {/* Servicios */}
                        <div className="card bg-dark-secondary">
                            <h3 className="text-xl font-black text-white mb-4">
                                Servicios y Tratamientos ({reporteSeleccionado.servicios?.length || 0})
                            </h3>
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Servicio</th>
                                            <th>Cantidad</th>
                                            <th>Precio Unitario</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reporteSeleccionado.servicios?.map((servicio, index) => (
                                            <tr key={index}>
                                                <td className="font-bold text-white">{servicio.nombre_servicio}</td>
                                                <td className="text-blue-400">{servicio.cantidad}</td>
                                                <td className="text-green-400">
                                                    ${servicio.precio_unitario?.toLocaleString('es-CL')}
                                                </td>
                                                <td className="text-yellow-400 font-bold">
                                                    ${servicio.subtotal?.toLocaleString('es-CL')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Imagen */}
                        {reporteSeleccionado.imagen_url && (
                            <div className="card bg-dark-secondary mt-6">
                                <h3 className="text-xl font-black text-white mb-4">Imagen Original</h3>
                                <img
                                    src={reporteSeleccionado.imagen_url}
                                    alt="Reporte Original"
                                    className="w-full rounded-lg border border-gray-700"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal de Confirmación de Eliminación */}
            {showDeleteModal && reporteSeleccionado && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h2 className="text-3xl font-black text-white mb-4">
                                ¿Confirmar Eliminación?
                            </h2>
                            <p className="text-gray-400 mb-6">
                                Estás a punto de eliminar el reporte de <strong className="text-white">
                                    {reporteSeleccionado.profesional?.nombre}
                                </strong>. Esta acción también eliminará todos los servicios asociados
                                y <strong className="text-accent-red">no se puede deshacer</strong>.
                            </p>

                            <div className="bg-dark-secondary p-4 rounded-lg mb-6">
                                <div className="text-sm text-gray-400 mb-2">Datos a eliminar:</div>
                                <div className="text-left space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Total Ventas:</span>
                                        <span className="text-white font-bold">
                                            ${reporteSeleccionado.total_venta_bruta?.toLocaleString('es-CL')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Servicios:</span>
                                        <span className="text-white font-bold">
                                            {reporteSeleccionado.servicios?.length || 0} items
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Fecha:</span>
                                        <span className="text-white font-bold">
                                            {new Date(reporteSeleccionado.fecha_reporte).toLocaleDateString('es-CL')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="btn-secondary flex-1"
                                >
                                    ❌ Cancelar
                                </button>
                                <button
                                    onClick={confirmarEliminacion}
                                    className="btn-danger flex-1"
                                >
                                    🗑️ Eliminar Definitivamente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReportesManager
