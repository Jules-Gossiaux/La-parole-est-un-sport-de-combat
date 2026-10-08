# Décisions et hypothèses

## 2026-10-08 — Initialiser la documentation avant l’application

**Contexte :** le dépôt était sans historique Git et ne contenait que le PRD et un fichier VS Code vide.

**Décision :** poser les règles de contribution, le statut observé, les limites éditoriales et les objectifs de tests avant de choisir une stack.

**Conséquences :** aucun code applicatif ni dépendance n’est ajouté. Le démarrage du produit nécessite encore une décision technique réversible.

## 2026-10-08 — Préserver un modèle sans compte et local-first

**Contexte :** le PRD demande explicitement des séances sans inscription, un bilan privé dans le navigateur et des enregistrements audio locaux.

**Décision :** traiter ces exigences comme contraintes d’architecture du MVP.

**Conséquences :** le futur choix de stockage devra expliquer sauvegarde, effacement, limites de capacité et comportement lorsque l’utilisateur change d’appareil. Aucun backend n’est présumé.

## En attente

- Stack et navigateurs cibles.
- Politique de conservation des bilans et enregistrements.
- Source et droits des contenus d’exercices; `EXERCICES.md` est absent.
- Hébergement, CI et procédure de publication.
