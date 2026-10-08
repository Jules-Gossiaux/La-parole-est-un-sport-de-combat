# Architecture

## État observé

Le prototype est une SPA statique construite avec Vite et TypeScript, sans framework UI, backend, base distante ou service tiers. Vite produit des fichiers statiques pour l’hébergement Vercel. Le catalogue est importé depuis `EXERCICES.md` à la compilation.

## Cible produit

Le PRD décrit une application web de séances guidées. Les responsabilités candidates sont :

- catalogue et filtres d’exercices;
- orchestration d’une séance et de ses phases chronométrées;
- génération de sujets et rôles;
- bilan privé de séance;
- capture audio facultative et gestion locale des enregistrements.

Le catalogue contient 32 fiches, dont huit sont interactives au MVP; les 24 autres sont affichées comme bientôt disponibles. Les filtres, les fiches, les sujets, le chronomètre et le bilan local sont implémentés. L’audio local et la génération de rôles ne le sont pas encore.

## Données et frontières

Les bilans sont sauvegardés dans `localStorage`, limités aux 100 séances récentes et effaçables depuis l’interface. Ils restent liés au navigateur et au profil local. Aucun contenu utilisateur n’est envoyé à un serveur par l’application. Le PRD prévoit l’audio local, mais cette fonction reste à développer.

Dates des séances devront distinguer l’instant enregistré et son affichage dans le fuseau local. Les unités du chronomètre devront être définies dans l’implémentation.

## Contenu

Le catalogue de départ est dans `EXERCICES.md`. Son origine éditoriale est un ouvrage publié; vérifier les droits avant toute publication commerciale et garder les formulations du projet originales.
