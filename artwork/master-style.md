# Seasonal Art Nouveau Tarot — Master Style Contract

Style version: `seasonal-art-nouveau-v1`

## Shared visual system

- Every front and back is a fixed **2:3 portrait card**. Use a consistent rounded double frame, flowing botanical Art Nouveau curves, balanced negative space, and a clear focal hierarchy that remains legible at normal card size.
- Character work is mature editorial illustration: emotionally readable adults, never anime, children's animation, pin-up caricature, or photorealism. Render anatomically plausible bodies, faces, hands, fingers, limbs, clothing, and held symbolic objects.
- Use matte gouache and late-19th-century lithographic texture on visible paper grain. Gold is a restrained printed or simulated foil accent, not a dominant metallic surface.
- Keep each required symbol, face, hand, and other meaning-bearing detail inside a **10% safe-crop margin**. Nothing essential may touch the trim edge or depend on fine detail that disappears at card size.
- Generated artwork contains **no embedded text, letters, numbers, logos, signatures, watermarks, pseudo-writing, or typographic marks**. The application supplies all card labels.
- Every composition, character, costume, border, and symbolic arrangement is original. Do not imitate a living artist, modern studio, commercial Tarot deck, protected character, or a recognizable Rider-Waite-Smith layout. Canonical Tarot meaning is a conceptual boundary, not permission to redraw an existing card.
- Human anatomy and constructed objects must survive full-size and thumbnail review. Malformed hands, fused fingers, extra limbs, broken faces, incoherent vessels/weapons, or impossible joins fail review.
- Fronts must communicate the named card's upright meaning while leaving room for the stated reversed boundary. Backs contain no figures and must be strictly 180-degree rotationally symmetric so they do not reveal orientation.

## Exact deck palettes and symbol vocabularies

These values are production constants and must remain identical in `data/decks.json` and each deck manifest.

| Deck | Exact palette | Required vocabulary | Seasonal direction |
| --- | --- | --- | --- |
| Christmas / Winter Solstice | midnight blue `#071827`; pine green `#1f5132`; burgundy `#7b2235`; candle gold `#d8af54` | `star`, `candle`, `evergreen`, `frost` | Hope, warmth, and returning light in a Western-facing or culturally neutral winter-solstice setting. |
| Valentine | wine `#4b1326`; rose `#a53f5b`; blush `#e9a8b6`; antique gold `#d8af54` | `rose`, `letter`, `ribbon`, `mirror` | Relationship, tenderness, and self-love without sentimentality or cupid clichés. |
| Songkran | deep turquoise `#0b6574`; clear turquoise `#55c5d1`; jasmine white `#f4eee1`; warm coral `#e57a65` | `water`, `jasmine`, `silver bowl`, `renewal` | Respectful Thai visual language of flowing water, cleansing, forgiveness, jasmine, silver bowls, and renewal; never reduce the festival to a generic water fight. |
| Loy Krathong | indigo `#131c4a`; lotus pink `#d56a9d`; leaf green `#397557`; flame gold `#e7b64c` | `water`, `lotus`, `moon`, `flame` | Respectful Thai riverside imagery of krathong, lotus, moonlit water, release, and intention; sacred or ceremonial objects stay in context. |
| Halloween | charcoal `#17131c`; aubergine `#4f2b59`; muted orange `#b85d2d`; moon gold `#d1a64c` | `pumpkin`, `black cat`, `dry leaves`, `threshold` | Western-facing threshold and shadow-work imagery, courageous and mysterious rather than graphic or grotesque. |

## Production and review gate

Each manifest record carries the canonical semantic goal, a card-specific seasonal scene, required symbols, prohibited content, the complete generation prompt, lifecycle status, asset paths, and review evidence. New records begin as `placeholder` with null paths and an empty review object. An image may move through `draft` to `approved` only after semantic, seasonal-language, style, anatomy/object, no-text, originality, safe-crop, and thumbnail-readability checks pass. Approved backs additionally require a 180-degree rotation check.

PNG masters live under `artwork/masters/` outside the deployed asset set. Only reviewed WebP derivatives under `assets/cards/<deck-id>/` are used by the application.
