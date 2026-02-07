-- ============================================
-- SCRIPT SQL ALTERNATIF - AVEC DONNÉES DU BACKUP
-- Application de Gestion de Salon (ANAROS)
-- ============================================
-- Ce script utilise la structure du backup pour restaurer
-- les données existantes si vous souhaitez conserver l'ancien système

-- Activer l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SUPPRESSION DES TABLES EXISTANTES
-- ============================================
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.staff_skills CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.services_categories CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ============================================
-- CRÉATION DES TABLES (Structure compatible avec l'application)
-- ============================================

-- Table des profils utilisateurs
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
    price INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des compétences du personnel
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

-- ============================================
-- INDEX POUR OPTIMISATION
-- ============================================
CREATE INDEX idx_appointments_staff_id ON public.appointments(staff_id);
CREATE INDEX idx_appointments_client_id ON public.appointments(client_id);
CREATE INDEX idx_appointments_service_id ON public.appointments(service_id);
CREATE INDEX idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_services_category_id ON public.services(category_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- ============================================
-- DONNÉES INITIALES (Du backup + Nouvelles)
-- ============================================

-- Catégories de services
INSERT INTO public.services_categories (id, name) VALUES
(1, 'Coiffure'),
(2, 'Esthétique'),
(3, 'Manucure'),
(4, 'Massage'),
(5, 'Maquillage'),
(6, 'Soins du corps'),
(7, 'Épilation'),
(8, 'Onglerie')
ON CONFLICT (id) DO NOTHING;

SELECT setval('services_categories_id_seq', (SELECT MAX(id) FROM public.services_categories));

-- Compte admin du backup (digitalsolverland@gmail.com)
-- Note: Vous devrez définir un mot de passe
INSERT INTO public.profiles (id, first_name, last_name, email, password, role, color_code, created_at) VALUES
('89a296e4-fa28-4d66-8f92-cf93a847f760', 'Digital', 'Solver', 'digitalsolverland@gmail.com', 'admin123', 'superadmin', '#8B5CF6', '2025-08-09 21:57:12.742522')
ON CONFLICT (id) DO NOTHING;

-- Compte admin supplémentaire pour faciliter l'accès
INSERT INTO public.profiles (id, first_name, last_name, email, password, role, color_code, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Admin', 'Principal', 'admin@anaros.com', 'admin123', 'superadmin', '#10B981', NOW())
ON CONFLICT (id) DO NOTHING;

-- Services d'exemple complets
INSERT INTO public.services (id, category_id, name, price, duration, created_at) VALUES
-- Coiffure
('service-001', 1, 'Coupe Homme', 1500, 30, NOW()),
('service-002', 1, 'Coupe Femme', 2500, 45, NOW()),
('service-003', 1, 'Coupe Enfant', 1000, 25, NOW()),
('service-004', 1, 'Coloration complète', 4000, 90, NOW()),
('service-005', 1, 'Mèches', 3500, 75, NOW()),
('service-006', 1, 'Brushing', 1500, 30, NOW()),
('service-007', 1, 'Lissage brésilien', 8000, 180, NOW()),

-- Esthétique
('service-008', 2, 'Soin du visage hydratant', 3000, 60, NOW()),
('service-009', 2, 'Soin du visage anti-âge', 4500, 75, NOW()),
('service-010', 2, 'Nettoyage de peau', 2500, 45, NOW()),
('service-011', 2, 'Masque purifiant', 2000, 30, NOW()),

-- Manucure
('service-012', 3, 'Manucure classique', 1200, 45, NOW()),
('service-013', 3, 'Manucure française', 1500, 50, NOW()),
('service-014', 3, 'Pose de vernis semi-permanent', 2000, 60, NOW()),
('service-015', 3, 'Dépose + Pose semi-permanent', 2500, 75, NOW()),

-- Massage
('service-016', 4, 'Massage relaxant', 3500, 60, NOW()),
('service-017', 4, 'Massage sportif', 4000, 75, NOW()),
('service-018', 4, 'Massage aux pierres chaudes', 5000, 90, NOW()),

-- Maquillage
('service-019', 5, 'Maquillage de jour', 2500, 45, NOW()),
('service-020', 5, 'Maquillage de soirée', 4000, 60, NOW()),
('service-021', 5, 'Maquillage mariée', 8000, 120, NOW()),

-- Soins du corps
('service-022', 6, 'Gommage corps', 3000, 60, NOW()),
('service-023', 6, 'Enveloppement', 3500, 75, NOW()),

-- Épilation
('service-024', 7, 'Épilation sourcils', 500, 15, NOW()),
('service-025', 7, 'Épilation lèvre supérieure', 400, 10, NOW()),
('service-026', 7, 'Épilation demi-jambes', 1500, 30, NOW()),
('service-027', 7, 'Épilation jambes complètes', 2500, 45, NOW()),
('service-028', 7, 'Épilation maillot', 1800, 25, NOW()),

-- Onglerie
('service-029', 8, 'Pose d\'ongles en gel', 3500, 90, NOW()),
('service-030', 8, 'Remplissage gel', 2500, 60, NOW()),
('service-031', 8, 'Dépose ongles gel', 1000, 30, NOW()),
('service-032', 8, 'Nail art (par ongle)', 200, 10, NOW())
ON CONFLICT (id) DO NOTHING;

-- Client d'exemple
INSERT INTO public.clients (id, full_name, phone, email, notes, created_at) VALUES
('client-001', 'Client Test', '0555123456', 'client@example.com', 'Client de test pour démonstration', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VUES UTILES
-- ============================================

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

-- Vue pour les statistiques rapides
CREATE OR REPLACE VIEW public.daily_stats AS
SELECT 
    DATE(start_time) as date,
    COUNT(*) as total_appointments,
    COUNT(*) FILTER (WHERE status = 'completed') as completed,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
    SUM(s.price) FILTER (WHERE a.status = 'completed') as revenue
FROM public.appointments a
JOIN public.services s ON a.service_id = s.id
GROUP BY DATE(start_time)
ORDER BY date DESC;

-- ============================================
-- VÉRIFICATIONS
-- ============================================

-- Afficher les tables créées
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name IN ('profiles', 'services_categories', 'services', 'staff_skills', 'clients', 'appointments')
ORDER BY table_name;

-- Afficher les comptes admin
SELECT id, first_name, last_name, email, role, color_code 
FROM public.profiles 
WHERE role IN ('superadmin', 'admin')
ORDER BY created_at;

-- Afficher les catégories
SELECT * FROM public.services_categories ORDER BY id;

-- Afficher le nombre de services par catégorie
SELECT 
    sc.name as category,
    COUNT(s.id) as service_count,
    MIN(s.price) as min_price,
    MAX(s.price) as max_price
FROM public.services_categories sc
LEFT JOIN public.services s ON sc.id = s.category_id
GROUP BY sc.id, sc.name
ORDER BY sc.id;
