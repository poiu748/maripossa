# Maripossa — Pizzeria & Fast-Food · Zarzis

A modern, mobile-first ordering site for **Maripossa**. Customers browse the menu,
build a cart, and send their order to the restaurant on **WhatsApp** — no backend
required. Bilingual **French / Arabic** with full right-to-left support.

## Stack

- **Next.js 14** (App Router) + **React 18**
- **TypeScript** (strict)
- **Tailwind CSS** for styling (design tokens in `tailwind.config.ts`)
- **Framer Motion** for tasteful reveal / cart animations
- Menu lives in a single typed data file — `lib/menu.ts`
- Cart + language state persist in `localStorage`

## Getting started

```bash
# 1. install dependencies
npm install

# 2. add the logo
#    copy your logo into  public/logo.png   (see public/README.txt)

# 3. run the dev server
npm run dev
# open http://localhost:3000
```

## Deploy to Vercel

1. Push this folder (`maripossa-web`) to a GitHub repo.
2. On https://vercel.com → **New Project** → import the repo.
3. Framework preset is auto-detected as **Next.js**. No env vars needed.
4. Click **Deploy**. Done.

Or with the CLI:

```bash
npm i -g vercel
vercel        # preview
vercel --prod # production
```

## Editing content

Everything you'd normally change lives in `lib/`:

| What | File |
| --- | --- |
| Menu items & prices | `lib/menu.ts` |
| Phone, WhatsApp, socials, hours, map | `lib/constants.ts` |
| French / Arabic text | `lib/i18n.ts` |
| Reviews | `lib/i18n.ts` (`REVIEWS`) |
| Colors / fonts / shadows | `tailwind.config.ts` |

### Add a real food photo

1. Drop the image in `public/menu/`, e.g. `public/menu/pepperoni.jpg`.
2. Give that item an `img` path in `lib/menu.ts`.

The menu card automatically shows the photo instead of the line icon.

## Project structure

```
app/
  layout.tsx        # fonts (DM Serif, Karla, Cairo), metadata, providers
  page.tsx          # single-page composition
  globals.css
components/
  StoreProvider.tsx # cart + language state (reducer + localStorage)
  Header, Hero, InfoStrip, Menu, Reviews, Contact, Footer
  CartBar, CartSheet
  Reveal.tsx        # scroll-reveal wrapper
  Icons.tsx         # inline SVG icons
lib/
  menu.ts  i18n.ts  constants.ts  order.ts  types.ts
public/
  logo.png          # add this
```

© 2026 Maripossa · Pizzeria & Fast-Food · Zarzis
