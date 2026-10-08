# Architecture

## État observé

Le dépôt contient le PRD, le catalogue éditorial et la documentation de cadrage, mais pas encore de code applicatif. Il n’existe pas de framework, de modèle de données, de workflow CI ou de configuration de déploiement.

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

Le catalogue de départ est dans `EXERCICES.md`. Son origine éditoriale est un ouvrage publié; vérifier les droits avant toute publication commerciale et garder les formulations du projet originales.
