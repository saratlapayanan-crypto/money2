# Seasonal Tarot Artwork Production Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce, review, and integrate 390 original Art Nouveau Tarot fronts and five reversible backs through ChatGPT Image without destabilizing the working prototype.

**Architecture:** Store one machine-readable prompt manifest per deck, one production record per asset, original PNG masters outside the public deployment set, and approved WebP derivatives under stable application paths. Generate one distinct asset per ChatGPT Image call, gate each image against semantic and visual criteria, then promote manifest status from placeholder to draft to approved.

**Tech Stack:** ChatGPT Image built-in generation, JSON manifests, PNG production masters, WebP deployment assets, Node.js validation scripts, existing static web application.

**Spec:** `docs/superpowers/specs/2026-09-19-seasonal-art-nouveau-tarot-design.md`

## Global Constraints

- Produce exactly 78 unique fronts for each of five decks plus one reversible back per deck.
- Use one ChatGPT Image call per distinct front or back asset.
- Artwork contains no embedded text, numbers, logos, signatures, or watermarks.
- Preserve canonical Tarot semantics without redrawing a commercial or Rider-Waite-Smith composition.
- Do not imitate any living artist or modern studio.
- Keep original PNG masters out of the Vercel deployment.
- Deploy only reviewed WebP derivatives under `assets/cards/<deck-id>/`.
- Never mark an image approved until semantic, anatomy, originality, crop, and thumbnail checks pass.
- Keep Western festival decks Western-facing/culturally neutral; reserve materially Thai visual language for Songkran and Loy Krathong.
- Preserve unrelated working-tree and untracked user files.

## Review Focus

- A beautiful image with the wrong Tarot meaning must fail semantic review; pinned in Task 2 pilot rubric and Task 4 batch records.
- Text-like marks, signatures, malformed hands, or protected characters must keep status at draft; pinned in Task 2 visual review and Task 3 promotion validation.
- A visually directional card back must fail the 180-degree check; pinned in Task 5 back validation.
- A WebP whose crop removes a required symbol or becomes unreadable at card size must not replace its placeholder; pinned in Task 3 derivative checks.
- Manifest/file/status drift must fail validation before commit; pinned in Task 3 asset-manifest tests and repeated in every batch task.

---

### Task 1: Create the prompt-manifest and production-record system

**Files:**
- Create: `artwork/master-style.md`
- Create: `artwork/decks/christmas.json`
- Create: `artwork/decks/valentine.json`
- Create: `artwork/decks/songkran.json`
- Create: `artwork/decks/loy-krathong.json`
- Create: `artwork/decks/halloween.json`
- Create: `scripts/validate-artwork-manifests.mjs`
- Create: `tests/artwork-manifests.test.js`
- Modify: `.vercelignore`

**Interfaces:**
- Consumes: canonical `data/cards.json` and festival vocabulary from the spec.
- Produces: five 78-entry prompt manifests plus one back entry per deck; `npm run validate:artwork`.

- [ ] **Step 1: Write failing manifest tests**

Assert each manifest contains exactly the canonical 78 IDs plus `back`; every entry contains `semantic_goal`, `festival_scene`, `required_symbols`, `avoid`, `prompt`, `status`, `master_png`, `web_asset`, and `review`; statuses are `placeholder|draft|approved`; no two front prompts are identical; approved entries require a review record and existing WebP.

- [ ] **Step 2: Confirm failure**

Run: `node --test tests/artwork-manifests.test.js`

Expected: FAIL because manifests do not exist.

- [ ] **Step 3: Write the master style contract**

`artwork/master-style.md` must specify fixed ratio, Art Nouveau border family, mature editorial character treatment, gouache/lithograph texture, restrained gold, anatomy rules, no embedded text, originality rules, safe crop, and the exact palette/symbol language for all five decks.

- [ ] **Step 4: Populate all manifests from canonical meanings**

Every card gets a distinct original scene. Prompts must state upright and reversed semantic boundaries, required symbols, negative constraints, and intended card-size readability. Set all entries to `placeholder` with null asset paths and empty review records.

- [ ] **Step 5: Add validation and verify**

Add `validate:artwork` to `package.json`, run `npm run validate:artwork`, and expect PASS with `390 fronts, 5 backs, 0 approved`.

- [ ] **Step 6: Commit**

```bash
git add artwork/master-style.md artwork/decks scripts/validate-artwork-manifests.mjs tests/artwork-manifests.test.js package.json .vercelignore
git commit -m "feat: define seasonal artwork production manifests"
```

### Task 2: Generate and review the six-card Christmas pilot

**Files:**
- Modify: `artwork/decks/christmas.json`
- Create: `artwork/reviews/christmas-pilot.md`
- Create production masters outside the deployable path for:
  - `major-0` The Fool
  - `major-6` The Lovers
  - `major-13` Death
  - `major-17` The Star
  - `cups-1` Ace of Cups
  - `pentacles-10` Ten of Pentacles
- Create approved derivatives under `assets/cards/christmas/` only after review.

**Interfaces:**
- Consumes: six exact prompts in `artwork/decks/christmas.json`.
- Produces: six reviewed pilot PNG masters, six card-size WebP derivatives, review decisions, and updated statuses.

- [ ] **Step 1: Generate each pilot image separately**

Use the built-in ChatGPT Image tool once per card. Do not combine cards into a contact sheet. Save each returned PNG as a non-destructive production master named with card ID and revision.

- [ ] **Step 2: Review every image against the fixed rubric**

For each image record PASS/FAIL for canonical meaning, Christmas/Winter Solstice language, shared Art Nouveau system, anatomy/objects, absence of text/signatures/logos, originality, safe crop, and thumbnail readability. A failed dimension keeps the asset `draft` and names one targeted regeneration change.

- [ ] **Step 3: Regenerate failed images one targeted correction at a time**

Repeat the invariant constraints in every correction request. Do not promote the earlier failed revision.

- [ ] **Step 4: Create WebP derivatives and promote**

Create consistent card-size WebP files under `assets/cards/christmas/<card-id>.webp`. Record dimensions, file hash, master filename, web path, review date, and status `approved` in the manifest.

- [ ] **Step 5: Verify and commit**

Run: `npm run validate:artwork && npm run validate:assets`

Expected: PASS with exactly six approved Christmas fronts and 384 remaining front placeholders.

```bash
git add artwork/decks/christmas.json artwork/reviews/christmas-pilot.md assets/cards/christmas
git commit -m "feat: add approved Christmas tarot pilot"
```

### Task 3: Lock the pilot style before bulk production

**Files:**
- Modify: `artwork/master-style.md`
- Modify: `artwork/decks/christmas.json`
- Modify: `tests/artwork-manifests.test.js`

**Interfaces:**
- Consumes: six approved pilot reviews.
- Produces: locked Christmas character, palette, border, lighting, and rendering rules used by the remaining 72 fronts.

- [ ] **Step 1: Compare the six approved images**

Document recurring border geometry, line density, facial treatment, gold intensity, palette values, background depth, and crop. Identify any visible inconsistency that would make the six cards appear to come from different decks.

- [ ] **Step 2: Add enforceable prompt clauses**

Update the master and all remaining Christmas prompts with concrete locked clauses. Add tests that every non-pilot Christmas prompt contains the locked style version string and the no-text/anatomy/originality constraints.

- [ ] **Step 3: Verify and commit**

Run: `npm run validate:artwork`

Expected: PASS.

```bash
git add artwork/master-style.md artwork/decks/christmas.json tests/artwork-manifests.test.js
git commit -m "docs: lock Christmas Art Nouveau system"
```

### Task 4: Complete Christmas fronts in reviewable batches

**Files:**
- Modify: `artwork/decks/christmas.json`
- Create: `artwork/reviews/christmas-major.md`
- Create: `artwork/reviews/christmas-wands.md`
- Create: `artwork/reviews/christmas-cups.md`
- Create: `artwork/reviews/christmas-swords.md`
- Create: `artwork/reviews/christmas-pentacles.md`
- Create approved WebP files under `assets/cards/christmas/`.

**Interfaces:**
- Consumes: locked Christmas prompts and Task 2 quality rubric.
- Produces: all 78 approved Christmas fronts.

- [ ] **Step 1: Generate and review the remaining Major Arcana**

Generate one image per manifest entry, review it, regenerate failures with one targeted change, create WebP only for passing images, update records, run both validators, and commit the coherent Major Arcana batch.

- [ ] **Step 2: Generate and review Wands 1–14**

Use the same explicit gate. Ensure suit continuity without duplicating compositions. Run both validators and commit the Wands batch.

- [ ] **Step 3: Generate and review Cups 1–14**

Use the same explicit gate. Confirm water/cup symbolism remains distinct from Christmas decoration. Run both validators and commit the Cups batch.

- [ ] **Step 4: Generate and review Swords 1–14**

Use the same explicit gate. Ensure difficult meanings remain legible without graphic violence. Run both validators and commit the Swords batch.

- [ ] **Step 5: Generate and review Pentacles 1–14**

Use the same explicit gate. Ensure material/community meanings remain legible and do not collapse into identical festive interiors. Run both validators and commit the Pentacles batch.

- [ ] **Step 6: Verify the complete deck**

Run: `npm run validate:artwork && npm run validate:assets && npm test`

Expected: 78 approved Christmas fronts, no duplicate IDs, no missing approved assets, all application tests pass.

### Task 5: Produce and validate the Christmas reversible back

**Files:**
- Modify: `artwork/decks/christmas.json`
- Create approved: `assets/cards/christmas/back.webp`
- Modify: `artwork/reviews/christmas-pilot.md`

**Interfaces:**
- Consumes: locked Christmas palette/border system.
- Produces: one approved 180-degree-reversible back.

- [ ] **Step 1: Generate the back separately**

Prompt for strict 180-degree rotational symmetry, no figure, no text, centered eight-pointed star, mirrored candles, evergreen, berries, pinecones, and frost.

- [ ] **Step 2: Perform the rotation test**

Compare original and 180-degree rotation at full and thumbnail size. Reject directional flames, asymmetric focal weight, hidden letters, or a recognizable top/bottom.

- [ ] **Step 3: Promote and verify**

Create `back.webp`, update review/hash/status, run both validators, and test upright/reversed reveal in the app.

- [ ] **Step 4: Commit**

```bash
git add artwork/decks/christmas.json artwork/reviews/christmas-pilot.md assets/cards/christmas/back.webp
git commit -m "feat: add reversible Christmas card back"
```

### Task 6: Produce Valentine, Songkran, Loy Krathong, and Halloween decks

**Files:**
- Modify: each corresponding `artwork/decks/<deck>.json`
- Create: `artwork/reviews/<deck>-pilot.md`, `<deck>-major.md`, and one review file per suit.
- Create: approved WebP fronts and back under `assets/cards/<deck>/`.

**Interfaces:**
- Consumes: canonical 78 meanings, shared master system, deck vocabulary, and the proven batch gate.
- Produces: four further complete 78-front plus one-back decks.

- [ ] **Step 1: Complete Valentine**

Generate the same six pilot identities, review and lock the deck-specific palette/symbol rules, then generate remaining Major Arcana, Wands, Cups, Swords, Pentacles, and reversible back as separate reviewable commits. Run validators after every batch. Expected final count: 78 approved fronts plus one approved back.

- [ ] **Step 2: Complete Songkran**

Follow the same ordered batches. Ground imagery in cleansing, renewal, water, jasmine, and silver bowls; review sacred/ceremonial content for respect; avoid turning every card into a water fight. Expected final count: 78 approved fronts plus one approved back.

- [ ] **Step 3: Complete Loy Krathong**

Follow the same ordered batches. Ground imagery in water, lotus, moon, release, and intention; avoid placing sacred structures as casual decoration. Expected final count: 78 approved fronts plus one approved back.

- [ ] **Step 4: Complete Halloween**

Follow the same ordered batches. Use thresholds, shadow work, pumpkins, black cats, dry leaves, and moonlight; keep frightening meanings evocative rather than graphic. Expected final count: 78 approved fronts plus one approved back.

- [ ] **Step 5: Verify the entire collection**

Run: `npm run validate:artwork && npm run validate:assets && npm test`

Expected: `390 approved fronts, 5 approved backs, 0 draft, 0 placeholder`, with all application tests passing.

### Task 7: Perform collection-wide visual and deployment audit

**Files:**
- Create: `artwork/reviews/collection-audit.md`
- Modify only manifests/assets that fail the audit.

**Interfaces:**
- Consumes: all 395 approved assets.
- Produces: final audit evidence and corrected manifests/assets.

- [ ] **Step 1: Build contact sheets for review only**

Create non-deployed contact sheets grouped by deck and Arcana/suit. Contact sheets are review artifacts, not substitutes for separately generated card assets.

- [ ] **Step 2: Audit semantic coverage and repetition**

Check all 78 identities across all five decks for recognizable meaning, duplicated composition, inconsistent border/crop, anatomy defects, text-like artifacts, and cultural mismatch. Record every finding with deck/card ID and disposition.

- [ ] **Step 3: Correct failures**

Regenerate only failed assets, one targeted change per iteration. Replace deployed WebP only after the revised master passes the complete gate and the manifest hash is updated.

- [ ] **Step 4: Run final proof**

Run: `npm run check && npm run validate:artwork`

Expected: PASS with 395 approved assets and no deployment references to PNG masters.

- [ ] **Step 5: Commit**

```bash
git add artwork/reviews/collection-audit.md artwork/decks assets/cards
git commit -m "chore: complete seasonal tarot artwork audit"
```
