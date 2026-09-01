import json

with open(r"d:\folder\tools\game_asset_studio\game_projects.json", "r", encoding="utf-8") as f:
    gp = json.load(f)

assets = gp["games"][0]["assets"]
plans = []

for a in assets:
    plans.append({
        "id": "plan_" + a["id"],
        "asset_id": a["id"],
        "name": a["name"],
        "category": a["category"],
        "format": a["format"],
        "format_reason": a.get("format_reason", "2D Cartoon Asset chuẩn Mobile"),
        "priority": a.get("priority", "Cao"),
        "status": a.get("status", "pending"),
        "prompt_video": a.get("prompt_video", ""),
        "prompt_image": a.get("prompt_image", ""),
        "animations": a.get("animations", []),
        "created_at": "2026-09-01 16:50"
    })

with open(r"d:\folder\tools\game_asset_studio\asset_plans.json", "w", encoding="utf-8") as f:
    json.dump(plans, f, ensure_ascii=False, indent=2)

print("ASSET_PLANS_JSON_SYNCED_SUCCESSFULLY with", len(plans), "assets")
