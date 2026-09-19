# Seasonal Art Nouveau Tarot Prototype — Design Specification

**Date:** 2026-09-19

**Status:** Approved design

**Deployment target:** Vercel Hobby connected to a private GitHub repository

## 1. Objective

Extend the existing static Thai Tarot application into a functioning prototype with five festival-specific Tarot decks. Each deck preserves the standard 78-card Tarot structure and meaning while receiving a distinct, original Art Nouveau illustration for every card.

The prototype must support real readings, not merely display artwork. Users can choose a festival deck, draw a deterministic daily card or a three-card reading, reveal upright or reversed cards, and read Thai and English interpretations. The initial usable release may contain approved artwork for one deck and clearly identified placeholders for decks still in production.

## 2. Scope

### Included

- Five festival decks:
  1. Christmas / Winter Solstice
  2. Valentine
  3. Songkran
  4. Loy Krathong
  5. Halloween
- The standard 78-card Tarot structure per deck:
  - 22 Major Arcana
  - 56 Minor Arcana across Wands, Cups, Swords, and Pentacles
- 390 original card-front illustrations generated with ChatGPT Image.
- Five original, reversible card-back illustrations, one per festival deck.
- A shared Art Nouveau visual system with a distinct festival palette and symbol vocabulary for each deck.
- No text, numbers, logos, or watermarks embedded in generated artwork.
- Thai and English card names, numbers, meanings, and accessibility labels rendered by the website.
- Functional one-card daily reading and three-card past/present/tendency reading.
- A deck gallery with artwork-production status.
- Static deployment to Vercel from the existing private GitHub repository.

### Excluded from the prototype

- User accounts, authentication, payments, subscriptions, or server-side storage.
- Medical, legal, financial, or other professional advice.
- A custom content-management system.
- Native mobile applications.
- Social sharing that transmits a user's question or reading.
- Generating all 390 final images before the first testable deployment.

## 3. Delivery Strategy

Implementation and artwork production proceed in parallel-safe stages, with the functional application structure completed before all final artwork.

1. Stabilize the shared 78-card registry and deck metadata.
2. Build and verify the complete reading flow with placeholders.
3. Establish the Art Nouveau master system through six Christmas / Winter Solstice pilot cards.
4. After pilot approval, complete that deck in this order:
   - remaining Major Arcana;
   - Wands;
   - Cups;
   - Swords;
   - Pentacles;
   - reversible card back.
5. Replace placeholders deck by deck in this order:
   - Valentine;
   - Songkran;
   - Loy Krathong;
   - Halloween.
6. Deploy testable updates to Vercel throughout production.

The pilot cards are The Fool, The Lovers, Death, The Star, Ace of Cups, and Ten of Pentacles. Together they exercise beginnings, relationships, transformation, hope, elemental suit symbolism, and a populated material scene.

## 4. Application Architecture

The project remains a static frontend using the repository's existing HTML, CSS, ECMAScript modules, and JSON data. No framework or backend is introduced unless an implementation blocker proves the existing architecture insufficient.

### Existing pages retained

- `index.html`: deck and reading-mode selection.
- `daily.html`: deterministic daily draw.
- `reading.html`: question entry and three-card draw.
- `result.html`: revealed cards and interpretation.

### New pages

- `decks.html`: deck gallery, card browser, and artwork status.
- `about.html`: methodology, entertainment disclaimer, cultural references, copyright policy, and source acknowledgements.

### Responsible modules

- `data/cards.json`: canonical 78-card identities and shared meanings.
- `data/decks.json`: festival deck metadata and card-back paths.
- `data/seasons.json`: date windows for automatic seasonal recommendations.
- `data/interpretations.json`: upright/reversed interpretations and reading-position copy.
- `js/engines/deck-engine.js`: deck resolution and complete-deck validation.
- `js/engines/daily-engine.js`: deterministic daily card selection.
- `js/engines/personal-engine.js`: multi-card draw without duplicates.
- `js/engines/interpretation-engine.js`: combines canonical meaning, orientation, position, and festival tone.
- `js/data-loader.js`: JSON loading, validation, and recoverable error states.
- `css/style.css`: shared presentation, responsive states, focus states, card reveal, and reduced-motion behavior.

Existing responsible layers are extended rather than duplicated.

## 5. User Experience

### Primary flow

1. User opens the home page.
2. User selects a festival deck or accepts the seasonally recommended deck.
3. User chooses either Daily Card or Three-Card Reading.
4. The application shuffles using cryptographically secure randomness where a nondeterministic draw is required.
5. Cards appear face down using the selected deck's back.
6. User activates cards by pointer or keyboard to reveal them.
7. The result displays image, number, Thai name, English name, orientation, position, meaning, and practical reflection prompt.
8. User may start another reading or explore the deck.

### Reading modes

- **Daily Card:** one deterministic result per local calendar date and stable user identifier, consistent with the existing application invariant.
- **Three Card:** three unique card identities representing Past, Present, and Tendency. Orientation is selected independently for each card.

### Artwork-in-progress behavior

Every card remains functional before its final illustration is approved. A designed Art Nouveau placeholder displays the deck palette, card identity, and an explicit artwork status. Missing images never produce broken-image UI or an empty card.

## 6. Data Model and Invariants

### Canonical card registry

Each card record has a stable ID and includes:

- sequence and Arcana classification;
- suit and rank where applicable;
- English and Thai names;
- upright keywords and meaning;
- reversed keywords and meaning;
- practical reflection guidance;
- accessible alt text based on meaning, not decorative detail alone.

Canonical meanings are stored once. Festival decks reference the registry rather than duplicating Tarot semantics.

### Festival deck metadata

Each deck defines:

- stable deck ID and localized name;
- palette and symbol vocabulary;
- card-front asset path template;
- card-back asset path;
- interpretation tone modifiers;
- production status per card: `placeholder`, `draft`, or `approved`;
- source and rights notes.

### Required invariants

- Every deck resolves exactly 78 unique canonical card IDs.
- A reading cannot contain the same card identity twice.
- Reversed orientation does not change card identity.
- Daily results remain stable for the same local date, user identifier, and selected deck.
- Nondeterministic shuffling uses `crypto.getRandomValues()` and never `Math.random()`.
- Refreshing a result preserves the revealed reading through serializable URL or session state.
- A missing image falls back without preventing interpretation display.
- All deployed asset URLs work beneath Vercel's deployment root and preview URLs.

## 7. Art Direction

### Shared Art Nouveau master system

- Mature editorial illustration rather than anime, children's animation, or photorealism.
- Flowing botanical curves, balanced negative space, and late-19th-century decorative-poster influence drawn from public-domain historical visual language.
- Matte gouache and lithographic texture on visible paper grain.
- Restrained simulated gold-foil accents.
- Consistent card ratio, rounded corners, border weight, and focal hierarchy.
- Human anatomy, hands, faces, and symbolic objects must be visually plausible.
- Artwork contains no rendered text, letters, numbers, logos, signatures, or watermarks.
- No imitation of a living artist, modern studio, commercial Tarot deck, or copyrighted character.
- Standard Tarot meanings are conceptual requirements; compositions must be original rather than redraws of Rider-Waite-Smith scenes.

### Festival palettes and symbols

| Deck | Palette | Primary symbolic language |
|---|---|---|
| Christmas / Winter Solstice | Midnight blue, pine green, burgundy, candle gold | Stars, candles, evergreen, frost, returning light |
| Valentine | Rose, wine red, blush, antique gold | Roses, letters, ribbons, mirrors, relationship and self-love |
| Songkran | Turquoise, jasmine white, silver, warm coral | Flowing water, jasmine, silver bowls, cleansing and renewal |
| Loy Krathong | Indigo, lotus pink, leaf green, flame gold | Water, krathong, lotus, moon, release and intention |
| Halloween | Charcoal, aubergine, muted orange, moon gold | Pumpkins, black cats, dry leaves, thresholds, shadow work |

Thai visual influence is appropriate and stronger in Songkran and Loy Krathong. Western festival decks remain culturally neutral or Western-facing, with at most a very subtle shared geometric rhythm connecting the product family.

### Card backs

Each festival receives one back design that is strictly 180-degree rotationally symmetric. The design may not reveal whether a card is upright or reversed.

## 8. Image Production Workflow

Every distinct card is generated through a separate ChatGPT Image request with a card-specific prompt. Distinct assets are not produced by requesting multiple unrelated images from one prompt.

Each prompt includes:

1. stable card ID and semantic role;
2. upright and reversed meaning boundaries;
3. original festival-specific scene;
4. required and prohibited symbols;
5. shared Art Nouveau visual system;
6. deck palette;
7. composition and anatomy constraints;
8. copyright and originality constraints;
9. prohibition on embedded text.

### Asset lifecycle

- Original generated PNG files are retained as production masters.
- Approved web assets are converted to appropriately sized WebP files.
- Web filenames are stable and lowercase, for example `assets/cards/christmas/00-the-fool.webp`.
- Existing approved assets are never silently overwritten; revisions receive a versioned production filename until promoted.
- The application preloads the selected back and active reading cards only.
- Gallery images use native lazy loading.

### Quality gate

An image is approved only if it passes:

- recognizable card meaning;
- correct festival language and palette;
- consistency with the deck and master style;
- acceptable anatomy and object construction;
- no text-like artifacts, signatures, or logos;
- no obvious copied composition or protected character;
- sufficient subject separation and contrast at card size;
- safe crop with all critical content inside the card frame.

Failed images remain `draft` and are regenerated with one targeted correction at a time.

## 9. Accessibility and Responsive Design

- Every interactive card is keyboard reachable and operable.
- Visible focus styling meets contrast requirements.
- Card names and orientation are announced independently of image alt text.
- Color is never the only signal for selected deck, orientation, or production status.
- Animations honor `prefers-reduced-motion`.
- Reading remains understandable without flip animation.
- Layout supports narrow mobile screens, tablets, and desktop viewports.
- Touch targets are at least 44 by 44 CSS pixels.
- Thai text uses legible line height and does not rely on decorative fonts for body content.

## 10. Failure Handling and Privacy

- JSON load failure displays a recoverable error message and retry action.
- Missing or corrupt artwork displays a meaningful placeholder.
- Invalid deck IDs fall back to the standard or recommended deck and update the UI visibly.
- Invalid serialized readings are rejected rather than partially interpreted.
- User questions and readings remain local to the browser and are not sent to a server.
- No analytics are enabled unless separately approved and documented.
- The application states that readings are for entertainment and self-reflection, not professional medical, legal, or financial advice.

## 11. Verification

### Automated checks

- All JSON parses successfully.
- The canonical registry contains exactly 78 unique cards.
- Every deck maps exactly those 78 IDs.
- Approved asset references resolve to existing files.
- No production shuffle path calls `Math.random()`.
- Three-card draws never contain duplicates.
- Daily draws are deterministic for fixed date, user, and deck inputs.
- Upright/reversed interpretation selection is correct.
- Vercel routes and static asset paths resolve in local and preview environments.

### Manual acceptance checks

- Complete deck-selection-to-result flow on mobile and desktop.
- Keyboard-only reading flow.
- Reduced-motion behavior.
- Missing-image fallback.
- Refresh preserves a completed reading.
- Preview deployment works from a non-production branch.
- Production deployment loads directly and after deep-link refresh.
- Six pilot images pass the artwork quality gate before bulk deck generation.

## 12. Deployment and Repository Privacy

- The GitHub repository remains private; its visibility is not changed.
- Vercel receives access only to the selected repository through the user's GitHub/Vercel authorization.
- The prototype is deployed publicly on a `vercel.app` URL.
- Static files shipped to the public site—including HTML, JavaScript, JSON, and WebP artwork—must be treated as publicly downloadable.
- No credentials, API keys, private prompts, production PNG masters, or unrelated private files are included in the deployment output.
- The existing static structure is deployed without a build command where possible.
- `vercel.json` is added only if routing, caching, or security headers require it.
- Production deploys follow verified changes on the chosen production branch; other branches may receive Vercel preview deployments.
- Vercel Hobby is used for personal prototype testing. Commercial use or material traffic growth requires a later plan and terms review.

Connecting Vercel and authorizing repository access are user-account actions. Implementation may prepare all project configuration, but the user completes or explicitly authorizes account connection when deployment reaches that step.

## 13. Copyright and Cultural Reference Policy

- Wikipedia and other sources may inform factual festival history and symbol selection, but their photographs and illustrations are not used as image-generation inputs unless licensing is separately reviewed and recorded.
- Generated compositions, characters, costumes, borders, and symbolic arrangements must be original.
- Historical Art Nouveau is referenced as a broad public-domain movement, not by asking for imitation of a named living artist.
- Source notes and relevant links are recorded on the About page and in repository rights documentation.
- Cultural imagery is reviewed for context and respect, particularly religious objects, sacred figures, royal regalia, and ceremonial practices.
- The prototype does not claim that AI generation guarantees exclusive copyright. It records the generation and review process and avoids incorporating known protected material.

## 14. Success Criteria

The prototype is successful when:

1. users can select any of five festival decks and complete a one-card or three-card reading;
2. all Tarot identities and interpretations are present and internally consistent;
3. Christmas / Winter Solstice has an approved six-card pilot and a production path to all 78 unique illustrations;
4. unfinished artwork degrades to an intentional placeholder without breaking readings;
5. the application passes the stated data, randomness, accessibility, responsive, and deployment checks;
6. the private repository deploys a public test site through Vercel without exposing credentials or private production files;
7. remaining decks can receive approved artwork without changing the reading engine or canonical Tarot data.
