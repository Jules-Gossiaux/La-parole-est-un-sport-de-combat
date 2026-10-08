# Stratégie de tests

## État actuel

Le prototype a une commande de build (`npm run build`) qui exécute le contrôle TypeScript puis génère les fichiers statiques. Aucun framework de test, suite automatisée ou pipeline CI n’est configuré.

## Couverture attendue quand l’application sera créée

- tests unitaires des filtres et de la compatibilité mode/durée;
- tests du cycle du chronomètre : préparation, parole, retour, pause et reprise;
- tests d’intégration du stockage local, de l’effacement et des données invalides;
- tests des permissions microphone, refus et absence de support;
- tests d’interface au clavier et sur écran étroit pour les parcours de séance.

Ces éléments sont des objectifs, non des tests existants. La stratégie devra couvrir les erreurs et cas limites en plus du parcours nominal. Aucun contrôle manuel d’accessibilité ou de navigateur n’a encore été effectué.
