# Black Owl Tattoo Studio — site web

Next.js 16 (export statique) · TypeScript · CSS sur mesure · GSAP + ScrollTrigger · Lenis.
Langues : macédonien (`/mk`, par défaut) et anglais (`/en`).

## Site 100 % statique

Aucun serveur Node.js n'est nécessaire pour l'hébergement : `npm run build`
produit du HTML/CSS/JS pur dans `out/`, publiable sur GitHub Pages ou n'importe
quel hébergement statique (Infomaniak, Netlify, OVH…).

## Publication sur GitHub Pages (automatique)

1. Dépôt → *Settings → Pages* → *Source* : **GitHub Actions**.
2. Chaque `push` sur `main` lance `.github/workflows/deploy.yml`, qui construit
   et publie le site sur `https://darkospasenov.github.io/blackowl/`.
3. Réglages optionnels dans *Settings → Secrets and variables → Actions → Variables* :

| Variable | Rôle |
|---|---|
| `FORM_ENDPOINT` | adresse du service d'envoi du formulaire (voir plus bas) |
| `FORM_FILES` | `false` pour masquer l'envoi d'images si le plan du service ne les accepte pas |
| `SITE_URL` / `BASE_PATH` | uniquement avec un nom de domaine personnalisé (`https://blackowltattoo.mk` et vide) |

## Formulaire de rendez-vous (vrai envoi, sans serveur)

Le formulaire envoie directement la demande à un service d'e-mails de
formulaires, par exemple [Formspree](https://formspree.io) :

1. Créer un formulaire sur formspree.io avec l'adresse e-mail du studio.
2. Copier son adresse (`https://formspree.io/f/xxxxxxx`) dans la variable `FORM_ENDPOINT`.
3. Relancer le déploiement (onglet *Actions* → *Run workflow*).

Tant que `FORM_ENDPOINT` est vide, le formulaire l'indique honnêtement au visiteur
et l'invite à appeler. Les images de référence (5 max, compressées dans le
navigateur) nécessitent un plan du service qui accepte les fichiers ; sinon
mettre `FORM_FILES=false`. Anti-spam : champ `_gotcha` (honeypot).

## Travailler en local (optionnel)

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000/mk
npm run build        # génère out/
```

## Images

Sans serveur, les images ne sont pas converties automatiquement : exportez les
photos en **WebP ou AVIF** (≈ 2000 px de large pour les grandes, 1200 px pour la
galerie, qualité 80). Le chargement différé et les proportions sont gérés par le site.

## Remplacer les contenus provisoires

Tout ce qui est provisoire est marqué **« Привремена фотографија / Placeholder »** ou
**« Привремен текст »** à l'écran.

| Quoi | Où |
|---|---|
| Photos (hero, intérieur, artistes…) | `content/media.ts` — déposer le fichier dans `public/images/`, renseigner `src`, `width`, `height` |
| Portfolio (une seule galerie) | `content/gallery.ts` — images ou vidéos (`type: 'video'`, `poster`) |
| Logo | remplacer `public/brand/logo-placeholder.(png|webp)` par le vrai logo (idéalement SVG/PNG haute définition) et `app/icon.png` |
| Infos studio, horaires, bios des artistes | `content/site.ts` (`hours`, `artists[].name/bio/approach`) |
| Textes MK / EN | `lib/i18n.ts` |
| Position de la carte | `site.mapsQuery` dans `content/site.ts` |

Règle : uniquement les vraies réalisations du studio, jamais d'image générée ou modifiée par IA.

## Structure

```
app/[lang]/            pages (page.tsx, about/, gallery/, contact/), layout
components/            Header, Preloader, Transition (voile), PageFx (moteur d'animations),
                       Hero, WorksSlider, Gallery (masonry + lightbox), BookingForm, Cursor…
content/               données vérifiées + médias
lib/                   i18n, SEO, GSAP
styles/globals.css     système de design complet
public/index.html      redirection / → /mk ou /en
.github/workflows/     publication GitHub Pages
```

## Animations

- Préchargeur : logo puis révélation par taches d'encre (version courte après la 1re visite).
- Transitions : voile noir à bord orange + nom de la page, sans rechargement.
- Défilement : Lenis, masques sur les titres, parallaxe, hero épinglé qui se laisse recouvrir.
- Desktop : boutons magnétiques, curseur discret, lumière orange au survol, profondeur 3D à la souris.
- `prefers-reduced-motion` respecté (animations coupées, contenu visible), effets allégés sur mobile.
