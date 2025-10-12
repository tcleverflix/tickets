-- Initialize TickKK Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extension for UUID generation (if needed in the future)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types for tickets
DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('abierto', 'en_proceso', 'cerrado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM ('baja', 'media', 'alta', 'critica');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create ENUM type for users
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'agent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role user_role NOT NULL DEFAULT 'agent',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20),
    subject VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    status ticket_status DEFAULT 'abierto',
    priority ticket_priority DEFAULT 'media',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_to_id INTEGER REFERENCES users(id),
    assigned_to VARCHAR(255),
    category VARCHAR(100),
    department VARCHAR(100)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    comment_text TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_client_email ON tickets(client_email);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to_id ON tickets(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_comments_ticket_id ON comments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;
CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically update updated_at on users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (for development only)
INSERT INTO tickets (client_name, client_email, subject, description, priority, category) VALUES
('Juan Pérez', 'juan.perez@email.com', 'No puedo acceder a mi cuenta', 'Cuando intento iniciar sesión me aparece un error que dice "Credenciales inválidas" pero estoy seguro de que estoy usando la contraseña correcta.', 'alta', 'Cuenta'),
('María García', 'maria.garcia@email.com', 'El sistema está muy lento', 'Desde ayer el sistema está funcionando muy lento, las páginas tardan mucho en cargar y a veces se queda colgado.', 'media', 'Software'),
('Carlos López', 'carlos.lopez@email.com', 'Error al enviar emails', 'No puedo enviar emails desde el sistema. Me aparece un error 500 cada vez que intento enviar un mensaje.', 'critica', 'Email')
ON CONFLICT DO NOTHING;

-- Add comments to sample tickets
INSERT INTO comments (ticket_id, author_name, author_email, comment_text) VALUES
(1, 'Soporte Técnico', 'soporte@tickkk.com', 'Hemos revisado tu cuenta y parece que hubo un problema con la sincronización. Hemos restablecido tu contraseña. Por favor intenta acceder nuevamente.'),
(2, 'María García', 'maria.garcia@email.com', 'Gracias por la respuesta. El problema persiste, especialmente en las horas pico del día.'),
(3, 'Soporte Técnico', 'soporte@tickkk.com', 'Hemos identificado el problema con el servidor de correo. Estamos trabajando en una solución urgente.')
ON CONFLICT DO NOTHING;