# Calendario Ortodoxo

Eastern Orthodox calendar web MVP (Phase 0 / start of Phase 1) following **Romanian Patriarchate (BOR) calendar usage**. Independent product — **not** an official Patriarhia Română app.

Locales (equal depth): **ES-ES** (default), **PT-PT**, **EN**. URL prefix routing: `/es`, `/pt`, `/en`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/es`.

```bash
npm run build && npm start   # production
npm run lint
```

## Locale notes

| Code | Tag   | Role                          |
|------|-------|-------------------------------|
| `es` | ES-ES | Default; Spain Spanish        |
| `pt` | PT-PT | European Portuguese           |
| `en` | en    | English                       |

UI chrome and every seeded day title/synaxar stub ship in all three locales. Missing long synaxar shows a provisional stub in the active locale (no silent cross-locale text fallback).

## Seed data (2026)

Pascha (Orthodox): **2026-04-12**. Full civil year: **365** days.

- Source of titles: curated New Calendar menaion + movable Triodion/Pentecostarion for 2026 + selected BOR/RO commemorations and civil dates.
- Synaxar prose and Bible reading *text* are provisional stubs (not scraped Patriarhia content).
- Coverage report: `src/data/seed/coverage-2026.json`
- Generated days: `src/data/seed/days-2026.json`

### Regenerate seed

```bash
npm run seed:generate
# equivalent: node scripts/generate-seed.mjs
```

Then restart `npm run dev`. Edit commemorations in `scripts/generate-seed.mjs` (MENAION / movable offsets), regenerate, commit.

## API (used by the web UI)

Versioned JSON under `/api/v1`:

- `GET /api/v1/{locale}/months/{yyyy-mm}` — month day list
- `GET /api/v1/{locale}/days/{yyyy-mm-dd}` — day detail
- `GET /api/v1/meta/coverage` — seed coverage stats

Example:

```bash
curl -s http://localhost:3000/api/v1/es/months/2026-10 | head
curl -s http://localhost:3000/api/v1/en/days/2026-04-12 | head
curl -s http://localhost:3000/api/v1/meta/coverage
```

## What’s stubbed vs real

| Layer | Status |
|-------|--------|
| UX shell (month rail/pills, day list, detail drawer) | Real (MVP) |
| Design tokens (cream / plum / red / blue) | Real |
| i18n routing + UI strings | Real |
| API contract | Real (JSON seed) |
| Day titles ES/PT/EN for all 365 days | Curated seed |
| Synaxar prose, scripture full text, icons | Provisional / placeholder |
| Postgres / CMS | Not yet |
| GitHub remote | **Not connected** — add later |

## Disclaimer

Follows BOR liturgical calendar usage for feast identity, rank, and fasting. Not affiliated with or endorsed by Patriarhia Română. Do not scrape copyrighted Patriarhia synaxar or icons into this product.

## Repository

Greenfield local git history only. A remote can be added when ready:

```bash
git remote add origin <your-repo-url>
git push -u origin main
```
