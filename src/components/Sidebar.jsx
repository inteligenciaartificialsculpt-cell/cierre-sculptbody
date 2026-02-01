import React from 'react'

const Sidebar = ({ activeView, setActiveView }) => {
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: '📊',
            description: 'Vista General'
        },
        {
            id: 'upload',
            label: 'Cargar Reportes',
            icon: '📤',
            description: 'Bulk Upload'
        },
        {
            id: 'reportes',
            label: 'Gestión de Reportes',
            icon: '📋',
            description: 'CRUD'
        },
        {
            id: 'estadisticas',
            label: 'Estadísticas',
            icon: '📈',
            description: 'KPIs y Gráficos'
        },
        {
            id: 'exportar',
            label: 'Exportar TXT',
            icon: '💾',
            description: 'Generar Archivos'
        }
    ]

    return (
        <aside className="sidebar">
            {/* Logo y Header */}
            <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-3 mb-2">
                    <div className="text-4xl text-accent-red">⚡</div>
                    <div>
                        <h1 className="text-xl font-black text-accent-red uppercase tracking-tighter">CIERRE</h1>
                        <p className="text-lg text-accent-red font-black -mt-1 tracking-tight">SCULPTBODY</p>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-dark-bg rounded-lg border border-gray-800">
                    <p className="text-xs text-gray-400 leading-relaxed">
                        Sistema de Business Intelligence para Cierre Mensual
                    </p>
                </div>
            </div>

            {/* Menú de Navegación */}
            <nav className="py-6">
                <div className="px-4 mb-3">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                        Navegación
                    </h3>
                </div>
                {menuItems.map(item => (
                    <div
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
                    >
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1">
                            <div className="font-bold text-sm">{item.label}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800 bg-dark-secondary">
                <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center justify-between">
                        <span>Versión</span>
                        <span className="font-bold text-white">1.0.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Fecha</span>
                        <span className="font-bold text-white">
                            {new Date().toLocaleDateString('es-CL')}
                        </span>
                    </div>
                </div>
                <div className="mt-4 p-2 bg-accent-red/10 border border-accent-red/30 rounded text-center">
                    <p className="text-xs text-accent-red font-bold">FINTECH SPECIALIST</p>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
