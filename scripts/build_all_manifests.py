#!/usr/bin/env python3
"""
Build Complete Generation Manifests for All 7 Decks (7 x 78 = 546 cards)
Strictly adheres to:
1. Full Masterpiece Illustration
2. Deck-specific Art Style & Tone
3. Secular Guarantee (Zero monks, zero saffron robes, zero churches, zero crucifixes)
4. Unified Deck Framing Architecture
"""

import json
from pathlib import Path

CARDS_FILE = Path("data/cards.json")
OUTPUT_DIR = Path("scripts")

with open(CARDS_FILE, "r", encoding="utf-8") as f:
    cards_data = json.load(f)

# The 27 approved cards in Standard deck
APPROVED_STANDARD_IDS = {
    "major-0", "major-1", "major-2", "major-3", "major-4", "major-5",
    "major-6", "major-7", "major-8", "major-9", "major-10", "major-11",
    "major-12", "major-13", "major-14", "major-15", "major-16", "major-17",
    "major-18", "major-19", "major-20", "major-21",
    "wands-1", "wands-2", "cups-1", "swords-1", "pentacles-1"
}

# Existing standard prompts from batch_generate_manifest.json
existing_manifest_file = OUTPUT_DIR / "batch_generate_manifest.json"
existing_standard_prompts = {}
if existing_manifest_file.exists():
    with open(existing_manifest_file, "r", encoding="utf-8") as f:
        for item in json.load(f):
            existing_standard_prompts[item["id"]] = item["prompt"]

THEME_CONFIGS = {
    "standard": {
        "style_prefix": "A masterpiece tarot card {name} in Renaissance Art Nouveau oil painting style.",
        "style_suffix": "Ornate gold filigree border with title '{NAME}' in an ornate cartouche at the bottom. Majestic rich oil colors, dramatic atmospheric lighting, 100% secular, highly detailed Renaissance oil painting masterpiece.",
        "default_palette": "rich oil colors, warm gold, deep velvet lapis lazuli"
    },
    "songkran": {
        "style_prefix": "A masterpiece tarot card {name} in Contemporary Thai Gold Lacquer and Temple Mural art style (จิตรกรรมลายรดน้ำร่วมสมัย).",
        "style_suffix": "Ornate Siamese Lai Rod Nam gold leaf border with title '{NAME}' in an ornate cartouche at the bottom. Splashes of blessed crystalline jasmine water, pure gold leaf on deep cinnabar and indigo lacquer, 100% secular (no monks, no robes, no religious statues), highly detailed cultural masterpiece.",
        "default_palette": "pure gold leaf, deep cinnabar red, royal indigo, sparkling jasmine water"
    },
    "loy-krathong": {
        "style_prefix": "A masterpiece tarot card {name} in Moonlit Floating Lotus Lantern art style (จิตรกรรมแสงจันทร์เพ็ญและสายน้ำ).",
        "style_suffix": "Ornate floating lotus blossom and river wave gold border with title '{NAME}' in an ornate cartouche at the bottom. Glowing banana-leaf lotus lantern on shimmering nocturnal river, golden full moon reflection, glowing lanterns floating toward the starlit sky, peaceful water aura, 100% secular, highly detailed nocturnal masterpiece.",
        "default_palette": "luminous moonlight silver, amber candle flame, deep twilight river blue, emerald banana leaf"
    },
    "christmas": {
        "style_prefix": "A masterpiece tarot card {name} in Vintage Arthur Rackham Storybook Illustration style for Winter Solstice.",
        "style_suffix": "Ornate evergreen holly pine and gold ribbon border with title '{NAME}' in an ornate cartouche at the bottom. Warm hearth candle glow, fresh winter pine, falling soft snow, nostalgic storybook warmth, 100% secular (no church, no crucifix), highly detailed vintage fairytale illustration masterpiece.",
        "default_palette": "forest evergreen, rich cranberry, warm beeswax candle gold, pure snow white"
    },
    "valentine": {
        "style_prefix": "A masterpiece tarot card {name} in French Romantic Rococo and Art Nouveau oil painting style.",
        "style_suffix": "Ornate blooming rose garland and golden filigree ribbon border with title '{NAME}' in an ornate cartouche at the bottom. Tender pastel blooms, macarons, golden gilded scrolls, elegant romantic atmosphere, 100% secular, highly detailed French Rococo masterpiece.",
        "default_palette": "blush macaron pink, champagne gold, ivory cream, delicate rose petals"
    },
    "halloween": {
        "style_prefix": "A masterpiece tarot card {name} in Dark Victorian Gothic and Autumn Mystery art style.",
        "style_suffix": "Ornate wrought-iron vine, autumn leaf, and brass lantern border with title '{NAME}' in an ornate cartouche at the bottom. Moonlit mist, carved glowing pumpkin lanterns, antique Victorian architecture, mysterious nocturnal atmosphere, 100% secular, highly detailed gothic masterpiece.",
        "default_palette": "deep obsidian, glowing amber pumpkin light, antique brass, misty silver moonlight"
    },
    "minimalist": {
        "style_prefix": "A masterpiece tarot card {name} in Modern Architectural Editorial Graphic style with golden ratio geometry.",
        "style_suffix": "Precision fine-line geometric border with title '{NAME}' in an elegant modern typography cartouche. Clean architectural lines, golden foil geometric accents on textured Nordic paper, timeless minimalist sophistication, 100% secular, highly detailed contemporary design masterpiece.",
        "default_palette": "Nordic warm off-white, matte black, pure gold foil lines, subtle stone grey"
    }
}

# Archetype secular scene descriptions
MAJOR_SCENES = {
    "major-0": "A free-spirited youthful traveler standing at the brink of a sunny mountain crest, carrying a modest bundle on a walking stick, accompanied by a joyous white hound playing by his side, stepping forward with optimism into the golden unknown.",
    "major-1": "A master artisan and scholar standing before an antique celestial worktable displaying the four elemental relics (wooden wand, golden chalice, steel blade, inscribed pentacle), one hand channeling celestial starlight and the other grounding creative power to fertile earth.",
    "major-2": "A serene sage woman seated between two elegant marble pillars of night and day, draped in flowing lapis-blue robes, holding a scroll of eternal cosmic wisdom, with a crescent moon resting at her feet beneath a veil of blooming pomegranates.",
    "major-3": "A gracious sovereign empress seated on a luxurious cushioned throne amidst a flourishing golden wheat field and fragrant forest, crowned with twelve radiant stars, radiating natural abundance, fertility, and maternal warmth.",
    "major-4": "A wise, commanding ruler seated firmly upon a carved stone ram throne on high mountain ramparts, clad in majestic armor and regal robes, holding an orb of authority and scepter, embodying structure, discipline, and protective order.",
    "major-5": "An elder philosopher and academy master seated between two classical library columns, wearing scholarly robes, conferring scrolls of timeless philosophical insight to two attentive scholars, teaching ethics and shared universal knowledge.",
    "major-6": "Two soulmates standing hand in hand in an enchanted orchard under the sheltering golden wings of a guardian dawn spirit, with flowering trees of passion and wisdom blossoming around them in complete harmony.",
    "major-7": "A determined hero driving a noble ceremonial chariot drawn by two mirrored sphinxes across a stone causeway leading out from a grand fortress, moving forward in complete focused triumph under a canopy of starlight.",
    "major-8": "A calm, compassionate maiden gently closing the jaws of a majestic golden lion with soft touch and inner fortitude, crowned with a blooming floral garland and glowing infinity lemniscate above her brow.",
    "major-9": "An elder hermit in traveler robes standing atop a quiet snow-dusted summit in tranquil twilight, holding aloft a shining brass lantern containing an inner radiant star to guide distant seekers.",
    "major-10": "A grand cosmic wheel of destiny turning through starlit clouds, adorned with celestial compass bearings and mystical zodiac creatures, celebrating the eternal cycles of renewal, opportunity, and fortune.",
    "major-11": "A dignified judge seated upon an ornate stone tribunal between majestic pillars, holding an upright double-edged steel sword of truth in one hand and balanced golden scales in the other, gazing forward with clarity.",
    "major-12": "A contemplative figure suspended serenely upside down by one ankle from a living blossoming wooden T-cross arbor, displaying tranquil surrender and profound enlightenment with a glowing golden halo of insight around his head.",
    "major-13": "A majestic mounted knight in burnished black armor carrying a banner of the white mystic rose, riding through dawn mist as an old sun sets and a brilliant golden new sun rises over the horizon, signifying profound transformation and rebirth.",
    "major-14": "A radiant winged spirit standing with one foot on lush riverbank and one foot in clear stream, gracefully pouring liquid light back and forth between two glowing golden chalices in perfect balance and alchemy.",
    "major-15": "A dramatic winged satyr figure perched upon an antique stone pedestal, overlooking two figures with loose golden chains around their necks that can be slipped off at will, representing illusion, obsession, and the power to break free.",
    "major-16": "A towering stone citadel upon a windswept mountain peak being illuminated by a dramatic flash of natural lightning, dislodging an oversized crown from its peak as two figures leap safely toward dawn renewal below, signifying liberating revelation.",
    "major-17": "A graceful maiden kneeling beside a tranquil starlit pool in nocturnal serenity, pouring clear spring water from two urns onto the earth and into the water, beneath one great radiant eight-pointed morning star and seven smaller sister stars.",
    "major-18": "A mystical nocturnal landscape where a golden full moon weeps drops of dew, two watchtowers guard the horizon, a domestic hound and wild canine gaze upward, and a crayfish emerges from a deep pool onto a winding path into the hills.",
    "major-19": "A joyous child with a radiant smile crowned with sunflowers, riding a gentle white pony with open arms before a stone wall adorned with blooming sunflowers under a glorious golden smiling sun.",
    "major-20": "A celestial messenger sounding a gleaming golden brass horn from the illuminated clouds, calling radiant figures rising from earthly stone vaults with joyful outstretched arms into dawn awakening and renewal.",
    "major-21": "A triumphant graceful dancer wrapped in a swirling violet silk sash, holding two wands of mastery inside an oval laurel victory wreath, surrounded by the four cosmic archetypes (lion, bull, eagle, human) in the corners."
}

def get_minor_scene(card):
    suit = card["suit"]
    num = card["number"]
    name = card["name"]

    # If it's an Ace
    if num == 1:
        relics = {
            "wands": "A divine hand emerging from luminous clouds holding an upright flourishing wooden wand with sprouting green leaves, sparks of creative vitality ascending into a sunlit valley.",
            "cups": "A divine hand emerging from luminous clouds holding a magnificent overflowing golden chalice with five streams of crystal water pouring into a tranquil lotus pool.",
            "swords": "A divine hand emerging from luminous clouds holding an upright gleaming steel double-edged sword crowned with a golden laurel victory wreath and palm branches.",
            "pentacles": "A divine hand emerging from luminous clouds holding a gleaming golden talisman coin engraved with a star, hovering above a blooming rose garden and archway."
        }
        return relics.get(suit, f"A divine hand presenting the sacred {suit} relic.")

    # Numbered cards 2-10
    if 2 <= num <= 10:
        scenes = {
            "wands": {
                2: "A stately merchant lord standing on castle battlements holding a globe in one hand and a wooden staff in the other, surveying his coastal ships.",
                3: "A noble explorer standing at cliff edge looking out over the sea where merchant vessels sail toward dawn light.",
                4: "A joyful couple celebrating under a garland of fresh flowers, grapes, and ribbons strung across four upright blossoming staffs outside a welcoming manor.",
                5: "Five energetic youths in colorful tunics engaged in dynamic, spirited athletic sparring with wooden staffs.",
                6: "A crowned champion on a caparisoned white steed riding triumphantly through a cheering crowd, holding high a staff crowned with a golden victory laurel.",
                7: "A brave defender standing on steep rocky vantage holding a staff, valiantly defending his ground against staffs below.",
                8: "Eight wooden staffs flying in aerodynamic parallel formation through clear skies over a fertile river basin.",
                9: "A vigilant watchman with a bandaged brow leaning on a sturdy staff before a solid rampart of eight upright staffs.",
                10: "A determined figure carrying a heavy bundle of ten blossoming staffs along a pathway toward an illuminated estate."
            },
            "cups": {
                2: "Two lovers exchanging golden chalices in mutual devotion beneath the protective caduceus of winged lions.",
                3: "Three maidens in flowing gowns dancing in a vineyard circle, raising their cups in joyous toast and sisterhood.",
                4: "A reflective youth seated beneath an ancient tree contemplating three chalices before him, while a fourth offered from clouds awaits his notice.",
                5: "A cloaked figure mourning three spilled chalices, unaware of two full golden chalices standing upright behind him.",
                6: "Two children in an antique fairytale garden, an older child gifting a fragrant cup filled with white flowers to a smiling younger friend.",
                7: "A dreamer gazing upon seven glowing chalices emerging from clouds containing treasures, dragons, laurel wreaths, and castles.",
                8: "A resolute traveler in a red cloak with walking staff turning his back on eight neatly stacked cups to journey into moonlit hills.",
                9: "A contented merchant seated comfortably with arms folded, smiling before nine golden cups displayed in an arch behind him.",
                10: "A joyful family standing with arms raised under a radiant rainbow of ten golden cups arching over a cozy riverside homestead."
            },
            "swords": {
                2: "A blindfolded maiden in white gown seated before the sea, holding two crossed steel swords in balanced meditation.",
                3: "A vibrant crimson heart suspended in storm clouds, pierced cleanly by three steel swords with falling rain clearing into distant light.",
                4: "A knight lying in peaceful rest upon an antique tomb with hands clasped in meditation, three swords mounted on the wall and one beside him.",
                5: "A smirk-faced youth gathering dropped swords from the ground as defeated opponents walk away in retreat toward storm-tossed waters.",
                6: "A ferryman steering a wooden barge carrying a woman and child across quiet waters toward a sunlit shore, six swords upright in the boat.",
                7: "A nimble figure stealthily carrying five swords away from an encampment, glancing over his shoulder while leaving two behind.",
                8: "A bound maiden loosely tied with ribbons surrounded by eight steel swords planted in marshy ground, with an open path before her.",
                9: "A troubled figure sitting up in bed with head in hands, while nine steel swords hang in dark array on the wall above.",
                10: "A figure lying face down draped in red cloth, with ten swords placed orderly along the back, while dawn golden light breaks across the dark sea horizon."
            },
            "pentacles": {
                2: "A dexterous youth juggling two golden pentacles looped inside an endless golden infinity ribbon before rolling sea waves.",
                3: "A master stone mason carving intricate filigree inside a stone archway, conferring with an architect and benefactor holding blueprints.",
                4: "A wealthy merchant seated securely clutching a golden pentacle to his chest, one under each foot and one balancing upon his crown.",
                5: "Two weary wayfarers walking through cold winter snow past an illuminated stained-glass window glowing with five warm golden pentacles.",
                6: "A generous nobleman holding brass scales of fairness, distributing golden coins to grateful citizens with compassion.",
                7: "A patient gardener leaning on his hoe, contemplating a flourishing grapevine heavy with seven ripe golden pentacle fruits.",
                8: "A focused craftsman in his workshop meticulously engraving intricate designs onto eight golden coins mounted in orderly rows.",
                9: "An elegant noblewoman in a bird-patterned gown strolling through a luxurious vineyard laden with nine golden pentacles, a falcon perched on her gloved hand.",
                10: "Three generations of a loving family gathered with their loyal hound beneath an ornate stone archway emblazoned with ten golden pentacles."
            }
        }
        return scenes.get(suit, {}).get(num, f"A narrative scene depicting {name}.")

    # Court cards (Page 11, Knight 12, Queen 13, King 14)
    courts = {
        "wands": {
            11: "A bright-eyed, enthusiastic youthful royal page in an embroidered tunic standing in desert dunes holding an upright blossoming staff.",
            12: "A daring knight in golden armor with fiery plumes riding a charging chestnut warhorse, brandishing a flaming staff of courage.",
            13: "A radiant, confident queen seated on a carved lion throne holding a sunflower and blossoming staff, a friendly black feline companion by her side.",
            14: "A charismatic, commanding king seated on a throne decorated with lions and salamanders, holding a flowering staff of vision and passion."
        },
        "cups": {
            11: "An imaginative, artistic page in a floral tunic by the seashore, gazing delightfully at a small golden fish peeking from his chalice.",
            12: "A poetic, romantic knight in armor adorned with water wings riding a graceful white horse toward a gentle stream, offering a golden chalice.",
            13: "A visionary, intuitive queen seated on a seashell throne at ocean's edge, contemplating an ornate closed chalice with angelic handles.",
            14: "A calm, wise king seated on a floating throne on tranquil waves, holding a scepter and overflowing cup, undisturbed by the waters."
        },
        "swords": {
            11: "An alert, inquisitive page standing on a breezy knoll holding an upright steel sword, looking keenly over his shoulder at moving clouds.",
            12: "A bold knight in sleek silver armor on a charging steed riding headlong into windswept storms with sword raised in fierce determination.",
            13: "An astute, sharp-witted queen seated on an elevated stone throne in profile, holding an upright sword of truth and gesturing with open palm.",
            14: "A majestic, authoritative king seated on an imposing stone throne holding an upright sword of justice, commanding intellect and clarity."
        },
        "pentacles": {
            11: "A studious, diligent page in warm earth-toned doublet standing in a fertile field, carefully holding and admiring a golden pentacle.",
            12: "A steadfast, reliable knight in dark armor atop a sturdy workhorse standing motionless in plowed fields, holding a golden coin with unwavering focus.",
            13: "A nurturing, practical queen seated upon a throne carved with cherubs and beasts amidst fruit orchards, cradling a golden pentacle in her lap.",
            14: "A prosperous, benevolent king seated on an opulent throne adorned with carved bulls and blooming grapevines, holding an orb of worldly abundance."
        }
    }
    return courts.get(suit, {}).get(num, f"A regal court portrait of {name}.")

def build_manifest_for_theme(theme_id):
    cfg = THEME_CONFIGS[theme_id]
    manifest = []

    for card in cards_data:
        cid = card["id"]
        cname = card["name"]
        num = card["number"]
        arcana = card["arcana"]
        suit = card.get("suit")
        filename = f"{cid}.jpg" if arcana == "major" else f"{suit}-{num}.jpg"

        # Check status
        if theme_id == "standard" and cid in APPROVED_STANDARD_IDS:
            status = "approved"
        else:
            status = "queued"

        # Check existing prompt for standard
        if theme_id == "standard" and cid in existing_standard_prompts:
            prompt = existing_standard_prompts[cid]
        else:
            if arcana == "major":
                scene_desc = MAJOR_SCENES.get(cid, f"A symbolic portrayal of {cname}.")
            else:
                scene_desc = get_minor_scene(card)

            prefix = cfg["style_prefix"].format(name=cname)
            suffix = cfg["style_suffix"].format(NAME=cname.upper())
            prompt = f"{prefix} {scene_desc} {suffix}"

        manifest.append({
            "id": cid,
            "deck_id": theme_id,
            "name": cname,
            "name_th": card.get("name_th") or card.get("thai_name") or cname,
            "arcana": arcana,
            "suit": suit,
            "number": num,
            "filename": filename,
            "status": status,
            "prompt": prompt
        })

    return manifest

def main():
    print("Building manifests for all 7 decks...")
    all_summary = {}

    for theme_id in THEME_CONFIGS.keys():
        manifest = build_manifest_for_theme(theme_id)
        out_file = OUTPUT_DIR / f"manifest_{theme_id}.json"
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)

        approved = sum(1 for c in manifest if c["status"] == "approved")
        queued = sum(1 for c in manifest if c["status"] == "queued")
        all_summary[theme_id] = {
            "total": len(manifest),
            "approved": approved,
            "queued": queued,
            "file": str(out_file)
        }
        print(f"[{theme_id:12}] Total: {len(manifest):2} | Approved: {approved:2} | Queued: {queued:2} -> {out_file.name}")

    print("\nSummary of all 7 decks (546 cards total):")
    total_cards = sum(s["total"] for s in all_summary.values())
    total_approved = sum(s["approved"] for s in all_summary.values())
    total_queued = sum(s["queued"] for s in all_summary.values())
    print(f"TOTAL DECKS: 7")
    print(f"TOTAL CARDS: {total_cards} (Approved: {total_approved}, Queued: {total_queued})")

if __name__ == "__main__":
    main()
