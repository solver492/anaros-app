# ⚡ INSTALLATION RAPIDE - 5 MINUTES

## 🎯 POUR LES PRESSÉS

### 1️⃣ Supabase (2 min)
```
1. Ouvrir https://supabase.com
2. SQL Editor → New Query
3. Copier/Coller supabase_schema.sql
4. Run ▶️
```

### 2️⃣ Récupérer l'URL (1 min)
```
Settings → Database → Connection string (URI)
Copier l'URL complète
```

### 3️⃣ Fichier .env (1 min)
```env
DATABASE_URL=postgresql://postgres:tCSvv5l7RKZ4jy2i@db.[VOTRE-REF].supabase.co:5432/postgres
```
**Remplacez [VOTRE-REF] par votre référence Supabase**

### 4️⃣ Redémarrer (1 min)
```bash
npm run dev
```

### 5️⃣ Se connecter
```
http://localhost:3000
Email: admin@anaros.com
Mot de passe: admin123
```

---

## ✅ C'EST TOUT !

**Temps total : 5 minutes**

---

## 📚 Pour plus de détails

- Guide complet : `GUIDE_SUPABASE.md`
- Aide connexion : `EXEMPLE_CONNEXION.md`
- Structure BD : `RECAPITULATIF_BD.md`
- Index général : `README_SUPABASE.md`

---

## 🆘 Problème ?

### Erreur "DATABASE_URL must be set"
→ Vérifiez le fichier .env et redémarrez

### Erreur de connexion
→ Vérifiez l'URL dans .env

### Pas de tables
→ Réexécutez supabase_schema.sql

### Impossible de se connecter
→ Vérifiez que le script SQL a été exécuté

---

## 📞 Infos importantes

```
Mot de passe DB: tCSvv5l7RKZ4jy2i
Admin app: admin@anaros.com / admin123
```

**⚠️ Changez le mot de passe admin après connexion !**
