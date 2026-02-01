-- =============================================
-- BEAUTY BI PLATFORM - DATABASE SCHEMA
-- Sistema de Business Intelligence para Centros Estéticos
-- =============================================

-- Tabla de Sucursales
CREATE TABLE IF NOT EXISTS sucursales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL UNIQUE,
  comision_porcentaje DECIMAL(4,2) NOT NULL CHECK (comision_porcentaje >= 0 AND comision_porcentaje <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Profesionales
CREATE TABLE IF NOT EXISTS profesionales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(200) NOT NULL,
  sucursal_id UUID REFERENCES sucursales(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(nombre, sucursal_id)
);

-- Tabla de Reportes Mensuales (resultado de procesamiento de imágenes)
CREATE TABLE IF NOT EXISTS reportes_mensuales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profesional_id UUID REFERENCES profesionales(id) ON DELETE CASCADE,
  fecha_reporte DATE NOT NULL,
  total_venta_bruta DECIMAL(12,2) NOT NULL CHECK (total_venta_bruta >= 0),
  comision_porcentaje DECIMAL(4,2) NOT NULL,
  pago_neto DECIMAL(12,2) NOT NULL CHECK (pago_neto >= 0),
  imagen_url TEXT,
  estado VARCHAR(50) DEFAULT 'procesado',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Servicios/Tratamientos por Reporte
CREATE TABLE IF NOT EXISTS servicios_reporte (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporte_id UUID REFERENCES reportes_mensuales(id) ON DELETE CASCADE,
  nombre_servicio VARCHAR(200) NOT NULL,
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
  subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización de consultas
CREATE INDEX IF NOT EXISTS idx_profesionales_sucursal ON profesionales(sucursal_id);
CREATE INDEX IF NOT EXISTS idx_reportes_profesional ON reportes_mensuales(profesional_id);
CREATE INDEX IF NOT EXISTS idx_reportes_fecha ON reportes_mensuales(fecha_reporte);
CREATE INDEX IF NOT EXISTS idx_servicios_reporte ON servicios_reporte(reporte_id);

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_sucursales_updated_at BEFORE UPDATE ON sucursales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profesionales_updated_at BEFORE UPDATE ON profesionales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reportes_updated_at BEFORE UPDATE ON reportes_mensuales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar Sucursales con sus comisiones específicas
INSERT INTO sucursales (nombre, comision_porcentaje) VALUES
  ('San Miguel', 2.00),
  ('Las Condes', 2.00),
  ('La Dehesa', 2.00),
  ('Antofagasta', 2.00),
  ('Hendaya', 2.50)
ON CONFLICT (nombre) DO NOTHING;

-- Row Level Security (RLS) - Opcional para futuras implementaciones con Auth
ALTER TABLE sucursales ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes_mensuales ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios_reporte ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permite acceso completo por ahora - ajustar según autenticación)
CREATE POLICY "Allow all operations on sucursales" ON sucursales FOR ALL USING (true);
CREATE POLICY "Allow all operations on profesionales" ON profesionales FOR ALL USING (true);
CREATE POLICY "Allow all operations on reportes_mensuales" ON reportes_mensuales FOR ALL USING (true);
CREATE POLICY "Allow all operations on servicios_reporte" ON servicios_reporte FOR ALL USING (true);
