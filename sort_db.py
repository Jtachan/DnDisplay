"""Minimal script to sort the DB entries."""
import json
from pathlib import Path

if __name__ == '__main__':
    for file in Path("sheets").glob("*.json"):
        with open(file, "r", encoding="utf-8") as fh:
            data = {
                k: v for k, v in
                sorted(json.load(fh).items(), key=lambda it: it[0])
            }
        with open(file, "w", encoding="utf-8") as fh:
            json.dump(data, fh, indent=2, ensure_ascii=False)
