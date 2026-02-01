// =============================================
// GENERADOR DE REPORTES TXT
// =============================================

/**
 * Genera un archivo .txt para un reporte individual de profesional
 * @param {Object} reporte - Objeto del reporte con toda la información
 * @returns {Blob} Blob del archivo TXT
 */
export const generateReporteTXT = (reporte) => {
    const { profesional, total_venta_bruta, comision_porcentaje, pago_neto, servicios, fecha_reporte } = reporte

    // Formatear fecha
    const fechaFormateada = new Date(fecha_reporte).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    // Construir contenido del TXT
    let contenido = ''

    // ========== HEADER ==========
    contenido += '═'.repeat(70) + '\n'
    contenido += '    REPORTE MENSUAL DE VENTAS - SCULPTBODY\n'
    contenido += '═'.repeat(70) + '\n\n'

    contenido += `PROFESIONAL: ${profesional.nombre}\n`
    contenido += `SUCURSAL: ${profesional.sucursal?.nombre || 'N/A'}\n`
    contenido += `FECHA DE REPORTE: ${fechaFormateada}\n`
    contenido += `FECHA DE GENERACIÓN: ${new Date().toLocaleString('es-CL')}\n`
    contenido += '\n' + '─'.repeat(70) + '\n\n'

    // ========== BODY - DETALLE DE SERVICIOS ==========
    contenido += 'DETALLE DE SERVICIOS Y TRATAMIENTOS\n\n'
    contenido += String('SERVICIO').padEnd(40) +
        String('CANT.').padEnd(10) +
        String('P. UNIT.').padEnd(15) +
        String('SUBTOTAL').padEnd(15) + '\n'
    contenido += '─'.repeat(70) + '\n'

    let totalCalculado = 0
    servicios.forEach(servicio => {
        const nombreServicio = servicio.nombre_servicio.substring(0, 38)
        const cantidad = String(servicio.cantidad)
        const precioUnitario = formatearMoneda(servicio.precio_unitario)
        const subtotal = formatearMoneda(servicio.subtotal)

        contenido += nombreServicio.padEnd(40) +
            cantidad.padEnd(10) +
            precioUnitario.padEnd(15) +
            subtotal.padEnd(15) + '\n'

        totalCalculado += servicio.subtotal
    })

    contenido += '─'.repeat(70) + '\n\n'

    // ========== FOOTER - RESUMEN FINANCIERO ==========
    contenido += 'RESUMEN FINANCIERO\n\n'
    contenido += `Total Ventas:            ${formatearMoneda(total_venta_bruta).padStart(20)}\n`
    contenido += `Porcentaje de Comisión:  ${comision_porcentaje.toFixed(2)}%`.padStart(45) + '\n'
    contenido += `Monto de Comisión:       ${formatearMoneda(total_venta_bruta * (comision_porcentaje / 100)).padStart(20)}\n`
    contenido += '\n'

    // Notas finales
    contenido += '\nNOTAS:\n'
    contenido += '- Este documento es de carácter informativo.\n'
    contenido += '- Cualquier discrepancia debe ser reportada a administración.\n'
    contenido += '- Los montos están expresados en pesos chilenos (CLP).\n\n'

    contenido += `Generado por: CIERRE SCULPTBODY\n`
    contenido += `Sistema de Business Intelligence - Cierre Mensual\n`

    // Crear Blob
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' })
    return blob
}

/**
 * Descarga un archivo TXT para un reporte individual
 * @param {Object} reporte - Objeto del reporte
 */
export const downloadReporteTXT = (reporte) => {
    const blob = generateReporteTXT(reporte)
    const nombreArchivo = generarNombreArchivo(reporte)
    descargarBlob(blob, nombreArchivo)
}

/**
 * Genera y descarga múltiples reportes TXT en un ZIP (simulado con múltiples descargas)
 * @param {Array} reportes - Array de reportes
 */
export const downloadMultipleReportesTXT = (reportes) => {
    reportes.forEach((reporte, index) => {
        setTimeout(() => {
            downloadReporteTXT(reporte)
        }, index * 300) // Pequeño delay entre descargas para evitar bloqueos del navegador
    })
}

/**
 * Genera un reporte consolidado con todos los profesionales
 * @param {Array} reportes - Array de todos los reportes
 * @param {String} fechaReporte - Fecha del reporte (YYYY-MM-DD)
 */
export const generateReporteConsolidadoTXT = (reportes, fechaReporte) => {
    const fechaFormateada = new Date(fechaReporte).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long'
    })

    let contenido = ''

    // Header
    contenido += '═'.repeat(80) + '\n'
    contenido += '         REPORTE CONSOLIDADO MENSUAL - TODOS LOS PROFESIONALES\n'
    contenido += '═'.repeat(80) + '\n\n'
    contenido += `PERÍODO: ${fechaFormateada}\n`
    contenido += `TOTAL DE PROFESIONALES: ${reportes.length}\n`
    contenido += `FECHA DE GENERACIÓN: ${new Date().toLocaleString('es-CL')}\n\n`
    contenido += '─'.repeat(80) + '\n\n'

    // Estadísticas globales
    const totalVentasGlobal = reportes.reduce((sum, r) => sum + r.total_venta_bruta, 0)
    const totalComisiones = reportes.reduce((sum, r) => sum + (r.total_venta_bruta * (r.comision_porcentaje / 100)), 0)

    contenido += 'RESUMEN GENERAL\n\n'
    contenido += `Total Ventas:            ${formatearMoneda(totalVentasGlobal).padStart(25)}\n`
    contenido += `Total Comisiones:        ${formatearMoneda(totalComisiones).padStart(25)}\n\n`
    contenido += '─'.repeat(80) + '\n\n'

    // Detalle por profesional
    contenido += 'DETALLE POR PROFESIONAL\n\n'

    // Agrupar por sucursal
    const reportesPorSucursal = {}
    reportes.forEach(reporte => {
        const sucursal = reporte.profesional.sucursal?.nombre || 'Sin Sucursal'
        if (!reportesPorSucursal[sucursal]) {
            reportesPorSucursal[sucursal] = []
        }
        reportesPorSucursal[sucursal].push(reporte)
    })

    Object.keys(reportesPorSucursal).sort().forEach(sucursal => {
        contenido += `\n▸ SUCURSAL: ${sucursal}\n`
        contenido += '  ' + '─'.repeat(76) + '\n'

        reportesPorSucursal[sucursal].forEach(reporte => {
            contenido += `  ${reporte.profesional.nombre.padEnd(35)} | `
            contenido += `Venta: ${formatearMoneda(reporte.total_venta_bruta).padStart(15)}\n`
        })
    })

    contenido += '\n' + '═'.repeat(80) + '\n'
    contenido += `Generado por: CIERRE SCULPTBODY\n`

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' })
    return blob
}

/**
 * Descarga el reporte consolidado
 * @param {Array} reportes - Array de reportes
 * @param {String} fechaReporte - Fecha del reporte
 */
export const downloadReporteConsolidado = (reportes, fechaReporte) => {
    const blob = generateReporteConsolidadoTXT(reportes, fechaReporte)
    const nombreArchivo = `reporte_consolidado_${fechaReporte}.txt`
    descargarBlob(blob, nombreArchivo)
}

// =============================================
// UTILIDADES
// =============================================

/**
 * Formatea un número a moneda chilena
 * @param {Number} monto - Monto a formatear
 * @returns {String} Monto formateado
 */
const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(monto)
}

/**
 * Genera el nombre del archivo TXT
 * @param {Object} reporte - Objeto del reporte
 * @returns {String} Nombre del archivo
 */
const generarNombreArchivo = (reporte) => {
    const nombreProfesional = reporte.profesional.nombre
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')

    const fecha = reporte.fecha_reporte

    return `reporte_${nombreProfesional}_${fecha}.txt`
}

/**
 * Descarga un Blob como archivo
 * @param {Blob} blob - Blob a descargar
 * @param {String} nombreArchivo - Nombre del archivo
 */
const descargarBlob = (blob, nombreArchivo) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = nombreArchivo
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}
