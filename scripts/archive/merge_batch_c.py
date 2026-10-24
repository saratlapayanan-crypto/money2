import json

try:
    with open('data/interpretations.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print(f"Loaded {len(data)} existing entries.")
    
    with open('batch_c.json', 'r', encoding='utf-8') as f:
        batch = json.load(f)
        
    data.extend(batch)
    print(f"Added {len(batch)} Batch C entries. Total is now {len(data)}.")
    
    with open('data/interpretations.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print("Successfully saved data/interpretations.json with UTF-8 encoding.")

except Exception as e:
    print(f"Error: {e}")
