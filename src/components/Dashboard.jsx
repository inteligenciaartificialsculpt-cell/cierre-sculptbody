import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { getReportes, getEstadisticas } from '../services/supabase'

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const Dashboard = () => {
    const [loading, setLoading] = useState(true)
    const [reportes, setReportes] = useState([])
    const [stats, setStats] = useState({
        totalVentas: 0,
        totalComisiones: 0,
        totalPagosNetos: 0,
        totalProfesionales: 0,
        ventasPorSucursal: {},
        topServicios: []
    })

    const getInitialMonth = () => {
        const d = new Date()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    }

    const [mesSeleccionado, setMesSeleccionado] = useState(getInitialMonth())

    const getLastDayDate = (yearMonth) => {
        const [year, month] = yearMonth.split('-').map(Number)
        const lastDay = new Date(year, month, 0).getDate()
        return `${yearMonth}-${String(lastDay).padStart(2, '0')}`
    }

    useEffect(() => {
        cargarDatos()
    }, [mesSeleccionado])

    const cargarDatos = async () => {
        setLoading(true)
        const { data } = await getReportes(mesSeleccionado)

        if (data) {
            setReportes(data)
            calcularEstadisticas(data)
        }

        setLoading(false)
    }

    const calcularEstadisticas = (reportesData) => {
        // Estadísticas generales
        const totalVentas = reportesData.reduce((sum, r) => sum + Math.round(r.total_venta_bruta || 0), 0)
        const totalPagosNetos = reportesData.reduce((sum, r) => sum + Math.round(r.pago_neto || 0), 0)
        const totalComisiones = totalVentas - totalPagosNetos
        const totalProfesionales = reportesData.length

        // Ventas por sucursal
        const ventasPorSucursal = {}
        reportesData.forEach(reporte => {
            const sucursal = reporte.profesional?.sucursal?.nombre || 'Sin Sucursal'
            if (!ventasPorSucursal[sucursal]) {
                ventasPorSucursal[sucursal] = 0
            }
            ventasPorSucursal[sucursal] += Math.round(reporte.total_venta_bruta || 0)
        })

        // Top servicios
        const serviciosMap = {}
        reportesData.forEach(reporte => {
            reporte.servicios?.forEach(servicio => {
                if (!serviciosMap[servicio.nombre_servicio]) {
                    serviciosMap[servicio.nombre_servicio] = {
                        cantidad: 0,
                        total: 0
                    }
                }
                serviciosMap[servicio.nombre_servicio].cantidad += servicio.cantidad
                serviciosMap[servicio.nombre_servicio].total += Math.round(servicio.subtotal)
            })
        })

        const topServicios = Object.entries(serviciosMap)
            .map(([nombre, data]) => ({ nombre, ...data }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10)

        setStats({
            totalVentas,
            totalComisiones,
            totalPagosNetos,
            totalProfesionales,
            ventasPorSucursal,
            topServicios
        })
    }

    // Configuración de gráficos
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#1a1a1a',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#ff0033',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: (context) => {
                        return `$${context.parsed.y.toLocaleString('es-CL')}`
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#2a2a2a'
                },
                ticks: {
                    color: '#9ca3af',
                    callback: (value) => `$${value.toLocaleString('es-CL')}`
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#9ca3af',
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    }

    // Datos para gráfico de sucursales
    const sucursalesChartData = {
        labels: Object.keys(stats.ventasPorSucursal),
        datasets: [
            {
                label: 'Ventas',
                data: Object.values(stats.ventasPorSucursal),
                backgroundColor: '#ff0033',
                borderColor: '#cc0029',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: '#cc0029'
            }
        ]
    }

    // Datos para gráfico de servicios
    const serviciosChartData = {
        labels: stats.topServicios.map(s => s.nombre.substring(0, 20)),
        datasets: [
            {
                label: 'Ingresos',
                data: stats.topServicios.map(s => s.total),
                backgroundColor: '#ff0033',
                borderColor: '#cc0029',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: '#cc0029'
            }
        ]
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="spinner w-16 h-16 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8 fade-in">
            {/* Header y Selector de Mes */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-5xl font-black text-accent-red mb-2">Panel de Control</h1>
                    <p className="text-gray-400">Analítica de cierre mensual</p>
                </div>
                <div className="card py-3 px-6 flex items-center gap-4">
                    <label className="text-sm font-bold text-gray-400 whitespace-nowrap">Ver Período:</label>
                    <input
                        type="month"
                        value={mesSeleccionado}
                        onChange={(e) => setMesSeleccionado(e.target.value)}
                        className="input-field py-2"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card-stat">
                    <div className="stat-label">Total Ventas</div>
                    <div className="stat-number text-gradient">
                        ${stats.totalVentas.toLocaleString('es-CL')}
                    </div>
                    <div className="text-xs text-gray-500">Ingresos totales generados</div>
                </div>

                <div className="card-stat">
                    <div className="stat-label">Total Comisiones</div>
                    <div className="stat-number text-accent-red">
                        ${stats.totalComisiones.toLocaleString('es-CL')}
                    </div>
                    <div className="text-xs text-gray-500">2.0% - 2.5% según sucursal</div>
                </div>

                <div className="card-stat">
                    <div className="stat-label">Profesionales</div>
                    <div className="stat-number text-blue-400">
                        {stats.totalProfesionales}
                    </div>
                    <div className="text-xs text-gray-500">Reportes procesados</div>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Ventas por Sucursal */}
                <div className="card">
                    <h3 className="text-2xl font-black text-white mb-6">
                        Ventas por Sucursal
                    </h3>
                    <div className="h-80">
                        <Bar data={sucursalesChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Gráfico de Top Servicios */}
                <div className="card">
                    <h3 className="text-2xl font-black text-white mb-6">
                        Top 10 Servicios más Vendidos
                    </h3>
                    <div className="h-80">
                        <Bar data={serviciosChartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Tabla de Resumen por Sucursal */}
            <div className="card">
                <h3 className="text-2xl font-black text-white mb-6">
                    Resumen Detallado por Sucursal
                </h3>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Sucursal</th>
                                <th>Total Ventas</th>
                                <th>% Comisión</th>
                                <th>Total Comisiones</th>
                                <th>Profesionales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(stats.ventasPorSucursal).map(([sucursal, ventas]) => {
                                const reportesSucursal = reportes.filter(
                                    r => r.profesional?.sucursal?.nombre === sucursal
                                )
                                const comisionPorcentaje = reportesSucursal[0]?.comision_porcentaje || 0
                                const totalComision = ventas * (comisionPorcentaje / 100)

                                return (
                                    <tr key={sucursal}>
                                        <td className="font-bold text-white">{sucursal}</td>
                                        <td className="text-green-400 font-bold">
                                            ${ventas.toLocaleString('es-CL')}
                                        </td>
                                        <td className="text-accent-red font-bold">
                                            {comisionPorcentaje}%
                                        </td>
                                        <td className="text-yellow-400 font-bold">
                                            ${totalComision.toLocaleString('es-CL')}
                                        </td>
                                        <td className="text-blue-400">
                                            {reportesSucursal.length}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mensaje si no hay datos */}
            {reportes.length === 0 && (
                <div className="card text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-2xl font-black text-white mb-2">
                        No hay reportes para mostrar
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Comienza cargando reportes de ventas en el apartado "Cargar Reportes"
                    </p>
                </div>
            )}
        </div>
    )
}

export default Dashboard
