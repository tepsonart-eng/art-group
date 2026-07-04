# TEPSON ART GROUP — Site web

Site vitrine premium pour TEPSON ART GROUP, agence de production audiovisuelle à Yaoundé (Cameroun). Construit avec Next.js 16 (App Router, Turbopack), Tailwind CSS v4, Framer Motion, Prisma (SQLite), et un espace admin maison entièrement fonctionnel.

**État du projet : entièrement fonctionnel avec du contenu de démonstration.** Les vrais visuels (logo, vidéo, photos), textes définitifs et informations légales restent à fournir par l'agence (voir section « Contenu à remplacer » ci-dessous) — tout est déjà éditable depuis l'espace admin.

---

## 1. Démarrage rapide

Prérequis : [Node.js](https://nodejs.org) 20.9 ou plus récent.

```bash
npm install        # installe les dépendances + génère le client Prisma (postinstall)
npm run db:migrate  # crée la base SQLite locale (prisma/dev.db) à partir du schéma
npm run db:seed      # remplit la base avec le contenu de démonstration + le compte admin
npm run dev           # démarre le serveur de développement
```

Ouvrez [http://localhost:3000](http://localhost:3000) — vous serez redirigé vers `/fr`.

Sous Windows, un double-clic sur `run-dev.bat` lance aussi le serveur (pratique si `npm` n'est pas dans le PATH d'un terminal donné).

### Compte administrateur par défaut

Créé par `npm run db:seed` :

- URL : `http://localhost:3000/admin/login`
- Email : `tepsonart@gmail.com`
- Mot de passe : `TepsonArt2026!`

**Changez ce mot de passe dès la mise en ligne** (espace admin → Utilisateurs admin, ou en créant un nouveau Super admin puis en supprimant l'ancien compte).

---

## 2. Variables d'environnement (`.env`)

Un fichier `.env` est déjà présent avec des valeurs par défaut fonctionnelles en local. À ajuster en production :

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Connexion SQLite locale (`file:./dev.db`). Pour la prod, voir section 6. |
| `SESSION_SECRET` | Change-la avant la mise en ligne (valeur aléatoire longue). |
| `RESEND_API_KEY` | Optionnel. Si vide, les messages du formulaire de contact sont quand même enregistrés en base (visibles dans l'admin) mais aucun email n'est envoyé. Créez une clé sur [resend.com](https://resend.com) pour activer l'envoi. |
| `CONTACT_NOTIFICATION_EMAIL` | Adresse qui reçoit la notification des nouveaux messages (défaut : tepsonart@gmail.com). |
| `RECAPTCHA_SECRET_KEY` / `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Non branchés pour l'instant — un honeypot anti-bot basique est actif par défaut sur les formulaires. À intégrer plus tard si le spam devient un problème. |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site, utilisée pour le sitemap et les métadonnées Open Graph. |

---

## 3. Contenu à remplacer (non technique)

Tout est déjà éditable depuis l'espace admin (`/admin`), mais certains éléments sont encore des placeholders à remplacer par l'agence :

- **Logo réel** : Admin → Paramètres du site → Médias (deux fichiers : fond clair / fond sombre). En attendant, un logo texte + pictogramme wireframe généré s'affiche.
- **Vidéo d'accueil** : Admin → Paramètres du site → Médias → Vidéo d'accueil. En attendant, un fond dégradé animé s'affiche.
- **Photos** (catégories de compétences, projets, partenaires) : actuellement remplacées par des dégradés de couleur nommés. Prévoir un vrai système d'upload d'images si besoin (actuellement les couleurs sont réglables par élément dans l'admin, l'ajout d'upload d'image est une extension simple du même mécanisme que celui déjà en place pour le logo/la vidéo).
- **Textes définitifs** : agence, engagements, FAQ complète — tous éditables dans Admin → Paramètres du site / FAQ / Pourquoi nous choisir / Engagements clients.
- **Mentions légales & politique de confidentialité** : `/fr/mentions-legales` et `/fr/confidentialite` contiennent un texte provisoire clairement identifié comme tel — à finaliser avec le numéro RCCM et l'adresse légale (éditables dans Admin → Paramètres du site → Informations légales).
- **Lien LinkedIn** : Admin → Réseaux sociaux (actuellement vide/masqué).
- **PDF de présentation** : Admin → Paramètres du site → Médias.

---

## 4. Espace admin — fonctionnalités

Accessible sur `/admin`, protégé par authentification (session en base, cookie httpOnly).

- **Rôles** : Super admin (accès total + gestion des utilisateurs), Éditeur, Modérateur.
- **Contenu géré** : compétences, réalisations (projets + filtres), témoignages, avis clients (modération : approuver / masquer / supprimer / bannir IP), FAQ, logos partenaires, bloc « Pourquoi nous choisir », engagements clients, réseaux sociaux, messages du formulaire de contact (avec téléchargement des pièces jointes), paramètres globaux du site (textes, coordonnées, palette de couleurs, modération des avis, médias).
- Toutes les modifications sont reflétées immédiatement sur le site public (pas de cache à vider).

---

## 5. Stack technique

| Couche | Choix | Remarque |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack, React 19.2) | Version très récente : voir `AGENTS.md` pour les changements par rapport aux versions antérieures. |
| Style | Tailwind CSS v4 (config CSS-first dans `globals.css`) | Deux palettes prêtes (rouge/noir, cobalt/or), sélectionnable dans Admin → Paramètres. |
| Animations | Framer Motion | |
| i18n | Système maison (FR/EN), routing par segment `/[locale]` | `next-intl` volontairement écarté : compatibilité incertaine avec une version aussi récente de Next.js au moment du développement. |
| Base de données | SQLite via Prisma ORM 7 (adaptateur `@prisma/adapter-better-sqlite3`) | Facilement migrable vers PostgreSQL (changer `provider` dans `prisma/schema.prisma` + `DATABASE_URL`). |
| Auth admin | Système maison (bcrypt + sessions en base, cookie httpOnly) | `next-auth` volontairement écarté pour la même raison de prudence que next-intl. |
| Emails | Resend (optionnel) | |
| Carrousel | Embla Carousel | |

---

## 6. Déploiement en production

Le projet est prêt pour un déploiement sur **Vercel** (ou tout hébergeur Node.js) :

1. Passez `DATABASE_URL` à une base PostgreSQL managée (Vercel Postgres, Railway, Supabase...) et changez `provider = "sqlite"` en `provider = "postgresql"` dans `prisma/schema.prisma`, puis adaptez `src/lib/prisma.ts` pour utiliser l'adaptateur Postgres correspondant (`@prisma/adapter-pg` par ex.) au lieu de `@prisma/adapter-better-sqlite3`.
2. Exécutez `npx prisma migrate deploy` puis `npm run db:seed` (une seule fois) sur la base de production.
3. Renseignez les variables d'environnement de production (`SESSION_SECRET` fort, `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL`, etc.).
4. Les fichiers uploadés via l'admin (`/uploads` et `/public/uploads`) sont stockés sur le disque local — sur un hébergement serverless (Vercel), prévoir de brancher un stockage externe (S3, Cloudflare R2) avant la mise en production si des médias volumineux sont uploadés fréquemment.

---

## 7. Commandes utiles

```bash
npm run dev          # serveur de développement
npm run build        # build de production
npm run start        # démarrer le build de production
npm run lint         # ESLint
npm run db:migrate   # appliquer une nouvelle migration Prisma (après modification du schéma)
npm run db:seed      # recharger le contenu de démonstration (⚠️ écrase les listes de contenu existantes)
npm run db:studio    # interface graphique Prisma Studio pour explorer la base
```

---

## 8. Notes de développement

- `AGENTS.md` / `CLAUDE.md` : rappels sur les spécificités de cette version de Next.js (générés automatiquement par `create-next-app`).
- Structure : `src/app/[locale]` pour le site public, `src/app/admin` pour l'espace admin, `src/actions` pour les Server Actions, `src/components` pour les composants, `prisma/` pour le schéma et les migrations.
- Formulaires de contact et d'avis protégés par un champ honeypot (anti-bot basique) ; reCAPTCHA/hCaptcha peut être ajouté plus tard si nécessaire.
