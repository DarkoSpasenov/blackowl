# Black Owl Tattoo Studio — site web

Next.js 16 (App Router) · TypeScript · CSS sur mesure · GSAP + ScrollTrigger · Lenis.
Langues : macédonien (`/mk`, par défaut) et anglais (`/en`).

## Lancer en local

```bash
npm install
cp .env.example .env.local   # puis remplir les valeurs
npm run dev                  # http://localhost:3000
```

Production : `npm run build && npm start`.

## Déploiement

**Vercel (recommandé)** : importer le dépôt sur vercel.com, ajouter les variables
de `.env.example` dans *Settings → Environment Variables*, déployer. Aucune autre configuration.

**Autre hébergeur Node (VPS, Render, Railway, cPanel Node.js…)** : Node 20+,
`npm ci && npm run build && npm start` (port via `PORT`).

> Le formulaire a besoin d'un serveur : un hébergement purement statique ne suffit pas.

## Formulaire de rendez-vous (vrai envoi, pas de simulation)

`app/api/booking/route.ts` valide la demande côté serveur et l'envoie par e-mail
avec les images de référence en pièces jointes.

| Variable | Rôle |
|---|---|
| `BOOKING_TO_EMAIL` | adresse qui reçoit les demandes (plusieurs : séparées par des virgules) |
| `BOOKING_FROM_EMAIL` | expéditeur (domaine vérifié chez le fournisseur) |
| `RESEND_API_KEY` | option A : [Resend](https://resend.com) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | option B : n'importe quel SMTP |

Tant que rien n'est configuré, le formulaire répond honnêtement « non connecté »
et invite à appeler. Protections : honeypot anti-bot, limite 5 envois / 10 min / IP,
5 images max (compressées dans le navigateur, ≤ 4 Mo au total).

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
app/[lang]/            pages (page.tsx, about/, gallery/, contact/), layout, OG image
app/api/booking/       envoi du formulaire
components/            Header, Preloader, Transition (voile), PageFx (moteur d'animations),
                       Hero, WorksSlider, Gallery (masonry + lightbox), BookingForm, Cursor…
content/               données vérifiées + médias
lib/                   i18n, SEO, GSAP
styles/globals.css     système de design complet
proxy.ts               redirection / → /mk ou /en
```

## Animations

- Préchargeur : logo puis révélation par taches d'encre (version courte après la 1re visite).
- Transitions : voile noir à bord orange + nom de la page, sans rechargement.
- Défilement : Lenis, masques sur les titres, parallaxe, hero épinglé qui se laisse recouvrir.
- Desktop : boutons magnétiques, curseur discret, lumière orange au survol, profondeur 3D à la souris.
- `prefers-reduced-motion` respecté (animations coupées, contenu visible), effets allégés sur mobile.
