---
name: godot-mobile-hardening
description: "Industry-standard hardening, resilience, lifecycle, and edge-case prevention for Godot 4 2D Mobile Games (Android Back Button, Atomic Save/Restore, Touch Cooldowns, Projectile Safety Bounds, Zero-Allocation Audio, Viewport Stretch)."
---

# 🛡️ GODOT 4 MOBILE HARDENING & EDGE-CASE RESILIENCE

Comprehensive guide and architectural patterns for hardening Godot 4 2D mobile games against crashes, OS interruptions, memory leaks, input glitches, and data loss.

---

## 1. 💾 Fault-Tolerant Atomic Save & Auto-Recovery
Mobile operating systems (Android, iOS) frequently kill backgrounded games without warning when memory is constrained. Writing directly to `user://savegame.json` can corrupt or wipe the save file if interrupted mid-write.

### Recommended Pattern: Atomic Write with Automatic Backup
```gdscript
const SAVE_PATH = "user://savegame.json"
const TEMP_PATH = "user://savegame.json.tmp"
const BACKUP_PATH = "user://savegame.json.bak"

func save_game() -> void:
    # 1. Update checksum / total stars
    _prepare_save_payload()

    # 2. Write to temporary file first
    var file = FileAccess.open(TEMP_PATH, FileAccess.WRITE)
    if file:
        file.store_string(JSON.stringify(save_data, "\t"))
        file.flush()
        file.close()

        # 3. Create/update backup of previous valid save
        if FileAccess.file_exists(SAVE_PATH):
            var dir = DirAccess.open("user://")
            if dir:
                dir.copy(SAVE_PATH, BACKUP_PATH)

        # 4. Atomically promote temp to main save
        var dir = DirAccess.open("user://")
        if dir:
            if dir.file_exists(SAVE_PATH):
                dir.remove(SAVE_PATH)
            dir.rename(TEMP_PATH, SAVE_PATH)

func load_game() -> void:
    if not FileAccess.file_exists(SAVE_PATH):
        if FileAccess.file_exists(BACKUP_PATH):
            # Primary missing, recover from backup!
            _recover_from_backup()
        else:
            save_game()
        return

    var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
    if file:
        var text = file.get_as_text()
        file.close()
        var json = JSON.new()
        var err = json.parse(text)
        if err == OK and typeof(json.data) == TYPE_DICTIONARY:
            _merge_save_data(json.data)
            return
    
    # If primary parse failed, auto-recover from backup
    _recover_from_backup()
```

### Mobile OS Lifecycle Auto-Save
In an Autoload `Node` (e.g. `SaveManager.gd`), listen to engine notifications:
```gdscript
func _notification(what: int) -> void:
    match what:
        NOTIFICATION_APPLICATION_PAUSED, NOTIFICATION_WM_CLOSE_REQUEST, NOTIFICATION_WM_GO_BACK_REQUEST:
            save_game()
```

---

## 2. 📱 Android Hardware/Gesture Back Button (`NOTIFICATION_WM_GO_BACK_REQUEST`)
Every mobile user expects the device Back gesture to navigate intuitively rather than killing the app abruptly.

```gdscript
func _notification(what: int) -> void:
    if what == NOTIFICATION_WM_GO_BACK_REQUEST:
        _handle_back_request()

func _handle_back_request() -> void:
    if is_in_active_gameplay():
        toggle_pause_menu()
    elif is_modal_open():
        close_top_modal()
    elif is_in_level_select():
        go_to_main_menu()
    elif is_in_main_menu():
        # Confirm exit or minimize
        get_tree().root.propagate_notification(NOTIFICATION_WM_CLOSE_REQUEST)
        get_tree().quit()
```

---

## 3. 🎯 Touch & Gesture Hardening (Multi-Touch & Dead Zones)
1. **Accidental Double-Tap Prevention:**
   When firing or dropping projectiles, enforce an internal cooldown ($0.35\text{s}$) to avoid double-dropping if two fingers touch simultaneously.
   ```gdscript
   var drop_cooldown: float = 0.0
   func _process(delta: float):
       if drop_cooldown > 0.0: drop_cooldown -= delta

   func can_drop() -> bool:
       return is_level_active and drop_cooldown <= 0.0
   ```
2. **Top/Bottom Screen Insets:**
   Avoid capturing drag inputs in notification bar insets ($y < 65\text{px}$) or navigation/inventory shelf bars ($y > 880\text{px}$).
3. **Safe Area Insets (Notches & Punch Holes):**
   ```gdscript
   var safe_area = DisplayServer.get_display_safe_area()
   ```

---

## 4. 🚀 Physics Boundary Safety Net (Out-of-Bounds & Despawn)
Fast projectiles or bouncy objects can sometimes glitch through geometry or fall outside the playfield. Without a safety net, an out-of-bounds projectile never breaks, permanently hanging the level's win/loss evaluation.

### Mandatory Projectile Bounds Check
```gdscript
const MIN_DESPAWN_Y = -600.0
const MAX_DESPAWN_Y = 1400.0
const MAX_DESPAWN_X = 2000.0
const MAX_AIRBORNE_LIFETIME = 8.0

var total_airborne_timer: float = 0.0

func _physics_process(delta: float) -> void:
    if is_broken: return
    
    total_airborne_timer += delta
    var pos = global_position
    
    # Check boundaries or runaway timer
    if pos.y > MAX_DESPAWN_Y or pos.y < MIN_DESPAWN_Y or abs(pos.x) > MAX_DESPAWN_X or total_airborne_timer > MAX_AIRBORNE_LIFETIME:
        _on_out_of_bounds_cleanup()

func _on_out_of_bounds_cleanup() -> void:
    if is_broken: return
    is_broken = true
    # Trigger safe break/detonate logic and remove from tree
    queue_free()
```

---

## 5. 🔊 Zero-Allocation Procedural Audio Caching
Generating procedural audio buffers (`PackedByteArray` + `AudioStreamWAV.new()`) on every sound effect creates high Garbage Collection (GC) pressure on mobile CPUs, leading to frame drops during intense multi-body collisions.

### Pre-Cached Synth Stream Pattern
```gdscript
var sound_cache: Dictionary = {}

func get_or_create_stream(type: String, freq: float, duration: float) -> AudioStreamWAV:
    var key = "%s_%.1f_%.2f" % [type, freq, duration]
    if sound_cache.has(key):
        return sound_cache[key]
    
    var stream = _generate_wav(type, freq, duration)
    sound_cache[key] = stream
    return stream
```

---

## 6. 📐 Responsive Multi-Resolution Viewport (`project.godot`)
- Set `window/stretch/mode="canvas_items"`
- Set `window/stretch/aspect="expand"` (Allows dynamic height on tall 20:9 phones without stretching or distorting textures)
- Ensure all CanvasLayers and Panels anchor to `PRESET_FULL_RECT` with responsive Margins.
