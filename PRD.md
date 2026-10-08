# PRD — La parole est un sport de combat

**Statut :** proposition de produit, prête à servir de base au prototype  
**Langue du produit :** français  
**Source éditoriale de départ :** exercices inspirés de *La parole est un sport de combat* de Bertrand Périer. Les consignes ci-dessous sont reformulées et synthétisées; vérifier les autorisations nécessaires avant toute publication commerciale de contenu dérivé.

## Résumé

Créer un site web qui aide chacun à s’entraîner à parler en public, seul ou avec d’autres. Le site transforme un catalogue d’exercices en séances courtes et guidées : l’utilisateur choisit son contexte, reçoit une consigne et un sujet, s’entraîne avec un chrono, puis fait un bilan de sa prise de parole. La valeur du produit repose sur le passage à l’action et la répétition, pas sur la lecture d’une liste.

## Problème

Les personnes qui veulent mieux parler en public savent souvent qu’il faut pratiquer, mais ne savent pas quoi dire, comment commencer, combien de temps s’entraîner ni comment mesurer leurs progrès. Les exercices de prise de parole sont aussi difficiles à retrouver et à adapter à une séance de cinq ou dix minutes.

## Vision et proposition de valeur

Permettre à toute personne de commencer une pratique orale en quelques secondes, avec un exercice adapté au temps disponible et au nombre de participants.

**Promesse :** « Choisissez un exercice, lancez-vous, recommencez demain. »

Le site doit être un compagnon d’entraînement : il donne une structure, mais la progression vient de la parole prononcée et des retours reçus.

## Publics

- **Débutant solo** : veut gagner en aisance sans devoir s’inscrire à un cours ou trouver immédiatement un partenaire.
- **Étudiant ou candidat** : prépare un exposé, un entretien ou un concours d’éloquence.
- **Binôme ou petit groupe** : cherche une activité guidée pour travailler l’écoute, l’argumentation et les réponses aux questions.
- **Enseignant ou animateur** : veut choisir rapidement un exercice et organiser une séance collective.

## Objectifs

1. Permettre de démarrer un exercice en moins d’une minute.
2. Proposer des exercices réalisables seul, à deux ou en groupe, avec le mode clairement indiqué.
3. Aider l’utilisateur à pratiquer de façon régulière grâce à des séances courtes et répétables.
4. Rendre les consignes compréhensibles sans devoir consulter le livre.
5. Aider à constater ses progrès sans prétendre noter objectivement l’éloquence.

## Hors périmètre pour la première version

- Notation automatique de la voix, de l’accent, du visage ou de la qualité persuasive.
- Réseau social, profils publics, classement ou compétition entre utilisateurs.
- Coaching généré par IA ou analyse automatique des enregistrements.
- Visioconférence intégrée et mise en relation d’inconnus.
- Reproduction intégrale du texte ou des consignes du livre.

## Parcours principal

1. L’utilisateur choisit **seul**, **à deux** ou **en groupe**.
2. Il choisit une durée ou un objectif : voix, gestuelle, improvisation, argumentation, entretien, médias.
3. Le site propose un exercice compatible et un sujet. L’utilisateur peut en tirer un autre.
4. L’écran de pratique affiche la consigne, les rôles, le temps de préparation et le temps de parole.
5. L’utilisateur s’entraîne, éventuellement en enregistrant son audio localement.
6. Le site propose un bilan simple : ce qui a été réussi, une chose à améliorer et une prochaine répétition.

## Exigences fonctionnelles

### P0 — MVP

- Catalogue filtrable par mode (solo, duo, groupe), thème et durée.
- Fiche exercice avec but, matériel éventuel, nombre de participants, étapes, durée et variantes.
- Générateur de sujets et de rôles pour les exercices qui en ont besoin.
- Chronomètre simple avec préparation, prise de parole et temps de retour.
- Mode plein écran utilisable sur téléphone, tablette et ordinateur.
- Bilan de séance privé, stocké dans le navigateur : exercice fait, date, autoévaluation et note personnelle.
- Enregistrement audio facultatif, déclenché explicitement par l’utilisateur et conservé localement; possibilité de l’écouter ou de l’effacer.
- Pas de compte requis pour réaliser une séance.

## Catalogue d’exercices prévu

Le document [docs/EXERCICES.md](docs/EXERCICES.md) contient les consignes détaillées des 32 exercices du catalogue. La version actuelle les rend tous jouables avec un déroulé adapté :

| Thème | Exercices | Mode principal |
|---|---|---|
| Gestuelle | Le ventriloque; Le marionnettiste; L’imitateur; Face à l’écran | Duo/groupe ou solo |
| Voix | La posture; La paille imaginaire; Le bâillement; Le périph; Les chaises émotionnelles; Les fruits et légumes; Les discours multicolores | Solo, duo ou groupe |
| Vocabulaire | Le buzzer « euh » | Solo ou groupe |
| Discours | Le mini-discours; Chronique radiophonique; Autoportrait en texte à trous | Solo ou duo |
| Débat et conviction | Ping-pong d’arguments; Débat selon son rôle; Débat parlementaire; Mises en situation de conviction; Vente aux enchères; Plaidoirie à partir d’un cas | Duo/groupe |
| Vie professionnelle | Entretien d’embauche; Conférence de presse; La battle | Solo, duo ou groupe |
| Argumentation | Le faux procès; Les catégories d’arguments; Adapter son discours au public | Solo ou groupe |
| Médias | Le micro-trottoir; L’interview-piège; La conférence de presse de crise; Le buzzer « jargon » | Solo, duo ou groupe |
| Discours politique | Le discours de candidature | Solo ou groupe |

## Principes de conception

- **Pratique avant lecture :** la fiche donne d’abord le prochain geste à faire.
- **Faible friction :** accès sans compte, sujet prêt à l’emploi et bouton de démarrage visible.
- **Encouragement sans jugement :** autoévaluation descriptive, pas de score global.
- **Progression :** proposer des répétitions et des variantes plus difficiles, sans présenter l’aisance comme une qualité innée.
- **Adaptation :** signaler clairement ce qui demande un partenaire, un groupe, une chaise, un mur ou une caméra.
- **Accessibilité :** navigation clavier, textes lisibles, couleurs contrastées, commandes de chrono accessibles et alternative au son pour lire les consignes.
- **Vie privée :** les exercices peuvent être faits sans compte; aucun enregistrement n’est envoyé par défaut.

## Risques et réponses

- **Certains exercices ne se remplacent pas par une interface.** Le site doit faciliter les exercices en présence et ne pas promettre qu’un partenaire virtuel équivaut à un auditoire réel.
- **La pratique peut être intimidante.** Commencer par des prises de parole courtes, offrir un mode sans enregistrement et normaliser les reprises.
- **Le catalogue dépend d’un ouvrage publié.** Employer des formulations originales, vérifier les droits avant mise en ligne publique et ajouter des exercices originaux au fil du temps.
- **L’autoévaluation peut décourager.** Poser une question à la fois et suivre les répétitions plutôt que classer les personnes.

## Critères d’acceptation du MVP

- Une personne peut trouver un exercice compatible avec son nombre de participants et sa durée.
- Chaque exercice a une consigne, un objectif, des étapes et une durée indicative.
- Les séances chronométrées sont utilisables au clavier et sur écran mobile.
- L’enregistrement est facultatif et son état de conservation est explicite.
- L’utilisateur peut terminer sans créer de compte et effacer son historique local.
- Les fiches indiquent clairement quand une autre personne ou un espace physique est nécessaire.

## Références éditoriales

Les pages indiquées dans [docs/EXERCICES.md](docs/EXERCICES.md) sont les pages du PDF fourni dans la conversation. Elles servent à retrouver les passages sources; les consignes de ce projet sont reformulées en langage pratique.
