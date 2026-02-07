# 🔗 EXEMPLE DE CONNEXION SUPABASE

## 📝 Format de l'URL de connexion

Votre URL de connexion Supabase suit ce format :

```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

## 🔍 Comment trouver votre PROJECT_REF

1. Connectez-vous à https://supabase.com
2. Ouvrez votre projet "anaros gestion app"
3. Allez dans **Settings** (⚙️) → **Database**
4. Sous "Connection string", sélectionnez **URI**
5. Vous verrez quelque chose comme :
   ```
   postgresql://postgres.[PROJECT_REF]:tCSvv5l7RKZ4jy2i@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```

## 📋 Exemples d'URLs possibles

Votre URL devrait ressembler à l'une de ces formes :

### Format 1 : Direct Connection (Recommandé pour le développement)
```
postgresql://postgres:tCSvv5l7RKZ4jy2i@db.ysaysbafnzylzvwzvkdj.supabase.co:5432/postgres
```

### Format 2 : Connection Pooling (Pour la production)
```
postgresql://postgres.ysaysbafnzylzvwzvkdj:tCSvv5l7RKZ4jy2i@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

## ⚙️ Configuration du fichier .env

Ouvrez le fichier `.env` à la racine de votre projet et modifiez-le ainsi :

```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:tCSvv5l7RKZ4jy2i@db.[VOTRE-PROJECT-REF].supabase.co:5432/postgres
SESSION_SECRET=your-secret-key-change-this-in-production
PORT=3000
```

**Remplacez `[VOTRE-PROJECT-REF]` par votre référence de projet réelle**

## 🧪 Tester la connexion

### Méthode 1 : Via l'application
```bash
# Redémarrez l'application
npm run dev
```

Si la connexion fonctionne, vous verrez dans la console :
```
serving on http://0.0.0.0:3000
```

Sans erreur de connexion à la base de données.

### Méthode 2 : Via Supabase Dashboard
1. Allez dans **Table Editor** dans Supabase
2. Cliquez sur la table **profiles**
3. Vous devriez voir le compte admin créé

## 🔧 Exemple complet de configuration

Voici un exemple complet de fichier `.env` fonctionnel :

```env
# Mode de développement
NODE_ENV=development

# URL de connexion Supabase (REMPLACEZ avec votre URL réelle)
DATABASE_URL=postgresql://postgres:tCSvv5l7RKZ4jy2i@db.ysaysbafnzylzvwzvkdj.supabase.co:5432/postgres

# Secret pour les sessions (changez en production)
SESSION_SECRET=votre-secret-super-securise-a-changer-en-production

# Port de l'application
PORT=3000
```

## 📊 Vérification de la connexion

Une fois l'application démarrée, testez :

1. **Ouvrez** http://localhost:3000
2. **Connectez-vous** avec :
   - Email : `admin@anaros.com`
   - Mot de passe : `admin123`
3. **Vérifiez** que vous accédez au dashboard

## ❌ Erreurs courantes et solutions

### Erreur : "DATABASE_URL must be set"
**Cause** : Le fichier .env n'est pas lu ou DATABASE_URL n'est pas défini
**Solution** :
1. Vérifiez que le fichier `.env` existe à la racine du projet
2. Vérifiez qu'il contient bien la ligne `DATABASE_URL=...`
3. Redémarrez l'application (Ctrl+C puis `npm run dev`)

### Erreur : "Connection timeout" ou "ECONNREFUSED"
**Cause** : L'URL de connexion est incorrecte
**Solution** :
1. Vérifiez que vous avez copié la bonne URL depuis Supabase
2. Vérifiez que le mot de passe est correct : `tCSvv5l7RKZ4jy2i`
3. Vérifiez que votre projet Supabase est actif

### Erreur : "password authentication failed"
**Cause** : Le mot de passe dans l'URL est incorrect
**Solution** :
1. Vérifiez que le mot de passe est bien `tCSvv5l7RKZ4jy2i`
2. Pas d'espaces avant ou après le mot de passe
3. Vérifiez dans Supabase Settings → Database que c'est le bon mot de passe

### Erreur : "relation 'profiles' does not exist"
**Cause** : Le script SQL n'a pas été exécuté
**Solution** :
1. Allez dans Supabase SQL Editor
2. Exécutez le fichier `supabase_schema.sql`
3. Vérifiez dans Table Editor que les tables sont créées

## 🎯 Checklist de connexion

- [ ] Projet Supabase créé et actif
- [ ] Script SQL exécuté (supabase_schema.sql)
- [ ] Tables visibles dans Table Editor
- [ ] Compte admin visible dans la table profiles
- [ ] URL de connexion copiée depuis Supabase
- [ ] Fichier .env mis à jour avec la bonne URL
- [ ] Application redémarrée (npm run dev)
- [ ] Aucune erreur de connexion dans la console
- [ ] Connexion réussie avec admin@anaros.com

## 📞 Informations importantes

```
Projet Supabase : anaros gestion app
Mot de passe DB : tCSvv5l7RKZ4jy2i
Email Supabase : solverdb@gmail.com

Compte Admin App :
Email : admin@anaros.com
Mot de passe : admin123
```

## 🚀 Une fois connecté

Vous pourrez :
- ✅ Créer des employés
- ✅ Ajouter des services
- ✅ Enregistrer des clients
- ✅ Planifier des rendez-vous
- ✅ Consulter les statistiques
- ✅ Gérer le calendrier

## 📚 Fichiers de référence

- `GUIDE_SUPABASE.md` - Guide complet étape par étape
- `RECAPITULATIF_BD.md` - Récapitulatif de la structure
- `supabase_schema.sql` - Script SQL à exécuter
- `supabase_schema_complet.sql` - Script SQL avec plus de données

---

**Besoin d'aide ?** Relisez le GUIDE_SUPABASE.md pour plus de détails !
