# La parole est un sport de combat

Compagnon web francophone pour s’entraîner à la prise de parole, seul, à deux ou en groupe. Le produit est défini dans [PRD.md](PRD.md).

## État du projet

Prototype web : les 32 exercices du catalogue sont jouables, chacun avec des consignes, des sujets ou scénarios, des rôles quand ils sont utiles, du matériel et des phases chronométrées spécifiques. Certains exercices ajoutent un outil interactif comme un compteur, une liste de repères ou un tour de parole. L’enregistrement audio et l’édition des bilans restent à faire.

## Démarrage

Prérequis : Node.js 22.12 ou plus récent et npm.

```bash
npm install
npm run dev
```

Pour produire les fichiers statiques destinés à Vercel : `npm run build`. Le dossier de sortie est `dist/`.

Pour vérifier les 32 parcours de jeu : `npm test`.

## Produit et confidentialité

Le prototype n’exige pas de compte. Les bilans sont conservés dans le `localStorage` du navigateur et peuvent être effacés depuis « Mes séances ». Ils ne sont pas synchronisés entre appareils. Aucun enregistrement audio n’est encore disponible. Vercel réserve son [plan Hobby gratuit](https://vercel.com/docs/plans/hobby) aux usages personnels ou non commerciaux. L’adresse `*.vercel.app` est l’option sans achat; un domaine personnalisé peut coûter.

## Documentation

- [Règles de travail](RULES.md)
- [Contribution](CONTRIBUTING.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Développement](docs/DEVELOPMENT.md)
- [Tests](docs/TESTING.md)
- [Roadmap](docs/ROADMAP.md)
- [Décisions](docs/DECISIONS.md)
- [Catalogue d’exercices](docs/EXERCICES.md)
- [Changelog](CHANGELOG.md)

## Contenu éditorial

Le catalogue d’exercices est dans `docs/EXERCICES.md`. Il reformule les exercices référencés par le PRD; vérifier les droits éditoriaux avant toute publication commerciale.
