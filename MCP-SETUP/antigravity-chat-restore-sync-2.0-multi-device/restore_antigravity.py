import os, sys, zipfile, sqlite3, base64, json, shutil

sys.stdout.reconfigure(encoding="utf-8")

"""
Antigravity Multi-Device Restore Tool
Restores chat history, brain artifacts, project definitions, and runs automatic re-indexing
and click-disappear bug prevention on any new or existing device.
"""

USER_HOME = os.path.expanduser("~")
APPDATA_ROAMING = os.environ.get("APPDATA", os.path.join(USER_HOME, "AppData", "Roaming"))

DEST_MAPPINGS = {
    "gemini/": os.path.join(USER_HOME, ".gemini"),
    "appdata/Antigravity IDE/": os.path.join(APPDATA_ROAMING, "Antigravity IDE"),
    "appdata/Antigravity/": os.path.join(APPDATA_ROAMING, "Antigravity"),
}

def restore_backup(zip_path):
    if not os.path.exists(zip_path):
        print(f"[!] Backup archive not found: {zip_path}")
        return

    print(f"[*] Restoring from: {zip_path}")

    with zipfile.ZipFile(zip_path, "r") as zipf:
        for member in zipf.infolist():
            arcname = member.filename
            dest_root = None
            rel_path = ""
            for prefix, base_dir in DEST_MAPPINGS.items():
                if arcname.startswith(prefix):
                    dest_root = base_dir
                    rel_path = arcname[len(prefix):]
                    break
            
            if dest_root and rel_path:
                target_path = os.path.join(dest_root, rel_path)
                os.makedirs(os.path.dirname(target_path), exist_ok=True)
                with zipf.open(member) as src, open(target_path, "wb") as dst:
                    shutil.copyfileobj(src, dst)

    print("[+] Files extracted successfully.")
    
    # Run sync to fix SQLite metadata and Project links
    script_dir = os.path.dirname(os.path.abspath(__file__))
    sync_script = os.path.join(script_dir, "sync_ide_to_2.0.py")
    if os.path.exists(sync_script):
        print("[*] Running post-restore indexing and validation...")
        import subprocess
        subprocess.run([sys.executable, sync_script], check=True)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        restore_backup(sys.argv[1])
    else:
        # Search for latest zip in current directory
        script_dir = os.path.dirname(os.path.abspath(__file__))
        zips = [os.path.join(script_dir, f) for f in os.listdir(script_dir) if f.startswith("antigravity_backup_") and f.endswith(".zip")]
        if zips:
            latest = sorted(zips)[-1]
            restore_backup(latest)
        else:
            print("Usage: python restore_antigravity.py <path_to_backup.zip>")
