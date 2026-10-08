# Développement

## Stack

Vite + TypeScript, sans framework UI ni dépendance runtime. La sortie est un site statique adapté à Vercel. Le plan Hobby est gratuit pour un usage personnel ou non commercial selon les conditions Vercel; un projet commercial requiert une autre formule.

## Prérequis observés à l’initialisation

- Git 2.54.0.windows.1
- Node.js 22.12 ou plus récent.
- npm.

## Commandes

- `npm install` : installer les dépendances de développement.
- `npm run dev` : démarrer le serveur local Vite.
- `npm run build` : vérifier le typage TypeScript puis générer `dist/`.
- `npm run preview` : prévisualiser le build local.

## Variables et secrets

Aucune variable d’environnement n’est requise. Le prototype ne nécessite aucune fonction Vercel, base de données, clé API ou service payant.

## Dépannage

Si le build échoue, vérifier la version de Node et relancer `npm install`. Consulter `../PRD.md` pour le périmètre, `DECISIONS.md` pour les hypothèses et `EXERCICES.md` pour le catalogue.
