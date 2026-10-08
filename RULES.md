# Règles de travail

Ces règles s’appliquent aux contributeurs humains et automatisés. Le PRD est la source de vérité produit tant qu’une décision documentée ne le modifie pas.

## Produit et périmètre

1. Le produit est un compagnon d’entraînement oral en français.
2. Favoriser le passage à la pratique plutôt qu’une longue lecture.
3. Un utilisateur doit pouvoir faire une séance sans compte.
4. Les modes solo, duo et groupe doivent être indiqués sans ambiguïté.
5. Afficher les besoins matériels et la durée avant de commencer.
6. Une autoévaluation ne doit pas prétendre mesurer objectivement l’éloquence.
7. Ne pas ajouter de classement, profil public ou réseau social au MVP.
8. Ne pas ajouter de notation automatique de voix, accent, visage ou persuasion.
9. Ne pas ajouter d’analyse IA ou de visioconférence au MVP.
10. Les exercices doivent être compréhensibles sans consulter un ouvrage externe.
11. Préférer des consignes originales et synthétiques.
12. Vérifier les droits avant de publier du contenu dérivé commercialement.
13. Documenter les limites des exercices à distance ou en solo.
14. Les choix non critiques peuvent avancer avec une hypothèse réversible documentée.
15. Ne pas présenter une idée du PRD comme une fonctionnalité déjà livrée.

## Architecture et code

16. Inspecter l’existant avant toute modification.
17. Lire les règles locales et la documentation liée à la zone modifiée.
18. Adapter l’architecture à la stack réellement retenue.
19. Ne pas introduire une dépendance sans besoin vérifié.
20. Préférer une solution simple, lisible et supprimable.
21. Garder les règles métier indépendantes de l’interface lorsque cela reste raisonnable.
22. Éviter les abstractions génériques sans cas d’usage réel.
23. Ne pas dupliquer la source de vérité d’une donnée.
24. Donner des noms explicites aux fonctions, variables et fichiers.
25. Utiliser le typage strict lorsqu’il est pris en charge par la stack.
26. Valider les données provenant de l’utilisateur, du navigateur, de fichiers ou du réseau.
27. Rendre les erreurs importantes visibles et compréhensibles.
28. Ne pas remplacer une erreur par une valeur silencieuse.
29. Garder les composants d’interface de taille raisonnable.
30. Préserver les conventions existantes plutôt que reformater tout le dépôt.
31. Documenter les décisions qui affectent la structure ou les données.
32. Ne pas déclarer une plateforme compatible sans vérification.
33. Mesurer avant d’ajouter une optimisation de performance.
34. Éviter les animations qui nuisent à la lisibilité ou au contrôle du temps.

## Données et vie privée

35. Le mode de base ne doit pas exiger de compte.
36. Décrire où les bilans de séance sont stockés.
37. Documenter les durées de conservation et le comportement d’effacement.
38. L’enregistrement audio doit résulter d’une action explicite.
39. Ne jamais envoyer un enregistrement sans consentement clair.
40. Rendre l’état d’enregistrement visible pendant toute la capture.
41. Proposer un moyen compréhensible d’écouter et d’effacer un enregistrement local.
42. Ne pas journaliser le contenu des notes personnelles ou des enregistrements.
43. Ne jamais commiter de secret, jeton, certificat privé ou donnée personnelle.
44. Fournir un fichier d’exemple pour les variables d’environnement, sans valeurs secrètes.
45. Définir les unités et fuseaux horaires des dates persistées.
46. Préserver les données lors d’une évolution de schéma.
47. Versionner toute migration de données nécessaire.
48. Une opération multi-étapes persistante doit gérer les interruptions.
49. Toute suppression de données doit être explicite pour l’utilisateur.
50. Ne pas collecter de données qui ne servent pas à un besoin produit.

## Interface et accessibilité

51. Concevoir d’abord les commandes essentielles pour clavier et écran tactile.
52. Tous les contrôles doivent avoir un nom accessible.
53. Ne pas transmettre une information uniquement par la couleur.
54. Maintenir un contraste lisible pour le texte et les commandes.
55. Respecter la préférence système de réduction des animations.
56. Garder les commandes de chronomètre accessibles pendant la séance.
57. Fournir une alternative textuelle aux consignes sonores.
58. Ne pas démarrer automatiquement microphone ou lecture audio.
59. Afficher le temps restant sans dépendre uniquement d’un signal sonore.
60. Vérifier les parcours sur petit écran avant de déclarer le support mobile.
61. Les erreurs de formulaire doivent expliquer comment corriger la saisie.
62. Le focus clavier doit rester visible.
63. Éviter les libellés culpabilisants ou compétitifs.
64. Permettre de reprendre ou recommencer sans jugement.

## Qualité et tests

65. Associer les tests aux comportements observables importants.
66. Couvrir les cas nominaux, invalides et limites pour la logique métier.
67. Tester les frontières de stockage et les erreurs de permission.
68. Tester les dates autour du changement de jour si une date est persistée.
69. Tester le démarrage, la pause, la reprise et la fin du chronomètre.
70. Tester le refus du microphone et l’absence de matériel compatible.
71. Ne pas prétendre qu’un test passe sans l’avoir exécuté.
72. Rapporter les commandes exécutées et leurs résultats.
73. Ne pas ajouter ou exécuter de tests sans demande explicite; cette restriction d’environnement prévaut.
74. Distinguer un échec préexistant d’un échec introduit par le changement.
75. Garder les tests déterministes et indépendants du réseau si possible.
76. Documenter les contrôles manuels qui ne sont pas automatisés.

## Git et revue

77. Ne pas travailler directement sur `main` ou `master`.
78. Créer une branche de travail dédiée.
79. Utiliser les préfixes `feat/`, `fix/`, `docs/`, `refactor/`, `test/` ou `chore/`.
80. Ne jamais écraser des modifications préexistantes non comprises.
81. Ne jamais utiliser `reset --hard` ou un push forcé.
82. Ne pas supprimer de branche ou worktree sans autorisation.
83. Écrire des commits petits et cohérents en Conventional Commits.
84. Relire le diff avant commit.
85. Écarter les fichiers temporaires et artefacts générés du commit.
86. Chaque pull request explique le contexte et le comportement attendu.
87. Une pull request indique les tests et contrôles réellement effectués.
88. Ajouter des captures d’écran lorsque l’interface change.
89. Vérifier la CI avant de fusionner.
90. Ne pas fusionner si des contrôles requis échouent.
91. Synchroniser les changements avec la branche principale après fusion.

## Documentation et livraison

92. Mettre à jour le README quand les commandes ou le périmètre changent.
93. Mettre à jour le changelog pour un changement visible par l’utilisateur.
94. Décrire les variables, scripts et prérequis dans la documentation de développement.
95. Décrire les limites et le statut réel dans la roadmap.
96. Consigner les décisions structurantes avec leur contexte et conséquences.
97. Documenter chaque commande de validation disponible.
98. Ne pas inventer de procédure de déploiement avant le choix d’une plateforme.
99. Signaler les références vers des fichiers absents.
100. Relire les liens internes après toute création ou suppression de document.
101. Résumer les changements, vérifications, limites et prochaines étapes.
102. Laisser un diff limité au besoin demandé.
