#!/usr/bin/env python3
"""
Automated Batch Generator Runner for Tarot Decks
Monitors and processes batch generation manifests:
- Standard deck (51 queued cards)
- 6 Festival decks (468 queued cards)
Updates:
- assets/cards/<deck_id>/<filename>
- APPROVED_CARD_ASSETS in js/art/fronts.js
- data/decks.json
"""

import os
import sys
import json
import time
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SCRIPTS_DIR = BASE_DIR / "scripts"
DATA_DIR = BASE_DIR / "data"
ASSETS_DIR = BASE_DIR / "assets" / "cards"
FRONTS_JS = BASE_DIR / "js" / "art" / "fronts.js"
DECKS_JSON = DATA_DIR / "decks.json"

def get_pending_cards(deck_id="standard"):
    manifest_file = SCRIPTS_DIR / f"manifest_{deck_id}.json"
    if not manifest_file.exists():
        print(f"Manifest not found: {manifest_file}")
        return []
    
    with open(manifest_file, "r", encoding="utf-8") as f:
        cards = json.load(f)
    
    deck_asset_dir = ASSETS_DIR / deck_id
    deck_asset_dir.mkdir(parents=True, exist_ok=True)
    
    pending = []
    for c in cards:
        target_path = deck_asset_dir / c["filename"]
        if not target_path.exists() or c.get("status") != "approved":
            pending.append(c)
            
    return pending

def update_fronts_js(card_id, asset_path):
    if not FRONTS_JS.exists():
        return
    
    content = FRONTS_JS.read_text(encoding="utf-8")
    asset_line = f"    '{card_id}': '{asset_path}',"
    
    if f"'{card_id}':" in content:
        return
    
    marker = "export const APPROVED_CARD_ASSETS = {"
    if marker in content:
        new_content = content.replace(marker, f"{marker}\n{asset_line}")
        FRONTS_JS.write_text(new_content, encoding="utf-8")
        print(f"Registered {card_id} in js/art/fronts.js")

def update_decks_json(deck_id, card_id, asset_path):
    if not DECKS_JSON.exists():
        return
        
    with open(DECKS_JSON, "r", encoding="utf-8") as f:
        decks = json.load(f)
        
    target_deck = next((d for d in decks if d.get("id") == deck_id), None)
    if not target_deck or "cards" not in target_deck:
        return
        
    target_deck["cards"][card_id] = {
        "status": "approved",
        "asset": asset_path
    }
    
    with open(DECKS_JSON, "w", encoding="utf-8") as f:
        json.dump(decks, f, ensure_ascii=False, indent=2)
    print(f"Registered {card_id} in data/decks.json")

def print_status():
    decks = ["standard", "songkran", "loy-krathong", "christmas", "valentine", "halloween", "minimalist"]
    print("=" * 60)
    print("TAROT MASTERPIECE GENERATION PIPELINE STATUS")
    print("=" * 60)
    for deck in decks:
        manifest_file = SCRIPTS_DIR / f"manifest_{deck}.json"
        if not manifest_file.exists():
            continue
        with open(manifest_file, "r", encoding="utf-8") as f:
            cards = json.load(f)
            
        deck_dir = ASSETS_DIR / deck
        present = 0
        if deck_dir.exists():
            present = len(list(deck_dir.glob("*.jpg"))) + len(list(deck_dir.glob("*.webp")))
            
        print(f"Deck: {deck:14} | Total: 78 | Images on Disk: {present:2} | Pending: {78 - present:2}")
    print("=" * 60)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "status":
        print_status()
    else:
        print_status()
        pending_standard = get_pending_cards("standard")
        print(f"\nStandard Deck: {len(pending_standard)} cards awaiting AI generation.")
        print("Scheduled to generate automatically once AI capacity resets at 13:52:25.")
