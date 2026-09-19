import json

print("--- FULL AUDIT START ---")

try:
    with open('data/cards.json', 'r', encoding='utf-8') as f:
        cards = json.load(f)
    with open('data/interpretations.json', 'r', encoding='utf-8') as f:
        interps = json.load(f)
    print("1. File encoding is UTF-8: PASS")
except Exception as e:
    print(f"1. File encoding is UTF-8: FAIL ({e})")
    exit()

total_entries = len(interps)
print(f"2. Total entries: {total_entries} (Expected 256: {'PASS' if total_entries == 256 else 'FAIL'})")

card_ids_in_cards = set(c['id'] for c in cards)
invalid_ids = set([i['card_id'] for i in interps if i['card_id'] not in card_ids_in_cards])
print(f"3. All card_ids exist in cards.json: {'PASS' if not invalid_ids else 'FAIL (Invalid: ' + str(invalid_ids) + ')'}")

card_categories = {}
for i in interps:
    cid = i['card_id']
    if cid not in card_categories:
        card_categories[cid] = set()
    card_categories[cid].add(i['category'])

missing_lfw = []
major_ids = [c['id'] for c in cards if c['id'].startswith('major-')]
missing_daily = []

for cid in card_ids_in_cards:
    cats = card_categories.get(cid, set())
    if not {'love', 'finance', 'work'}.issubset(cats):
        missing_lfw.append(cid)
    if cid in major_ids and 'daily' not in cats:
        missing_daily.append(cid)

print(f"4. All 78 cards have 'love, finance, work': {'PASS' if not missing_lfw else 'FAIL (Missing: ' + str(missing_lfw) + ')'}")
print(f"5. All 22 Major Arcana have 'daily' message: {'PASS' if not missing_daily else 'FAIL (Missing: ' + str(missing_daily) + ')'}")

question_marks = [i['card_id'] for i in interps if '?????' in (i.get('summary','') or '') or '?????' in (i.get('action','') or '')]
print(f"6. No entry contains '?????': {'PASS' if not question_marks else 'FAIL (Found in: ' + str(question_marks) + ')'}")

print("7. Examples from each suit:")
suits_found = set()
for i in reversed(interps):
    cid = i['card_id']
    suit = cid.split('-')[0]
    if suit in ['wands', 'cups', 'swords', 'pentacles'] and suit not in suits_found:
        suits_found.add(suit)
        print(f"   [{suit.upper()}] {cid} ({i['category']}): {i['summary']}")
    if len(suits_found) == 4:
        break

print("--- FULL AUDIT END ---")
