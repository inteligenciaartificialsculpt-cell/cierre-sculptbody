import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import BulkUpload from './components/BulkUpload'
import ReportesManager from './components/ReportesManager'
import ExportManager from './components/ExportManager'
import SyncData from './components/SyncData'
import { keepAliveService } from './services/keepAlive'
import './index.css'

function App() {
    const [activeView, setActiveView] = useState('dashboard')
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // Anti-hibernación automática
    useEffect(() => {
        keepAliveService.ping()
    }, [])

    // Manejador de éxito de upload para refrescar otras vistas
    const handleUploadSuccess = () => {
        setRefreshTrigger(prev => prev + 1)
        // Opcional: cambiar automáticamente a dashboard
        // setActiveView('dashboard')
    }

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <Dashboard key={refreshTrigger} />

            case 'upload':
                return <BulkUpload onSuccess={handleUploadSuccess} />

            case 'reportes':
                return <ReportesManager refreshTrigger={refreshTrigger} />

            case 'estadisticas':
                return <Dashboard key={refreshTrigger} />

            case 'exportar':
                return <ExportManager />

            case 'sync':
                return <SyncData />

            default:
                return <Dashboard />
        }
    }

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Sidebar */}
            <Sidebar activeView={activeView} setActiveView={setActiveView} />

            {/* Main Content */}
            <main className="ml-64 min-h-screen">
                {renderView()}
            </main>

            {/* Footer Global */}
            <footer className="ml-64 border-t border-gray-800 bg-dark-secondary py-6 px-8">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        <p className="mb-1">
                            <strong className="text-accent-red">CIERRE SCULPTBODY</strong> - Sistema de Business Intelligence para Centros Estéticos
                        </p>
                        <p>
                            Desarrollado con React + Tailwind CSS + Chart.js + Supabase + Gemini AI
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500">
                            <div>© 2026 - Fintech Specialist</div>
                            <div className="text-accent-red font-bold mt-1">High-End Dark Mode</div>
                            <div className="text-xs mt-1 text-slate-600 font-mono">VERSIÓN: 2.1 - PRO ACTIVE</div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default App
