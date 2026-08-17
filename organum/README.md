# Organum

Table de mixage audio hors-ligne pour Maîtres du Jeu — PWA locale, sans hébergement de fichiers.

## Démarrer en local

```bash
npm install
npm run lint      # vérification syntaxique
npm test          # tests unitaires (mixer-math.js)
npm run dev        # sert le dossier public/ en local
```

## Structure du projet

```
public/                 → l'app shell PWA (ce qui est déployé)
  index.html
  manifest.json
  service-worker.js
src/                     → code source
  mixer-math.js          → logique pure, TESTÉE (volumes, timing, validation)
  mixer-math.test.js     → tests Jest correspondants
  audio-engine.js        → code qui touche le vrai navigateur, NON testé unitairement
.github/workflows/
  ci.yml                 → lint + tests à chaque push/PR
  deploy-pages.yml       → déploiement auto sur GitHub Pages depuis main
```

## Workflow Git à suivre

- `main` = toujours stable
- Une branche par fonctionnalité : `feature/nom-de-la-feature`
- Commits petits et cohérents, préfixés (`feat:`, `fix:`, `docs:`, `test:`, `ci:`)
- Ouvrir une Pull Request vers `main` même seul, laisser la CI tourner avant de merger

## Pourquoi mixer-math.js est séparé d'audio-engine.js

`mixer-math.js` ne touche ni au navigateur ni à l'AudioContext — que des calculs
purs (nombres en entrée, nombres ou objets en sortie). C'est ce qui le rend
testable facilement avec Jest, sans avoir besoin de simuler un environnement
audio complet. `audio-engine.js` s'appuie dessus mais fait le vrai travail
avec le navigateur ; il se teste manuellement (import d'un MP3, écoute).

## Prochaines étapes (voir la feuille de route complète dans la conversation)

- [ ] Stockage IndexedDB des fichiers importés (pilier 1)
- [ ] Interface (curseurs de volume, import de fichiers) branchée sur `audio-engine.js`
- [ ] Sauvegarde/chargement de presets JSON, validés via `validatePreset()`
- [ ] Icônes PWA réelles dans `public/icons/`
