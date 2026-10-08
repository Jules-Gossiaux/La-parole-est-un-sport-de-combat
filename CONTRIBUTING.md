# Contribuer

## Avant de modifier

- Lire `PRD.md` et `RULES.md`.
- Vérifier la branche, l’état Git et les changements locaux.
- Repérer les scripts existants avant d’en proposer de nouveaux.
- Signaler les désaccords de produit dans une décision documentée.

## Workflow

1. Créer une branche dédiée depuis la branche de référence. Ne pas travailler sur `main`.
2. Garder le changement concentré sur un besoin et ses critères d’acceptation.
3. Ajouter ou modifier la documentation et les tests pertinents quand la stack sera en place.
4. Exécuter uniquement les contrôles pertinents et rapporter les résultats exacts.
5. Relire le diff pour repérer secrets, fichiers générés et changements hors sujet.
6. Créer des commits Conventional Commits, par exemple `docs: initialise le cadrage du projet`.
7. Une pull request décrit le contexte, le comportement attendu, les changements, les contrôles et les limites.

## Qualité

Le projet n’a pas encore de stack ni de commandes de qualité. Ne pas annoncer de commande lint, typecheck, test ou build avant qu’elle soit configurée et exécutée. La contribution doit préserver l’accès sans compte et la confidentialité locale prévues par le PRD.
