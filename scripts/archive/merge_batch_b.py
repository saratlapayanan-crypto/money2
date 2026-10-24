import json

try:
    # Load current data (which currently has 136 entries)
    with open('data/interpretations.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print(f"Loaded {len(data)} existing entries.")
    
    # Load Batch B
    with open('batch_b.json', 'r', encoding='utf-8') as f:
        batch_b = json.load(f)
        
    # Append Batch B
    data.extend(batch_b)
    print(f"Added {len(batch_b)} Batch B entries. Total is now {len(data)}.")
    
    # Write back safely as UTF-8
    with open('data/interpretations.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print("Successfully saved data/interpretations.json with UTF-8 encoding.")

except Exception as e:
    print(f"Error: {e}")
