# Stratégie de tests

## État actuel

`npm run build` exécute le contrôle TypeScript puis génère les fichiers statiques. `npm test` utilise le module de test intégré à Node et happy-dom pour vérifier les 32 correspondances catalogue/jeu, le changement d’étape et de consigne, les responsabilités attribuées dans l’ordre, les outils affichés à la bonne étape et l’enregistrement du bilan.

## Couverture à compléter

- tests unitaires des filtres et de la compatibilité mode/durée;
- tests du stockage local face à des données invalides et de l’effacement de l’historique;
- tests d’interface au clavier et sur écran étroit pour les parcours de séance.

Le test d’intégration parcourt les phases et vérifie pause et reprise du minuteur. L’enregistrement audio prévu dans le PRD et l’édition d’une entrée d’historique restent à développer. L’accessibilité clavier et le rendu sur petits écrans restent à vérifier manuellement.
