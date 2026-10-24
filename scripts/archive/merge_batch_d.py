import json

try:
    with open('data/interpretations.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print(f"Loaded {len(data)} existing entries.")
    
    # Remove any existing pentacles entries to prevent duplicate or corrupted data
    clean_data = [item for item in data if not item.get('card_id', '').startswith('pentacles-')]
    removed = len(data) - len(clean_data)
    print(f"Removed {removed} existing pentacles entries.")
    
    with open('batch_d.json', 'r', encoding='utf-8') as f:
        batch = json.load(f)
        
    clean_data.extend(batch)
    print(f"Added {len(batch)} Batch D entries. Total is now {len(clean_data)}.")
    
    with open('data/interpretations.json', 'w', encoding='utf-8') as f:
        json.dump(clean_data, f, ensure_ascii=False, indent=2)
        
    print("Successfully saved data/interpretations.json with UTF-8 encoding.")

except Exception as e:
    print(f"Error: {e}")
