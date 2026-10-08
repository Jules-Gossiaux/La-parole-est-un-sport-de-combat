# Stratégie de tests

## État actuel

Aucun code applicatif, framework de test ou pipeline CI n’est présent. Il n’y a donc pas de commande de test à exécuter à cette étape.

## Couverture attendue quand l’application sera créée

- tests unitaires des filtres et de la compatibilité mode/durée;
- tests du cycle du chronomètre : préparation, parole, retour, pause et reprise;
- tests d’intégration du stockage local, de l’effacement et des données invalides;
- tests des permissions microphone, refus et absence de support;
- tests d’interface au clavier et sur écran étroit pour les parcours de séance.

Ces éléments sont des objectifs, non des tests existants. La stratégie devra suivre la stack retenue et couvrir les erreurs et cas limites en plus du parcours nominal. Les contrôles manuels devront être indiqués séparément des contrôles automatisés.
