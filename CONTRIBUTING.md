# Contribuer

## Avant de modifier

- Lire `PRD.md` et `RULES.md`.
- Vérifier la branche, l’état Git et les changements locaux.
- Repérer les scripts existants avant d’en proposer de nouveaux.
- Signaler les désaccords de produit dans une décision documentée.

## Workflow

1. Créer une branche dédiée depuis la branche de référence. Ne pas travailler sur `main`.
2. Garder le changement concentré sur un besoin et ses critères d’acceptation.
3. Ajouter ou modifier la documentation et les tests pertinents. Les déroulés des exercices sont définis dans `src/games.json`.
4. Exécuter uniquement les contrôles pertinents et rapporter les résultats exacts.
5. Relire le diff pour repérer secrets, fichiers générés et changements hors sujet.
6. Créer des commits Conventional Commits, par exemple `docs: initialise le cadrage du projet`.
7. Une pull request décrit le contexte, le comportement attendu, les changements, les contrôles et les limites.

## Qualité

Commandes disponibles : `npm run build` pour le contrôle TypeScript et le build, `npm test` pour les données des 32 jeux et leur parcours de séance. Il n’y a pas encore de commande lint. La contribution doit préserver l’accès sans compte et la confidentialité locale prévues par le PRD.
