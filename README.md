# La parole est un sport de combat

Compagnon web francophone pour s’entraîner à la prise de parole, seul, à deux ou en groupe. Le produit est défini dans [PRD.md](PRD.md).

## État du projet

Prototype web initial : 8 exercices MVP interactifs et 24 exercices annoncés comme bientôt disponibles. Le prototype inclut les fiches, les sujets aléatoires, le chronomètre en trois phases et un bilan privé dans le navigateur. L’enregistrement audio, la génération de rôles, l’édition des bilans et les contrôles automatisés restent à faire.

## Démarrage

Prérequis : Node.js 22.12 ou plus récent et npm.

```bash
npm install
npm run dev
```

Pour produire les fichiers statiques destinés à Vercel : `npm run build`. Le dossier de sortie est `dist/`.

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
