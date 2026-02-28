-- =============================================
-- SUPABASE ANTI-HIBERNATION (KEEP-ALIVE)
-- =============================================
-- Este script configura una tarea automática dentro de Postgres
-- para que el proyecto no entre en pausa por inactividad.

-- 1. Habilitar extensión pg_cron (si no está activa)
-- Nota: En algunos proyectos de Supabase, esto debe activarse 
-- primero en Settings > Database > Extensions > pg_cron.
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Crear tabla de logs (actividad mínima)
CREATE TABLE IF NOT EXISTS _keep_alive (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    last_ping TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT DEFAULT 'system',
    status TEXT DEFAULT 'ok'
);

-- 3. Habilitar RLS para la tabla de logs
ALTER TABLE _keep_alive ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anonymous insert for keep-alive') THEN
        CREATE POLICY "Allow anonymous insert for keep-alive" ON _keep_alive FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anonymous read for keep-alive') THEN
        CREATE POLICY "Allow anonymous read for keep-alive" ON _keep_alive FOR SELECT USING (true);
    END IF;
END $$;

-- 4. Función de limpieza y registro
CREATE OR REPLACE FUNCTION public.execute_keep_alive()
RETURNS void AS $$
BEGIN
    -- Insertar nuevo ping
    INSERT INTO public._keep_alive (source, status) VALUES ('cron_job', 'ok');
    
    -- Mantener solo los últimos 50 registros para no llenar la DB
    DELETE FROM public._keep_alive 
    WHERE id NOT IN (
        SELECT id FROM public._keep_alive 
        ORDER BY last_ping DESC 
        LIMIT 50
    );
END;
$$ LANGUAGE plpgsql;

-- 5. Programar la tarea (Ejecutar cada 24 horas a medianoche)
-- Sintaxis: name, schedule (cron), command
SELECT cron.schedule(
    'supabase-keep-alive-task', 
    '0 0 * * *', 
    'SELECT public.execute_keep_alive()'
);

-- 6. Log inicial
SELECT public.execute_keep_alive();
