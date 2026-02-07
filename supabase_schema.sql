-- ============================================
-- SCRIPT SQL COMPLET POUR SUPABASE
-- Application de Gestion de Salon (ANAROS)
-- ============================================
-- Ce script crée toutes les tables nécessaires pour l'application
-- avec les bonnes structures, contraintes et données initiales

-- Activer l'extension UUID si ce n'est pas déjà fait
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. SUPPRESSION DES TABLES EXISTANTES (si elles existent)
-- ============================================
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.staff_skills CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.services_categories CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ============================================
-- 2. CRÉATION DES TABLES
-- ============================================

-- Table des profils utilisateurs (employés, admins, etc.)
CREATE TABLE public.profiles (
    id VARCHAR(36) PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('superadmin', 'admin', 'reception', 'staff')),
    color_code TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des catégories de services
CREATE TABLE public.services_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Table des services
CREATE TABLE public.services (
    id VARCHAR(36) PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES public.services_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price INTEGER NOT NULL, -- Prix en DA (dinars algériens)
    duration INTEGER NOT NULL, -- Durée en minutes
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des compétences du personnel (liaison entre profils et catégories)
CREATE TABLE public.staff_skills (
    profile_id VARCHAR(36) NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES public.services_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (profile_id, category_id)
);

-- Table des clients
CREATE TABLE public.clients (
    id VARCHAR(36) PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des rendez-vous
CREATE TABLE public.appointments (
    id VARCHAR(36) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    client_id VARCHAR(36) NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    staff_id VARCHAR(36) NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id VARCHAR(36) NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
);

-- Table legacy users (pour compatibilité)
CREATE TABLE public.users (
    id VARCHAR PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- ============================================
-- 3. CRÉATION DES INDEX POUR OPTIMISATION
-- ============================================

-- Index pour améliorer les performances des requêtes fréquentes
CREATE INDEX idx_appointments_staff_id ON public.appointments(staff_id);
CREATE INDEX idx_appointments_client_id ON public.appointments(client_id);
CREATE INDEX idx_appointments_service_id ON public.appointments(service_id);
CREATE INDEX idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_services_category_id ON public.services(category_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- ============================================
-- 4. INSERTION DES DONNÉES INITIALES
-- ============================================

-- Insertion des catégories de services par défaut
INSERT INTO public.services_categories (id, name) VALUES
(1, 'Coiffure'),
(2, 'Esthétique'),
(3, 'Manucure'),
(4, 'Massage'),
(5, 'Maquillage')
ON CONFLICT (id) DO NOTHING;

-- Réinitialiser la séquence pour les catégories
SELECT setval('services_categories_id_seq', (SELECT MAX(id) FROM public.services_categories));

-- Insertion d'un compte administrateur par défaut
-- Email: admin@anaros.com
-- Mot de passe: admin123 (À CHANGER EN PRODUCTION!)
INSERT INTO public.profiles (id, first_name, last_name, email, password, role, color_code, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Admin', 'Principal', 'admin@anaros.com', 'admin123', 'superadmin', '#8B5CF6', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insertion de quelques services d'exemple
INSERT INTO public.services (id, category_id, name, price, duration, created_at) VALUES
('service-001', 1, 'Coupe Homme', 1500, 30, NOW()),
('service-002', 1, 'Coupe Femme', 2500, 45, NOW()),
('service-003', 1, 'Coloration', 4000, 90, NOW()),
('service-004', 2, 'Soin du visage', 3000, 60, NOW()),
('service-005', 3, 'Manucure classique', 1200, 45, NOW()),
('service-006', 3, 'Pose de vernis semi-permanent', 2000, 60, NOW()),
('service-007', 4, 'Massage relaxant', 3500, 60, NOW()),
('service-008', 5, 'Maquillage de jour', 2500, 45, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insertion d'un client d'exemple
INSERT INTO public.clients (id, full_name, phone, email, notes, created_at) VALUES
('client-001', 'Client Test', '0555123456', 'client@example.com', 'Client de test', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. CONFIGURATION DES PERMISSIONS (RLS - Row Level Security)
-- ============================================

-- Activer RLS sur toutes les tables (optionnel, selon vos besoins de sécurité)
-- Pour l'instant, on laisse l'accès ouvert pour simplifier le développement
-- Vous pouvez activer RLS plus tard selon vos besoins

-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. CRÉATION DE VUES UTILES (optionnel)
-- ============================================

-- Vue pour les rendez-vous avec tous les détails
CREATE OR REPLACE VIEW public.appointments_detailed AS
SELECT 
    a.id,
    a.created_at,
    a.start_time,
    a.end_time,
    a.status,
    c.id as client_id,
    c.full_name as client_name,
    c.phone as client_phone,
    p.id as staff_id,
    p.first_name || ' ' || p.last_name as staff_name,
    p.color_code as staff_color,
    s.id as service_id,
    s.name as service_name,
    s.price as service_price,
    s.duration as service_duration,
    sc.name as service_category
FROM public.appointments a
JOIN public.clients c ON a.client_id = c.id
JOIN public.profiles p ON a.staff_id = p.id
JOIN public.services s ON a.service_id = s.id
JOIN public.services_categories sc ON s.category_id = sc.id;

-- ============================================
-- 7. FONCTIONS UTILES
-- ============================================

-- Fonction pour générer un UUID v4 compatible
CREATE OR REPLACE FUNCTION public.generate_uuid()
RETURNS VARCHAR(36) AS $$
BEGIN
    RETURN uuid_generate_v4()::VARCHAR(36);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SCRIPT TERMINÉ
-- ============================================

-- Vérification des tables créées
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name IN ('profiles', 'services_categories', 'services', 'staff_skills', 'clients', 'appointments', 'users')
ORDER BY table_name;

-- Afficher le compte admin créé
SELECT id, first_name, last_name, email, role, color_code 
FROM public.profiles 
WHERE role = 'superadmin';

-- Afficher les catégories de services
SELECT * FROM public.services_categories ORDER BY id;

-- Afficher les services créés
SELECT s.id, s.name, sc.name as category, s.price, s.duration 
FROM public.services s
JOIN public.services_categories sc ON s.category_id = sc.id
ORDER BY sc.id, s.name;
