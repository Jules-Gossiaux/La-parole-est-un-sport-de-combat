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

Le catalogue contient 32 fiches et chaque exercice est jouable. Sa configuration dédiée fournit les sujets, les rôles, le matériel, les consignes et les phases. Des widgets spécifiques servent au comptage, au suivi d’une trame, au remplissage de phrases et au tour de parole. L’audio local et l’édition des bilans restent à développer.

## Données et frontières

Les bilans sont sauvegardés dans `localStorage`, limités aux 100 séances récentes et effaçables depuis l’interface. Ils restent liés au navigateur et au profil local. Aucun contenu utilisateur n’est envoyé à un serveur par l’application. Le PRD prévoit l’audio local, mais cette fonction reste à développer.

Dates des séances devront distinguer l’instant enregistré et son affichage dans le fuseau local. Les unités du chronomètre devront être définies dans l’implémentation.

## Contenu

Le catalogue éditorial est dans `EXERCICES.md`; les données d’exécution propres aux jeux sont dans `src/games.json`. Son origine éditoriale est un ouvrage publié; vérifier les droits avant toute publication et garder les formulations du projet originales.
