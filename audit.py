import json

with open('data/cards.json', 'r', encoding='utf-8') as f:
    cards = json.load(f)
with open('data/interpretations.json', 'r', encoding='utf-8') as f:
    interps = json.load(f)

print("--- AUDIT RESULTS ---")

# 1. Total entries
total_entries = len(interps)
print(f"1. Total entries: {total_entries}")

# 2. Check card_ids in cards.json
card_ids_in_cards = set(c['id'] for c in cards)
invalid_ids = set()
for i in interps:
    if i['card_id'] not in card_ids_in_cards:
        invalid_ids.add(i['card_id'])

print(f"2. All card_ids exist in cards.json: {'PASS' if len(invalid_ids) == 0 else 'FAIL'}")
if invalid_ids:
    print(f"   Invalid IDs found: {invalid_ids}")

# 3. Check every card has love, finance, work
card_categories = {}
for i in interps:
    cid = i['card_id']
    if cid not in card_categories:
        card_categories[cid] = set()
    card_categories[cid].add(i['category'])

missing_lfw = []
for cid in card_ids_in_cards:
    cats = card_categories.get(cid, set())
    if not {'love', 'finance', 'work'}.issubset(cats):
        missing_lfw.append((cid, cats))

print(f"3. Every card has love, finance, work: {'PASS' if len(missing_lfw) == 0 else 'FAIL'}")
if missing_lfw:
    for cid, cats in missing_lfw:
        print(f"   {cid} has only: {cats}")

# 4. Check Major Arcana has daily message
major_ids = [c['id'] for c in cards if c['id'].startswith('major-')]
missing_daily = []
for cid in major_ids:
    cats = card_categories.get(cid, set())
    if 'daily' not in cats:
        missing_daily.append(cid)

print(f"4. All Major Arcana have 'daily' message: {'PASS' if len(missing_daily) == 0 else 'FAIL'}")
if missing_daily:
    print(f"   Missing daily for: {missing_daily}")

