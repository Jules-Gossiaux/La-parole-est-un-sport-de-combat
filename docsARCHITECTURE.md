# Architecture

## État observé

Le dépôt ne contient actuellement que `PRD.md` et `.vscode/settings.json`. Il n’existe pas encore de code, de framework, de modèle de données, de workflow CI ou de configuration de déploiement.

## Cible produit

Le PRD décrit une application web de séances guidées. Les responsabilités candidates sont :

- catalogue et filtres d’exercices;
- orchestration d’une séance et de ses phases chronométrées;
- génération de sujets et rôles;
- bilan privé de séance;
- capture audio facultative et gestion locale des enregistrements.

Ces éléments sont des frontières conceptuelles, pas une architecture implémentée. La stack, les choix de stockage et le déploiement restent à décider.

## Données et frontières

Le PRD demande un usage sans compte, un historique local effaçable et des enregistrements conservés localement. Il ne précise pas le format, la durée de conservation ni la stratégie de sauvegarde. Ne pas ajouter de service distant ni de collecte analytique sans décision produit et documentation de confidentialité.

Dates des séances devront distinguer l’instant enregistré et son affichage dans le fuseau local. Les unités du chronomètre devront être définies dans l’implémentation.

## Contenu

Le PRD référence `EXERCICES.md`, absent du dépôt. Son origine mentionnée est un ouvrage publié; chaque fiche future doit être formulée de façon originale et faire l’objet d’une vérification des droits avant publication.
