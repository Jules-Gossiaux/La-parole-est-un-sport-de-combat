# Décisions et hypothèses

## 2026-10-08 — Initialiser la documentation avant l’application

**Contexte :** le dépôt était sans historique Git et ne contenait que le PRD et un fichier VS Code vide. Le catalogue d’exercices a depuis été ajouté dans ce dossier.

**Décision :** poser les règles de contribution, le statut observé, les limites éditoriales et les objectifs de tests avant de choisir une stack.

**Conséquences :** aucun code applicatif ni dépendance n’est ajouté. Le démarrage du produit nécessite encore une décision technique réversible.

## 2026-10-08 — Préserver un modèle sans compte et local-first

**Contexte :** le PRD demande explicitement des séances sans inscription, un bilan privé dans le navigateur et des enregistrements audio locaux.

**Décision :** traiter ces exigences comme contraintes d’architecture du MVP.

**Conséquences :** le futur choix de stockage devra expliquer sauvegarde, effacement, limites de capacité et comportement lorsque l’utilisateur change d’appareil. Aucun backend n’est présumé.

## En attente

- Confirmer que l’hébergement Hobby Vercel sera réservé à un usage non commercial.
- Politique de conservation des bilans et enregistrements.
- Vérifier les droits des contenus du catalogue avant publication.
- Relier le projet Vercel au dépôt GitHub et choisir la procédure de publication.

## 2026-10-08 — Prototype statique pour l’hébergement gratuit

**Contexte :** le souhait est d’héberger le projet sur Vercel sans frais récurrents.

**Décision :** utiliser Vite et TypeScript pour produire un site statique, sans backend, fournisseur d’authentification, base distante ni service tiers. Les bilans sont gardés dans `localStorage`.

**Conséquences :** pas de frais serveur dans l’architecture actuelle et pas de synchronisation entre appareils. Les conditions Vercel Hobby limitent le plan gratuit aux usages personnels ou non commerciaux. La sortie peut être déployée sur un sous-domaine Vercel gratuit; un domaine personnalisé peut être payant.

## 2026-10-08 — Limiter initialement le MVP à huit exercices (remplacé)

**Contexte :** le catalogue de 32 fiches donnait l’impression que tout était déjà prêt, alors que le premier périmètre doit rester concentré.

**Décision :** commencer avec huit exercices qui couvrent voix, vocabulaire, discours, débat, entretien et médias. Afficher les 24 autres comme « Bientôt disponible » sans les rendre lançables.

**Conséquences :** cette décision a été remplacée à la demande de l’utilisateur; les 32 exercices sont maintenant jouables.

## 2026-10-08 — Rendre les 32 exercices jouables

**Contexte :** le besoin est de développer chaque jeu du catalogue et de revenir après vérification de l’ensemble.

**Décision :** donner à chaque exercice son propre sujet ou scénario, ses rôles, son matériel, ses consignes et ses phases. Ajouter un contrôle adapté pour les exercices qui demandent un comptage, une liste de repères, des blancs à compléter ou une alternance de tours.

**Conséquences :** le catalogue est entièrement accessible dans l’interface. Les fiches éditoriales restent la source des consignes de base; les variantes sont indiquées séparément.
