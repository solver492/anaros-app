# 🎯 CONFIGURATION BASE DE DONNÉES SUPABASE - ANAROS

## 📦 FICHIERS DISPONIBLES

Vous disposez de **5 fichiers** pour configurer votre base de données Supabase :

### 🌟 Fichiers principaux

1. **`supabase_schema.sql`** ⭐ **RECOMMANDÉ**
   - Script SQL principal et simple
   - Structure complète de la base de données
   - Données initiales minimales (1 admin, 5 catégories, 8 services)
   - **Utilisez celui-ci pour démarrer rapidement**

2. **`supabase_schema_complet.sql`**
   - Script SQL étendu avec plus de données
   - Même structure mais avec 32 services d'exemple
   - 8 catégories de services
   - 2 comptes admin
   - **Utilisez celui-ci si vous voulez plus d'exemples**

### 📚 Fichiers de documentation

3. **`GUIDE_SUPABASE.md`**
   - Guide complet étape par étape
   - Instructions détaillées pour Supabase
   - Section de dépannage
   - **Lisez celui-ci en premier !**

4. **`RECAPITULATIF_BD.md`**
   - Vue d'ensemble de la structure
   - Détails de toutes les tables
   - Informations sur les données initiales
   - **Référence rapide pour comprendre la structure**

5. **`EXEMPLE_CONNEXION.md`**
   - Exemples concrets d'URLs de connexion
   - Configuration du fichier .env
   - Résolution des problèmes courants
   - **Utilisez celui-ci pour configurer la connexion**

### 🧪 Fichier de test

6. **`test_connexion.sql`**
   - Script de vérification rapide
   - À exécuter après l'installation
   - Vérifie que tout fonctionne
   - **Utilisez celui-ci pour tester**

---

## 🚀 DÉMARRAGE RAPIDE (3 ÉTAPES)

### Étape 1 : Exécuter le script SQL dans Supabase

1. Ouvrez https://supabase.com
2. Connectez-vous et ouvrez votre projet "anaros gestion app"
3. Allez dans **SQL Editor** (icône 📊)
4. Cliquez sur **New Query**
5. Copiez le contenu de **`supabase_schema.sql`**
6. Collez et cliquez sur **Run** (▶️)

### Étape 2 : Récupérer l'URL de connexion

1. Dans Supabase, allez dans **Settings** → **Database**
2. Sous "Connection string", sélectionnez **URI**
3. Copiez l'URL (elle ressemble à ceci) :
   ```
   postgresql://postgres:tCSvv5l7RKZ4jy2i@db.[REF].supabase.co:5432/postgres
   ```

### Étape 3 : Mettre à jour .env et redémarrer

1. Ouvrez le fichier `.env` à la racine du projet
2. Remplacez la ligne `DATABASE_URL` par votre URL Supabase
3. Redémarrez l'application :
   ```bash
   # Arrêtez avec Ctrl+C puis :
   npm run dev
   ```

---

## 🔑 CONNEXION À L'APPLICATION

Une fois l'application démarrée :

1. Ouvrez http://localhost:3000
2. Connectez-vous avec :
   ```
   Email : admin@anaros.com
   Mot de passe : admin123
   ```
3. ⚠️ **Changez ce mot de passe après la première connexion !**

---

## 📊 CE QUI EST CRÉÉ

### Tables (7)
- ✅ `profiles` - Utilisateurs et employés
- ✅ `services_categories` - Catégories de services
- ✅ `services` - Catalogue des services
- ✅ `staff_skills` - Compétences du personnel
- ✅ `clients` - Base de données clients
- ✅ `appointments` - Rendez-vous
- ✅ `users` - Table legacy (compatibilité)

### Données initiales (Script principal)
- ✅ 1 compte administrateur
- ✅ 5 catégories de services
- ✅ 8 services d'exemple
- ✅ 1 client de test
- ✅ 8 index de performance

### Données initiales (Script complet)
- ✅ 2 comptes administrateurs
- ✅ 8 catégories de services
- ✅ 32 services d'exemple
- ✅ 1 client de test
- ✅ 8 index de performance
- ✅ 2 vues SQL (statistiques)

---

## 🔍 VÉRIFICATION

### Après avoir exécuté le script SQL :

Dans Supabase, allez dans **Table Editor** et vérifiez :
- [ ] 7 tables sont visibles
- [ ] Table `profiles` contient le compte admin
- [ ] Table `services_categories` contient les catégories
- [ ] Table `services` contient les services

### Après avoir démarré l'application :

- [ ] Aucune erreur "DATABASE_URL must be set"
- [ ] Aucune erreur de connexion dans la console
- [ ] Connexion réussie avec admin@anaros.com
- [ ] Accès au dashboard

---

## 📖 DOCUMENTATION DÉTAILLÉE

Pour plus d'informations, consultez :

1. **`GUIDE_SUPABASE.md`** - Guide complet pas à pas
2. **`RECAPITULATIF_BD.md`** - Structure détaillée de la BD
3. **`EXEMPLE_CONNEXION.md`** - Exemples de connexion

---

## 🆘 BESOIN D'AIDE ?

### Problème de connexion ?
→ Consultez **`EXEMPLE_CONNEXION.md`**

### Erreur lors de l'exécution du script ?
→ Consultez **`GUIDE_SUPABASE.md`** section "Dépannage"

### Besoin de comprendre la structure ?
→ Consultez **`RECAPITULATIF_BD.md`**

### Vérifier que tout fonctionne ?
→ Exécutez **`test_connexion.sql`** dans Supabase SQL Editor

---

## 📞 INFORMATIONS IMPORTANTES

```
Projet Supabase : anaros gestion app
Mot de passe DB : tCSvv5l7RKZ4jy2i
Email Supabase : solverdb@gmail.com

Compte Admin Application :
Email : admin@anaros.com
Mot de passe : admin123 (À CHANGER !)
```

---

## 🎯 ORDRE DE LECTURE RECOMMANDÉ

1. 📖 **Lisez** `GUIDE_SUPABASE.md` (5 minutes)
2. ⚙️ **Exécutez** `supabase_schema.sql` dans Supabase
3. 🧪 **Testez** avec `test_connexion.sql`
4. 🔗 **Configurez** avec `EXEMPLE_CONNEXION.md`
5. ✅ **Vérifiez** avec `RECAPITULATIF_BD.md`

---

## ✨ FONCTIONNALITÉS DE L'APPLICATION

Une fois connecté, vous pourrez :

- 👥 **Gérer les employés** - Créer, modifier, supprimer des profils
- 💼 **Gérer les services** - Catalogue complet avec prix et durées
- 👤 **Gérer les clients** - Base de données clients avec historique
- 📅 **Planifier des rendez-vous** - Calendrier interactif
- 📊 **Consulter les statistiques** - Dashboard avec KPIs
- 💰 **Suivre les revenus** - Jour, mois, année
- 🏆 **Top employés** - Classement mensuel
- ⭐ **Client VIP** - Meilleur client du mois

---

**Date de création** : 06/02/2026  
**Version** : 1.0  
**Application** : ANAROS - Système de gestion de salon  
**Développé pour** : Gestion complète de salon de beauté

---

## 🚀 PRÊT À COMMENCER ?

1. Ouvrez **`GUIDE_SUPABASE.md`**
2. Suivez les étapes
3. Profitez de votre application ! 🎉
