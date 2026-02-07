# 📄 Documentation Technique - ANAROS (Centre de Beauté)

## 🌟 Présentation Générale
**ANAROS** est une application de gestion complète pour un centre de esthétique et de bien-être. Elle permet de piloter l'ensemble de l'activité, de la prise de rendez-vous à l'analyse des performances financières, en passant par la gestion du personnel.

---

## 🏗️ Architecture Technique (Stack)
L'application repose sur une architecture moderne **Fullstack TypeScript** :

1.  **Frontend** : 
    *   **React + Vite** : Pour une interface rapide et réactive.
    *   **Tailwind CSS + Shadcn UI** : Design premium, moderne et responsive (Dark Mode inclus).
    *   **FullCalendar** : Module interactif pour la gestion de l'agenda.
    *   **TanStack Query** : Gestion optimisée de l'état des données et du cache.

2.  **Backend** :
    *   **Node.js + Express** : Serveur d'API robuste.
    *   **Passport.js** : Système d'authentification sécurisé (Session-based).
    *   **SQLite (Better-sqlite3)** : Base de données locale ultra-performante, idéale pour un déploiement sur VPS sans maintenance complexe.

3.  **ORM / Base de données** :
    *   **Drizzle ORM** : Pour une communication type-safe avec la base de données.

---

## 📂 Structure des Modules (Fonctionnement)

### 1. Authentification & Rôles
L'accès est protégé et segmenté par rôles :
*   **Super Admin / Admin** : Accès total (Dashboard, Finances, Gestion des Utilisateurs).
*   **Réception** : Accès à l'Agenda et aux Clients pour la prise de RDV.
*   **Staff (Employé)** : Accès restreint à leur propre emploi du temps (`My Schedule`).

### 2. Module Agenda (Cœur de l'App)
*   **Vue Multi-Ressources** : Visualisation simultanée du planning de tous les employés.
*   **Prise de RDV intuitive** : Sélection du créneau -> Choix du client -> Prestation -> Assignation automatique basée sur les compétences.
*   **Filtre Dynamique** : Capacité de filtrer l'affichage par employé (Option "Sélectionner tout" / "Désélectionner tout").

### 3. Module Clients
*   Base de données centralisée avec historique des prestations.
*   Recherche rapide par nom ou numéro de téléphone.
*   Suivi des dépenses totales par client (Golden Clients).

### 4. Module Prestations & Compétences
*   **Services** : Gestion des prix, durées et catégories.
*   **Staff Skills** : Liaison intelligente entre les employés et les catégories de services. Un employé ne peut être assigné qu'à une prestation pour laquelle il est qualifié.

### 5. Module Tableau de Bord (Business Intelligence)
Calcul automatique en temps réel des KPIs :
*   **Chiffre d'Affaires** (Mensuel/Journalier).
*   **Top Employés** : Basé sur le revenu généré.
*   **Top Prestations** : Les services les plus demandés.
*   **Client Or** : Identification du client le plus fidèle du mois.

---

## 🔗 Schéma de Données (Drizzle)
La base `data/sqlite.db` contient les tables suivantes :
*   `users / profiles` : Informations sur les comptes et rôles.
*   `clients` : Répertoire client.
*   `categories` : Groupements de services (Coiffure, Soins, etc.).
*   `services` : Détails de chaque prestation.
*   `appointments` : Table centrale liant client, service, staff et horaires.
*   `staff_skills` : Table de liaison entre les employés et leurs spécialités.

---

## 🚀 Guide de Déploiement (Production)
L'application est configurée pour être déployée via **PM2** sur un serveur Linux (Ubuntu 24.04) :
1.  **Build** : `npm run build` (Génère le dossier `dist/`).
2.  **Point d'entrée** : `dist/index.js`.
3.  **Variables .env** :
    *   `DATABASE_URL` : Chemin vers le fichier `.db`.
    *   `SESSION_SECRET` : Clé de cryptage des sessions.
    *   `PORT` : Port d'écoute (par défaut 3010).

---

## 🛠️ Scripts Utilitaires Inclus
Des scripts `tsx` sont disponibles pour la maintenance :
*   `init-sqlite.ts` : Réinitialise la structure de la base.
*   `import-data.ts` : Importe massivement les services et prix.
*   `add-staff.ts` : Ajoute les employés et configure leurs compétences initiales.
*   `cleanup-categories.ts` : Nettoyage des données inutilisées.
