# 📊 RÉCAPITULATIF - CONFIGURATION BASE DE DONNÉES ANAROS

## 🎯 FICHIERS CRÉÉS

### 1. `supabase_schema.sql` ⭐ RECOMMANDÉ
**Script SQL principal - Version simple et efficace**
- ✅ Structure complète de la base de données
- ✅ 7 tables optimisées pour l'application
- ✅ Index de performance
- ✅ Données initiales minimales
- ✅ 1 compte admin + 5 catégories + 8 services d'exemple

**À utiliser si** : Vous démarrez un nouveau projet ou voulez une base propre

### 2. `supabase_schema_complet.sql`
**Script SQL étendu - Version avec plus de données**
- ✅ Même structure que le script principal
- ✅ Plus de services d'exemple (32 services)
- ✅ 8 catégories de services
- ✅ 2 comptes admin (dont celui du backup)
- ✅ Vues SQL supplémentaires pour les statistiques

**À utiliser si** : Vous voulez plus de données d'exemple pour tester

### 3. `GUIDE_SUPABASE.md`
**Documentation complète**
- 📖 Guide pas à pas pour configurer Supabase
- 🔧 Instructions détaillées
- 🆘 Section de dépannage
- ✅ Liste de vérifications

---

## 🚀 DÉMARRAGE RAPIDE

### Étape 1 : Choisir votre script SQL
```
Option A (Recommandé) : supabase_schema.sql
Option B (Plus complet) : supabase_schema_complet.sql
```

### Étape 2 : Exécuter dans Supabase
1. Ouvrez https://supabase.com
2. Allez dans SQL Editor
3. Copiez-collez le contenu du script choisi
4. Cliquez sur "Run"

### Étape 3 : Récupérer l'URL de connexion
Dans Supabase → Settings → Database → Connection string (URI)

### Étape 4 : Mettre à jour .env
```env
DATABASE_URL=postgresql://postgres:tCSvv5l7RKZ4jy2i@db.[VOTRE-REF].supabase.co:5432/postgres
```

### Étape 5 : Redémarrer l'application
```bash
npm run dev
```

---

## 🔑 COMPTES ADMINISTRATEURS

### Script principal (supabase_schema.sql)
```
Email: admin@anaros.com
Mot de passe: admin123
Rôle: superadmin
```

### Script complet (supabase_schema_complet.sql)
```
Compte 1:
Email: digitalsolverland@gmail.com
Mot de passe: admin123
Rôle: superadmin

Compte 2:
Email: admin@anaros.com
Mot de passe: admin123
Rôle: superadmin
```

⚠️ **IMPORTANT** : Changez ces mots de passe après la première connexion !

---

## 📋 STRUCTURE DE LA BASE DE DONNÉES

### Tables créées (7)

1. **profiles** - Utilisateurs et employés
   ```
   - id (VARCHAR 36) - Clé primaire
   - first_name (TEXT) - Prénom
   - last_name (TEXT) - Nom
   - email (TEXT UNIQUE) - Email
   - password (TEXT) - Mot de passe
   - role (TEXT) - Rôle (superadmin/admin/reception/staff)
   - color_code (TEXT) - Couleur pour le calendrier
   - created_at (TIMESTAMP) - Date de création
   ```

2. **services_categories** - Catégories de services
   ```
   - id (SERIAL) - Clé primaire auto-incrémentée
   - name (TEXT UNIQUE) - Nom de la catégorie
   ```

3. **services** - Catalogue des services
   ```
   - id (VARCHAR 36) - Clé primaire
   - category_id (INTEGER) - Référence à services_categories
   - name (TEXT) - Nom du service
   - price (INTEGER) - Prix en DA
   - duration (INTEGER) - Durée en minutes
   - created_at (TIMESTAMP) - Date de création
   ```

4. **staff_skills** - Compétences du personnel
   ```
   - profile_id (VARCHAR 36) - Référence à profiles
   - category_id (INTEGER) - Référence à services_categories
   - Clé primaire composite (profile_id, category_id)
   ```

5. **clients** - Base de données clients
   ```
   - id (VARCHAR 36) - Clé primaire
   - full_name (TEXT) - Nom complet
   - phone (TEXT) - Téléphone
   - email (TEXT) - Email (optionnel)
   - notes (TEXT) - Notes (optionnel)
   - created_at (TIMESTAMP) - Date de création
   ```

6. **appointments** - Rendez-vous
   ```
   - id (VARCHAR 36) - Clé primaire
   - created_at (TIMESTAMP) - Date de création
   - start_time (TIMESTAMP) - Heure de début
   - end_time (TIMESTAMP) - Heure de fin
   - client_id (VARCHAR 36) - Référence à clients
   - staff_id (VARCHAR 36) - Référence à profiles
   - service_id (VARCHAR 36) - Référence à services
   - status (TEXT) - Statut (pending/confirmed/completed/cancelled)
   ```

7. **users** - Table legacy (compatibilité)
   ```
   - id (VARCHAR) - Clé primaire
   - username (TEXT UNIQUE) - Nom d'utilisateur
   - password (TEXT) - Mot de passe
   ```

---

## 🎨 DONNÉES INITIALES

### Catégories (Script principal - 5 catégories)
1. Coiffure
2. Esthétique
3. Manucure
4. Massage
5. Maquillage

### Catégories (Script complet - 8 catégories)
1. Coiffure
2. Esthétique
3. Manucure
4. Massage
5. Maquillage
6. Soins du corps
7. Épilation
8. Onglerie

### Services d'exemple
- **Script principal** : 8 services
- **Script complet** : 32 services

---

## ⚡ OPTIMISATIONS INCLUSES

### Index créés pour améliorer les performances :
```sql
- idx_appointments_staff_id
- idx_appointments_client_id
- idx_appointments_service_id
- idx_appointments_start_time
- idx_appointments_status
- idx_services_category_id
- idx_profiles_email
- idx_profiles_role
```

### Vues SQL (Script complet uniquement) :
```sql
- appointments_detailed : Vue complète des rendez-vous avec tous les détails
- daily_stats : Statistiques quotidiennes (rendez-vous, revenus)
```

---

## 🔒 SÉCURITÉ

### Contraintes de données :
- ✅ Clés étrangères avec CASCADE DELETE
- ✅ Contraintes CHECK sur les rôles et statuts
- ✅ Emails uniques pour les profils
- ✅ Noms de catégories uniques

### Row Level Security (RLS) :
- ⚠️ Désactivé par défaut pour faciliter le développement
- 💡 À activer en production selon vos besoins

---

## 📊 FONCTIONNALITÉS DE L'APPLICATION

### Gestion des utilisateurs
- ✅ Création de profils (employés)
- ✅ 4 niveaux de rôles (superadmin, admin, reception, staff)
- ✅ Authentification par email/mot de passe
- ✅ Couleurs personnalisées pour le calendrier

### Gestion des services
- ✅ Catégorisation des services
- ✅ Prix en dinars algériens (DA)
- ✅ Durées en minutes
- ✅ Association employés ↔ compétences

### Gestion des clients
- ✅ Informations de contact
- ✅ Notes personnalisées
- ✅ Historique des rendez-vous

### Gestion des rendez-vous
- ✅ Planification avec dates/heures
- ✅ Statuts multiples (pending, confirmed, completed, cancelled)
- ✅ Liaison client-employé-service
- ✅ Calcul automatique des revenus

### Dashboard et statistiques
- ✅ KPIs (revenus jour/mois/année)
- ✅ Top employés du mois
- ✅ Top services du mois
- ✅ Client VIP (Golden Client)

---

## 🔍 VÉRIFICATIONS POST-INSTALLATION

### Dans Supabase :
1. ✅ Table Editor → Vérifier 7 tables créées
2. ✅ profiles → Vérifier compte(s) admin
3. ✅ services_categories → Vérifier catégories
4. ✅ services → Vérifier services d'exemple

### Dans l'application :
1. ✅ npm run dev en cours
2. ✅ Connexion avec admin@anaros.com / admin123
3. ✅ Accès au dashboard
4. ✅ Navigation dans tous les menus

---

## 🆘 PROBLÈMES COURANTS

### "DATABASE_URL must be set"
**Solution** : Vérifiez le fichier .env et redémarrez l'application

### Erreur de connexion Supabase
**Solution** : Vérifiez l'URL et le mot de passe dans .env

### Tables non créées
**Solution** : Réexécutez le script SQL complet dans Supabase

### Impossible de se connecter
**Solution** : Vérifiez que le compte admin existe dans la table profiles

---

## 📞 INFORMATIONS DE CONNEXION SUPABASE

```
Projet : anaros gestion app
Mot de passe DB : tCSvv5l7RKZ4jy2i
Email compte : solverdb@gmail.com
```

---

## 🎯 PROCHAINES ÉTAPES

1. ✅ Exécuter le script SQL dans Supabase
2. ✅ Mettre à jour .env avec la bonne DATABASE_URL
3. ✅ Redémarrer npm run dev
4. ✅ Se connecter avec admin@anaros.com
5. ✅ Créer vos employés
6. ✅ Personnaliser les services
7. ✅ Ajouter vos clients
8. ✅ Commencer à planifier des rendez-vous !

---

## 📚 RESSOURCES

- Documentation Supabase : https://supabase.com/docs
- Guide complet : Voir GUIDE_SUPABASE.md
- Script SQL principal : supabase_schema.sql
- Script SQL complet : supabase_schema_complet.sql

---

**Date de création** : 06/02/2026
**Version** : 1.0
**Application** : ANAROS - Système de gestion de salon
