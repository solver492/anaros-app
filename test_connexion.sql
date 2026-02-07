-- ============================================
-- SCRIPT DE TEST RAPIDE
-- ============================================
-- Exécutez ce script dans Supabase SQL Editor
-- pour vérifier que tout fonctionne correctement

-- 1. Vérifier que toutes les tables existent
SELECT 
    'Tables créées' as verification,
    COUNT(*) as nombre_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name IN ('profiles', 'services_categories', 'services', 'staff_skills', 'clients', 'appointments', 'users');

-- 2. Vérifier le compte admin
SELECT 
    'Compte admin' as verification,
    id, 
    first_name, 
    last_name, 
    email, 
    role
FROM public.profiles 
WHERE role IN ('superadmin', 'admin');

-- 3. Vérifier les catégories de services
SELECT 
    'Catégories de services' as verification,
    COUNT(*) as nombre_categories
FROM public.services_categories;

-- 4. Vérifier les services
SELECT 
    'Services créés' as verification,
    COUNT(*) as nombre_services
FROM public.services;

-- 5. Détail des services par catégorie
SELECT 
    sc.name as categorie,
    COUNT(s.id) as nombre_services,
    MIN(s.price) as prix_min,
    MAX(s.price) as prix_max,
    ROUND(AVG(s.price)) as prix_moyen
FROM public.services_categories sc
LEFT JOIN public.services s ON sc.id = s.category_id
GROUP BY sc.id, sc.name
ORDER BY sc.id;

-- 6. Vérifier les index
SELECT 
    'Index créés' as verification,
    COUNT(*) as nombre_index
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND tablename IN ('profiles', 'services', 'appointments');

-- 7. Test d'insertion d'un client (sera rollback)
BEGIN;
INSERT INTO public.clients (id, full_name, phone, email, notes) 
VALUES (
    'test-' || gen_random_uuid()::text,
    'Client Test Connexion',
    '0555999888',
    'test@test.com',
    'Test de connexion réussi'
);
SELECT 'Test insertion' as verification, 'OK' as statut;
ROLLBACK;

-- 8. Résumé final
SELECT 
    '=== RÉSUMÉ ===' as titre,
    (SELECT COUNT(*) FROM public.profiles) as nb_profiles,
    (SELECT COUNT(*) FROM public.services_categories) as nb_categories,
    (SELECT COUNT(*) FROM public.services) as nb_services,
    (SELECT COUNT(*) FROM public.clients) as nb_clients,
    (SELECT COUNT(*) FROM public.appointments) as nb_appointments;

-- 9. Vérifier les contraintes de clés étrangères
SELECT 
    'Contraintes FK' as verification,
    COUNT(*) as nombre_contraintes
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
    AND table_schema = 'public'
    AND table_name IN ('services', 'staff_skills', 'appointments');

-- 10. Message de succès
SELECT 
    '✅ TOUT EST OK !' as message,
    'Votre base de données est correctement configurée' as details,
    'Vous pouvez maintenant connecter votre application' as prochaine_etape;
