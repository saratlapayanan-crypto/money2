import json

try:
    # 1. Load original interpretations
    with open('data/interpretations.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 2. Filter out corrupted entries (Keep only valid 97 entries)
    # The valid entries are: major-0 to major-21, wands-1, cups-1, swords-1
    # We will keep any entry that is NOT in the corrupted lists.
    corrupted_prefixes = ['wands-', 'cups-', 'swords-', 'pentacles-']
    allowed_minors = ['wands-1', 'cups-1', 'swords-1']
    
    clean_data = []
    for item in data:
        cid = item.get('card_id', '')
        
        # If it's a major arcana, keep it
        if cid.startswith('major-'):
            clean_data.append(item)
            continue
            
        # If it's a minor arcana, only keep the allowed ones (which were intact)
        if cid in allowed_minors:
            clean_data.append(item)
            continue
            
        # Everything else is considered corrupted and will be dropped
        
    print(f"Retained {len(clean_data)} valid entries.")
    
    # 3. Load Batch A
    with open('batch_a.json', 'r', encoding='utf-8') as f:
        batch_a = json.load(f)
        
    # 4. Append Batch A
    clean_data.extend(batch_a)
    print(f"Added {len(batch_a)} Batch A entries. Total is now {len(clean_data)}.")
    
    # 5. Write back safely as UTF-8
    with open('data/interpretations.json', 'w', encoding='utf-8') as f:
        json.dump(clean_data, f, ensure_ascii=False, indent=2)
        
    print("Successfully saved data/interpretations.json with UTF-8 encoding.")

except Exception as e:
    print(f"Error: {e}")
