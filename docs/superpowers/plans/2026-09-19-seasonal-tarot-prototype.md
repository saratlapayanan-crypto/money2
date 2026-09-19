# Seasonal Tarot Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a testable static Tarot application with five festival decks, deterministic daily and unique three-card readings, accessible artwork fallbacks, a deck gallery, and Vercel-ready deployment from a private repository.

**Architecture:** Extend the existing HTML/CSS/ES-module/JSON application. Keep one canonical 78-card registry, layer deck-specific metadata and artwork status over it, and resolve assets through a focused card-assets module. Use Node's built-in test runner for pure application logic and a browser smoke test for the complete flow.

**Tech Stack:** HTML5, CSS3, Tailwind CDN already present, vanilla ECMAScript modules, JSON, Node.js built-in `node:test`, browser Web Crypto, Vercel static hosting.

**Spec:** `docs/superpowers/specs/2026-09-19-seasonal-art-nouveau-tarot-design.md`

## Global Constraints

- Keep the GitHub repository private; do not change repository visibility.
- Deploy a public prototype through Vercel only after local verification.
- Retain exactly 78 canonical Tarot identities: 22 Major Arcana and 56 Minor Arcana.
- Support exactly five festival decks: `christmas`, `valentine`, `songkran`, `loy-krathong`, and `halloween`.
- Never use `Math.random()` for card selection or orientation; use Web Crypto.
- Generated artwork contains no embedded text, numbers, logos, signatures, or watermarks.
- Keep user questions and readings in the browser; do not transmit or persist them server-side.
- Do not introduce a frontend framework, backend, database, or build pipeline unless an implementation blocker is demonstrated.
- Preserve unrelated working-tree and untracked user files.
- Treat deployed HTML, JavaScript, JSON, and WebP assets as publicly downloadable.

## Review Focus

- Corrupt or unavailable JSON must show a recoverable UI error and must not leave an endless loading state; pinned in Task 2 loader tests and Task 8 smoke tests.
- Invalid or stale deck IDs must resolve to `standard`/recommended behavior without writing an invalid selection; pinned in Task 3 deck tests.
- Repeated or malformed serialized readings must be rejected rather than partially rendered; pinned in Task 5 session tests.
- A missing approved image must render the intentional placeholder and readable name rather than a broken image; pinned in Task 4 asset tests and Task 8 smoke tests.
- Keyboard and reduced-motion users must complete the reveal flow without relying on pointer hover or 3D animation; pinned in Task 7 markup/CSS checks and Task 8 smoke tests.

---

### Task 1: Establish a dependency-free test harness and canonical validation command

**Files:**
- Create: `package.json`
- Create: `tests/helpers/load-json.js`
- Create: `tests/data-integrity.test.js`
- Modify: `README.md`

**Interfaces:**
- Consumes: existing JSON files under `data/`.
- Produces: `npm test`, `npm run validate:data`, and `loadJson(relativePath): Promise<unknown>` for later tests.

- [ ] **Step 1: Write the failing data-integrity test**

Create `tests/helpers/load-json.js`:

```js
import { readFile } from 'node:fs/promises';

export async function loadJson(relativePath) {
  return JSON.parse(await readFile(new URL(`../../${relativePath}`, import.meta.url), 'utf8'));
}
```

Create `tests/data-integrity.test.js` with assertions that `data/cards.json` is an array of exactly 78 records, IDs are unique, IDs match `major-0..21` and four suits `1..14`, and every record has non-empty Thai and English names.

- [ ] **Step 2: Run the test and verify the current data contract fails where incomplete**

Run: `node --test tests/data-integrity.test.js`

Expected: FAIL with the first concrete missing field, incorrect count, or schema mismatch; record that failure in the task notes before changing data.

- [ ] **Step 3: Add the minimal package scripts**

Create `package.json`:

```json
{
  "name": "seasonal-art-nouveau-tarot",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/*.test.js",
    "validate:data": "node --test tests/data-integrity.test.js"
  }
}
```

Document Node 20+ and `npm test` in `README.md`; do not add runtime packages.

- [ ] **Step 4: Run the harness**

Run: `npm test`

Expected: the runner starts successfully; data assertions may remain red until Task 2, but there are no module-format or command errors.

- [ ] **Step 5: Commit**

```bash
git add package.json tests/helpers/load-json.js tests/data-integrity.test.js README.md
git commit -m "test: add dependency-free validation harness"
```

### Task 2: Normalize the canonical 78-card registry and loader validation

**Files:**
- Modify: `data/cards.json`
- Modify: `data/interpretations.json`
- Modify: `js/data-loader.js`
- Create: `js/domain/cards.js`
- Modify: `tests/data-integrity.test.js`
- Create: `tests/cards-domain.test.js`

**Interfaces:**
- Consumes: raw card and interpretation JSON.
- Produces: `validateCards(cards): Card[]`, `indexCards(cards): Map<string, Card>`, and `loadCards(): Promise<Card[]>` that rejects invalid data with a user-safe error code.

- [ ] **Step 1: Write failing domain tests**

In `tests/cards-domain.test.js`, assert that `validateCards` rejects non-arrays, duplicate IDs, missing bilingual names, an invalid suit/rank combination, and counts other than 78. Assert that valid data is returned unchanged and `indexCards` exposes all 78 IDs.

- [ ] **Step 2: Confirm failures**

Run: `node --test tests/cards-domain.test.js tests/data-integrity.test.js`

Expected: FAIL because `js/domain/cards.js` does not exist and/or canonical fields are missing.

- [ ] **Step 3: Implement the card domain**

Create `js/domain/cards.js` exporting:

```js
export const SUITS = ['wands', 'cups', 'swords', 'pentacles'];
export function validateCards(cards) {
  if (!Array.isArray(cards)) {
    const error = new Error('Card data must be an array');
    error.code = 'CARD_DATA_INVALID';
    throw error;
  }
  const expected = new Set([
    ...Array.from({ length: 22 }, (_, index) => `major-${index}`),
    ...SUITS.flatMap(suit => Array.from({ length: 14 }, (_, index) => `${suit}-${index + 1}`))
  ]);
  const actual = new Set(cards.map(card => card.id));
  if (cards.length !== 78 || actual.size !== 78 || [...expected].some(id => !actual.has(id))) {
    const error = new Error('Card data must contain the canonical 78 unique IDs');
    error.code = 'CARD_DATA_INVALID';
    throw error;
  }
  return cards;
}
export function indexCards(cards) { return new Map(validateCards(cards).map(card => [card.id, card])); }
```

Validation must calculate the expected ID set rather than trusting array length alone. Update `loadCards` to call `validateCards`. Normalize `data/cards.json` to include `id`, `arcana`, `sequence`, `suit`, `rank`, `name_en`, `name_th`, `keywords_upright`, `keywords_reversed`, `meaning_upright`, `meaning_reversed`, `reflection`, and `alt_text` for every card. Preserve existing useful fields during migration. Ensure interpretations reference only canonical card IDs.

- [ ] **Step 4: Run the focused tests**

Run: `node --test tests/cards-domain.test.js tests/data-integrity.test.js`

Expected: PASS, including exactly 78 unique IDs and no orphan interpretation references.

- [ ] **Step 5: Commit**

```bash
git add data/cards.json data/interpretations.json js/data-loader.js js/domain/cards.js tests/data-integrity.test.js tests/cards-domain.test.js
git commit -m "feat: normalize canonical tarot registry"
```

### Task 3: Define five deck manifests and safe seasonal resolution

**Files:**
- Modify: `data/decks.json`
- Modify: `data/seasons.json`
- Modify: `js/engines/deck-engine.js`
- Create: `js/domain/decks.js`
- Create: `tests/decks-domain.test.js`
- Modify: `tests/data-integrity.test.js`

**Interfaces:**
- Consumes: `Card[]`, deck JSON, season JSON, current `MM-DD`, optional manual deck ID.
- Produces: `validateDecks(decks, cards): Deck[]`, `resolveDeckId({ decks, seasons, mmdd, manualId }): string`, and five validated deck records.

- [ ] **Step 1: Write failing deck tests**

Test normal date windows, the Christmas window crossing year-end, invalid manual IDs, malformed `MM-DD`, overlapping seasons, duplicate deck IDs, unknown card-status IDs, and missing back assets. Expect invalid manual selection to fall through to seasonal/default resolution.

- [ ] **Step 2: Confirm failures**

Run: `node --test tests/decks-domain.test.js`

Expected: FAIL because the pure domain module is absent.

- [ ] **Step 3: Implement pure deck validation and resolution**

Create `js/domain/decks.js` with the exact exports above. Each festival deck record must include `id`, `name_en`, `name_th`, `palette`, `symbols`, `tone`, `asset_root`, `back_asset`, and a `cards` object keyed by all 78 canonical IDs with `status` in `placeholder|draft|approved` and nullable `asset`.

Update `deck-engine.js` to read storage defensively, delegate date/manual logic to `resolveDeckId`, and write storage only after validation. Keep DOM theme application in `deck-engine.js`.

- [ ] **Step 4: Populate the manifests**

Retain `standard` only as an explicit fallback theme. Add the five required festival decks. Initially mark all generated-card entries `placeholder`; promotion to `draft` or `approved` belongs to the artwork plan. Normalize season windows without overlaps.

- [ ] **Step 5: Verify**

Run: `node --test tests/decks-domain.test.js tests/data-integrity.test.js`

Expected: PASS for five complete 78-ID mappings, cross-year Christmas resolution, and invalid-ID fallback.

- [ ] **Step 6: Commit**

```bash
git add data/decks.json data/seasons.json js/domain/decks.js js/engines/deck-engine.js tests/decks-domain.test.js tests/data-integrity.test.js
git commit -m "feat: add validated festival deck manifests"
```

### Task 4: Add centralized artwork resolution with intentional fallbacks

**Files:**
- Create: `js/art/card-assets.js`
- Create: `js/art/art-nouveau-placeholder.js`
- Modify: `js/art/tarot-art.js`
- Modify: `js/art/fronts.js`
- Modify: `js/art/backs.js`
- Create: `tests/card-assets.test.js`

**Interfaces:**
- Consumes: `(deck, card)` records from Tasks 2–3.
- Produces: `resolveCardAsset(deck, card): { kind: 'image'|'placeholder', src: string|null, status: string }`, `renderCardFace(container, { deck, card, reversed })`, and `renderCardBack(container, deck)`.

- [ ] **Step 1: Write failing resolution tests**

Assert that only `approved` with a non-empty asset returns `kind: 'image'`; `draft`, `placeholder`, missing asset, and unknown card mappings return `kind: 'placeholder'`. Assert that a missing approved path may downgrade through image `error` handling without throwing.

- [ ] **Step 2: Confirm failures**

Run: `node --test tests/card-assets.test.js`

Expected: FAIL because the resolver does not exist.

- [ ] **Step 3: Implement the resolver and renderer boundary**

`card-assets.js` must contain no DOM globals in `resolveCardAsset`; DOM rendering is isolated in `renderCardFace`/`renderCardBack`. The image renderer adds `loading="lazy"`, `decoding="async"`, alt text from the canonical record, and an `error` handler that replaces only the failed image with `art-nouveau-placeholder.js` output. Keep current code-native SVG art available only as the intentional fallback, not as a second source of truth.

- [ ] **Step 4: Verify**

Run: `node --test tests/card-assets.test.js`

Expected: PASS for approved, draft, missing, and error-fallback states.

- [ ] **Step 5: Commit**

```bash
git add js/art/card-assets.js js/art/art-nouveau-placeholder.js js/art/tarot-art.js js/art/fronts.js js/art/backs.js tests/card-assets.test.js
git commit -m "feat: resolve deck artwork with safe fallbacks"
```

### Task 5: Implement serializable one-card and unique three-card readings

**Files:**
- Modify: `js/engines/daily-engine.js`
- Modify: `js/engines/personal-engine.js`
- Modify: `js/utils/crypto.js`
- Create: `js/domain/reading.js`
- Create: `tests/reading-domain.test.js`
- Create: `tests/crypto.test.js`

**Interfaces:**
- Consumes: canonical card IDs, selected deck ID, date/user seed, Web Crypto.
- Produces: `createThreeCardReading({ cardIds, deckId, randomUint32 }): Reading`, `serializeReading(reading): string`, `parseReading(value, validCardIds, validDeckIds): Reading`, and daily selection seeded by deck ID.

- [ ] **Step 1: Write failing reading tests**

Cover three unique IDs, independent orientation flags, no `Math.random`, deterministic daily output changing when deck ID changes, round-trip serialization, rejection of duplicate IDs, unknown IDs, invalid orientations, unknown deck IDs, and corrupt encoded values.

- [ ] **Step 2: Confirm failures**

Run: `node --test tests/reading-domain.test.js tests/crypto.test.js`

Expected: FAIL because the domain functions and three-card state are absent.

- [ ] **Step 3: Implement the pure reading model**

Define a reading as:

```js
{
  version: 1,
  mode: 'three-card',
  deckId: 'christmas',
  cards: [
    { position: 'past', cardId: 'major-0', reversed: false },
    { position: 'present', cardId: 'cups-1', reversed: true },
    { position: 'tendency', cardId: 'pentacles-10', reversed: false }
  ]
}
```

Use rejection sampling around `crypto.getRandomValues()` to avoid modulo bias. Update daily seed format to include validated deck ID. Replace the single-selection session shape with the serialized reading while accepting and migrating an existing single-card session once.

- [ ] **Step 4: Verify**

Run: `node --test tests/reading-domain.test.js tests/crypto.test.js`

Expected: PASS with deterministic fixtures and explicit malformed-state rejection.

- [ ] **Step 5: Commit**

```bash
git add js/engines/daily-engine.js js/engines/personal-engine.js js/utils/crypto.js js/domain/reading.js tests/reading-domain.test.js tests/crypto.test.js
git commit -m "feat: add persistent three-card readings"
```

### Task 6: Compose upright/reversed and festival-aware interpretations

**Files:**
- Modify: `js/engines/interpretation-engine.js`
- Modify: `data/interpretations.json`
- Create: `tests/interpretation-engine.test.js`

**Interfaces:**
- Consumes: canonical card, orientation, reading position, category/subtopic, and deck tone.
- Produces: `composeInterpretation({ card, reversed, position, category, subtopic, deck, interpretations }): InterpretationView`.

- [ ] **Step 1: Write failing interpretation tests**

Pin upright vs reversed meaning, past/present/tendency labels, festival tone as a framing sentence that cannot replace canonical meaning, existing category fallback, and a non-alarming generic fallback for missing contextual data.

- [ ] **Step 2: Confirm failures**

Run: `node --test tests/interpretation-engine.test.js`

Expected: FAIL because `composeInterpretation` is absent.

- [ ] **Step 3: Implement composition**

Return a stable object with `nameTh`, `nameEn`, `orientationLabel`, `positionLabel`, `summary`, `action`, `warning`, and `festivalReflection`. Escape output through text nodes in page renderers; never interpolate user questions into `innerHTML`.

- [ ] **Step 4: Verify**

Run: `node --test tests/interpretation-engine.test.js`

Expected: PASS for upright, reversed, all three positions, and missing context.

- [ ] **Step 5: Commit**

```bash
git add js/engines/interpretation-engine.js data/interpretations.json tests/interpretation-engine.test.js
git commit -m "feat: compose orientation-aware interpretations"
```

### Task 7: Update the accessible reading interface and add deck/about pages

**Files:**
- Modify: `index.html`
- Modify: `daily.html`
- Modify: `reading.html`
- Modify: `result.html`
- Modify: `js/app.js`
- Modify: `js/daily-page.js`
- Modify: `js/reading-page.js`
- Modify: `js/result-page.js`
- Modify: `js/analytics.js`
- Create: `decks.html`
- Create: `about.html`
- Create: `js/decks-page.js`
- Modify: `css/style.css`
- Create: `tests/static-markup.test.js`

**Interfaces:**
- Consumes: validated loaders, deck resolver, card renderers, and reading/interpretation models from Tasks 2–6.
- Produces: complete pointer/keyboard flows and static informational pages.

- [ ] **Step 1: Write failing static markup checks**

Read all six HTML pages and assert language, unique title, viewport, main landmark, navigation, module script, a `<noscript>` explanation, and an entertainment/self-reflection disclaimer on reading-result surfaces. Assert `reading.html` exposes three named positions and `decks.html` has a gallery root with an accessible heading. Inspect `js/analytics.js` and assert the prototype implementation contains neither `fetch(` nor `sendBeacon` nor a third-party script URL.

- [ ] **Step 2: Confirm failures**

Run: `node --test tests/static-markup.test.js`

Expected: FAIL for missing pages and required semantics.

- [ ] **Step 3: Implement the pages and renderers**

Use buttons for reveal actions, `aria-expanded` or a live-region announcement for revealed state, text nodes for the user's question, and native lazy-loading for gallery images. Show `placeholder`, `draft`, and `approved` status in both text and visual treatment. Add retry actions for loader failures.

Keep `trackEvent(name, properties)` as a local debug no-op unless a separately approved analytics provider is configured in a later scope. It must not call `fetch`, `sendBeacon`, or load a third-party analytics script in this prototype.

- [ ] **Step 4: Implement responsive and reduced-motion styles**

Retain the existing mobile-first layout. Ensure 44px targets, visible `:focus-visible`, a two/three-column result layout that collapses to one column, no horizontal overflow at 320px, and a non-animated reveal state inside `@media (prefers-reduced-motion: reduce)`.

- [ ] **Step 5: Verify static tests and all unit tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add index.html daily.html reading.html result.html decks.html about.html js/app.js js/daily-page.js js/reading-page.js js/result-page.js js/decks-page.js js/analytics.js css/style.css tests/static-markup.test.js
git commit -m "feat: deliver accessible seasonal reading flows"
```

### Task 8: Add local and browser smoke verification

**Files:**
- Create: `tests/browser-smoke.md`
- Create: `scripts/validate-assets.mjs`
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: complete static app and deck manifests.
- Produces: `npm run validate:assets`, a repeatable local server command, and a manual browser acceptance record.

- [ ] **Step 1: Write the failing asset validator**

Create a script that reads every deck manifest, verifies each approved asset and back path exists, rejects files outside `assets/cards/`, and reports placeholders/drafts without treating them as missing approved files.

- [ ] **Step 2: Add scripts and run them**

Add:

```json
"validate:assets": "node scripts/validate-assets.mjs",
"check": "npm test && npm run validate:assets"
```

Run: `npm run check`

Expected: PASS; the report states exact counts by deck/status.

- [ ] **Step 3: Execute browser acceptance**

Serve with `python -m http.server 8000`. Test at 320px, 768px, and desktop widths: select each deck; reload and verify persistence; complete daily draw; complete keyboard-only three-card reading; refresh result and verify preservation; intentionally rename one local draft asset and verify placeholder fallback; emulate reduced motion; verify JSON fetch failure shows Retry.

Record results and screenshots/notes in `tests/browser-smoke.md` without committing temporary renamed assets.

- [ ] **Step 4: Commit**

```bash
git add scripts/validate-assets.mjs package.json README.md tests/browser-smoke.md
git commit -m "test: verify prototype end to end"
```

### Task 9: Prepare Vercel-safe static deployment

**Files:**
- Create: `vercel.json`
- Create: `.vercelignore`
- Modify: `README.md`
- Test: `tests/deployment-config.test.js`

**Interfaces:**
- Consumes: verified static app.
- Produces: public static deployment that excludes production masters, planning material, tests, scripts, and unrelated private files.

- [ ] **Step 1: Write failing configuration tests**

Assert that `.vercelignore` excludes `.git`, `tests`, `scripts`, `docs`, raw `output/imagegen`, and production PNG masters while retaining `assets/cards/**/*.webp`, application HTML/CSS/JS, and data JSON. Assert `vercel.json` defines static clean URLs only if needed and adds `X-Content-Type-Options: nosniff`, a conservative `Referrer-Policy`, and immutable caching for hashed/versioned artwork.

- [ ] **Step 2: Confirm failures**

Run: `node --test tests/deployment-config.test.js`

Expected: FAIL because deployment configuration is absent.

- [ ] **Step 3: Add minimal configuration**

Use Vercel's static handling; do not introduce a build framework. Ensure client-side deep links are not claimed unless the app actually uses them. Document that the user must connect the private repository in Vercel and that the resulting site is public.

- [ ] **Step 4: Run the release proof**

Run: `npm run check`

Expected: PASS.

Then inspect the deployable file set before account connection. Do not connect accounts, grant repository access, or promote production until the user performs or explicitly authorizes those account actions at deployment time.

- [ ] **Step 5: Commit**

```bash
git add vercel.json .vercelignore README.md tests/deployment-config.test.js
git commit -m "chore: prepare secure Vercel deployment"
```

### Task 10: Release the verified prototype

**Files:**
- Modify only files required by issues found in preview verification.
- Update: `tests/browser-smoke.md`

**Interfaces:**
- Consumes: Vercel project access supplied by the user and a verified branch.
- Produces: a working public preview URL, then a production URL after explicit user review.

- [ ] **Step 1: Push a reviewed branch and create a Vercel preview**

The user connects Vercel to the private repository and grants access to this repository. Push the implementation branch only after `npm run check` passes. Capture the preview URL.

- [ ] **Step 2: Verify the real preview**

Repeat the Task 8 browser flow against the HTTPS preview. In addition, verify direct page loads for `/daily.html`, `/reading.html`, `/result.html`, `/decks.html`, and `/about.html`; inspect console/network errors; confirm no planning documents, tests, source PNG masters, or secrets are publicly served.

- [ ] **Step 3: Fix only preview-specific defects and re-run proof**

For each defect, add or update the owning automated test first, reproduce failure locally, make the smallest fix, run `npm run check`, and commit one coherent fix.

- [ ] **Step 4: Promote after user review**

Present the verified preview URL and known limitations. Production promotion or production-branch merge occurs only after the user approves the preview. Record the production URL and final smoke result in `tests/browser-smoke.md`.

- [ ] **Step 5: Commit final verification evidence**

```bash
git add tests/browser-smoke.md
git commit -m "docs: record verified Vercel prototype"
```
