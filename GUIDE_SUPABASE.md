# 🚀 GUIDE DE CONFIGURATION SUPABASE POUR ANAROS

## 📋 INFORMATIONS DE CONNEXION

**Projet Supabase**: anaros gestion app
**Mot de passe de la base de données**: tCSvv5l7RKZ4jy2i

---

## 🔧 ÉTAPES D'INSTALLATION

### 1️⃣ Créer/Accéder à votre projet Supabase

1. Allez sur https://supabase.com
2. Connectez-vous avec votre compte (solverdb@gmail.com)
3. Créez un nouveau projet ou accédez à votre projet existant "anaros gestion app"

### 2️⃣ Exécuter le script SQL

1. Dans le dashboard Supabase, allez dans **SQL Editor** (icône de base de données dans le menu latéral)
2. Cliquez sur **New Query** (Nouvelle requête)
3. Copiez TOUT le contenu du fichier `supabase_schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **Run** (Exécuter) en bas à droite

⏱️ **L'exécution prendra environ 10-15 secondes**

### 3️⃣ Vérifier que tout fonctionne

Après l'exécution, vous devriez voir :
- ✅ Un tableau avec les tables créées (7 tables)
- ✅ Le compte admin affiché
- ✅ Les catégories de services (5 catégories)
- ✅ Les services d'exemple (8 services)

### 4️⃣ Récupérer les informations de connexion

1. Dans Supabase, allez dans **Settings** → **Database**
2. Sous **Connection string**, sélectionnez **URI**
3. Copiez l'URL de connexion (elle ressemble à ceci) :
   ```
   postgresql://postgres:[VOTRE-MOT-DE-PASSE]@db.[VOTRE-REF].supabase.co:5432/postgres
   ```

### 5️⃣ Mettre à jour le fichier .env

Ouvrez le fichier `.env` dans votre projet et mettez à jour la ligne `DATABASE_URL` :

```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:tCSvv5l7RKZ4jy2i@db.[VOTRE-REF].supabase.co:5432/postgres
SESSION_SECRET=your-secret-key-change-this-in-production
PORT=3000
```

**Remplacez `[VOTRE-REF]` par la référence de votre projet Supabase**

---

## 🔑 COMPTE ADMINISTRATEUR PAR DÉFAUT

Une fois le script exécuté, vous pouvez vous connecter avec :

- **Email**: admin@anaros.com
- **Mot de passe**: admin123

⚠️ **IMPORTANT**: Changez ce mot de passe dès votre première connexion !

---

## 📊 STRUCTURE DE LA BASE DE DONNÉES

### Tables créées :

1. **profiles** - Utilisateurs et employés du système
   - Rôles : superadmin, admin, reception, staff
   - Contient : nom, prénom, email, mot de passe, rôle, couleur

2. **services_categories** - Catégories de services
   - Exemples : Coiffure, Esthétique, Manucure, Massage, Maquillage

3. **services** - Catalogue des services
   - Contient : nom, prix (en DA), durée (en minutes), catégorie

4. **staff_skills** - Compétences du personnel
   - Lie les employés aux catégories de services qu'ils maîtrisent

5. **clients** - Base de données clients
   - Contient : nom complet, téléphone, email, notes

6. **appointments** - Rendez-vous
   - Contient : client, employé, service, dates, statut
   - Statuts possibles : pending, confirmed, completed, cancelled

7. **users** - Table legacy (compatibilité)

### Index créés pour optimisation :
- Index sur les clés étrangères des rendez-vous
- Index sur les dates de rendez-vous
- Index sur les statuts
- Index sur les emails et rôles des profils

---

## 🎨 DONNÉES INITIALES INCLUSES

### Catégories de services (5) :
1. Coiffure
2. Esthétique
3. Manucure
4. Massage
5. Maquillage

### Services d'exemple (8) :
1. Coupe Homme - 1500 DA - 30 min
2. Coupe Femme - 2500 DA - 45 min
3. Coloration - 4000 DA - 90 min
4. Soin du visage - 3000 DA - 60 min
5. Manucure classique - 1200 DA - 45 min
6. Pose de vernis semi-permanent - 2000 DA - 60 min
7. Massage relaxant - 3500 DA - 60 min
8. Maquillage de jour - 2500 DA - 45 min

### Compte admin :
- Email : admin@anaros.com
- Mot de passe : admin123
- Rôle : superadmin

### Client de test :
- Nom : Client Test
- Téléphone : 0555123456
- Email : client@example.com

---

## 🔍 VÉRIFICATIONS APRÈS INSTALLATION

### Dans Supabase :

1. Allez dans **Table Editor**
2. Vérifiez que vous voyez toutes les tables
3. Cliquez sur **profiles** → vous devriez voir le compte admin
4. Cliquez sur **services_categories** → vous devriez voir 5 catégories
5. Cliquez sur **services** → vous devriez voir 8 services

### Dans votre application :

1. Assurez-vous que `npm run dev` est en cours d'exécution
2. Ouvrez http://localhost:3000
3. Essayez de vous connecter avec admin@anaros.com / admin123
4. Vous devriez accéder au dashboard

---

## ⚙️ COMMANDES UTILES

### Redémarrer l'application après changement de .env :
```bash
# Arrêter l'application (Ctrl+C dans le terminal)
npm run dev
```

### Vérifier la connexion à la base de données :
L'application affichera dans la console si la connexion est réussie au démarrage.

---

## 🆘 DÉPANNAGE

### Erreur "DATABASE_URL must be set"
- Vérifiez que le fichier `.env` contient bien la ligne `DATABASE_URL`
- Vérifiez que vous avez redémarré l'application après modification

### Erreur de connexion à Supabase
- Vérifiez que l'URL de connexion est correcte
- Vérifiez que le mot de passe est correct (tCSvv5l7RKZ4jy2i)
- Vérifiez que votre projet Supabase est actif

### Les tables ne s'affichent pas
- Assurez-vous d'avoir exécuté TOUT le script SQL
- Vérifiez qu'il n'y a pas d'erreurs dans l'éditeur SQL de Supabase

### Impossible de se connecter avec admin@anaros.com
- Vérifiez que le script SQL a bien été exécuté
- Vérifiez dans Supabase Table Editor → profiles que le compte existe

---

## 📝 NOTES IMPORTANTES

1. **Sécurité** : Le mot de passe admin par défaut (admin123) doit être changé en production
2. **Backup** : Pensez à faire des sauvegardes régulières de votre base de données
3. **RLS** : Row Level Security est désactivé pour simplifier le développement. Activez-le en production si nécessaire
4. **Prix** : Tous les prix sont en dinars algériens (DA)
5. **Durées** : Toutes les durées sont en minutes

---

## 🎯 PROCHAINES ÉTAPES

1. ✅ Exécuter le script SQL dans Supabase
2. ✅ Mettre à jour le fichier .env avec la bonne DATABASE_URL
3. ✅ Redémarrer l'application
4. ✅ Se connecter avec le compte admin
5. ✅ Créer vos propres employés, services et clients
6. ✅ Commencer à utiliser l'application !

---

**Besoin d'aide ?** Consultez la documentation Supabase : https://supabase.com/docs
