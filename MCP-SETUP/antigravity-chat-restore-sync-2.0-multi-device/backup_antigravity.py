import os, sys, zipfile, datetime

sys.stdout.reconfigure(encoding="utf-8")

"""
Antigravity Multi-Device Backup Tool
Exports all chat databases, brain folders, project configurations, and trajectory summaries
into a timestamped portable archive for migrating to another PC or cloud sync.
"""

USER_HOME = os.path.expanduser("~")
APPDATA_ROAMING = os.environ.get("APPDATA", os.path.join(USER_HOME, "AppData", "Roaming"))

BACKUP_TARGETS = [
    # 1. Antigravity IDE backend
    (os.path.join(USER_HOME, ".gemini", "antigravity-ide", "conversations"), "gemini/antigravity-ide/conversations"),
    (os.path.join(USER_HOME, ".gemini", "antigravity-ide", "brain"), "gemini/antigravity-ide/brain"),
    (os.path.join(USER_HOME, ".gemini", "antigravity-ide", "antigravity_state.pbtxt"), "gemini/antigravity-ide/antigravity_state.pbtxt"),
    (os.path.join(USER_HOME, ".gemini", "antigravity-ide", "agyhub_summaries_proto.pb"), "gemini/antigravity-ide/agyhub_summaries_proto.pb"),

    # 2. Antigravity 2.0 backend
    (os.path.join(USER_HOME, ".gemini", "antigravity", "conversations"), "gemini/antigravity/conversations"),
    (os.path.join(USER_HOME, ".gemini", "antigravity", "brain"), "gemini/antigravity/brain"),
    (os.path.join(USER_HOME, ".gemini", "antigravity", "antigravity_state.pbtxt"), "gemini/antigravity/antigravity_state.pbtxt"),
    (os.path.join(USER_HOME, ".gemini", "antigravity", "agyhub_summaries_proto.pb"), "gemini/antigravity/agyhub_summaries_proto.pb"),

    # 3. Global Configs & Projects
    (os.path.join(USER_HOME, ".gemini", "config", "projects"), "gemini/config/projects"),
    (os.path.join(USER_HOME, ".gemini", "config", "skills"), "gemini/config/skills"),
    (os.path.join(USER_HOME, ".gemini", "config", "plugins"), "gemini/config/plugins"),
    (os.path.join(USER_HOME, ".gemini", "config", "hooks.json"), "gemini/config/hooks.json"),

    # 4. Storage state.vscdb
    (os.path.join(APPDATA_ROAMING, "Antigravity IDE", "User", "globalStorage", "state.vscdb"), "appdata/Antigravity IDE/User/globalStorage/state.vscdb"),
    (os.path.join(APPDATA_ROAMING, "Antigravity", "User", "globalStorage", "state.vscdb"), "appdata/Antigravity/User/globalStorage/state.vscdb"),
]

def create_backup(output_dir=None):
    if not output_dir:
        output_dir = os.path.dirname(os.path.abspath(__file__))

    os.makedirs(output_dir, exist_ok=True)
    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    zip_name = f"antigravity_backup_{ts}.zip"
    zip_path = os.path.join(output_dir, zip_name)

    print(f"[*] Creating backup archive: {zip_path}")
    file_count = 0

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for src, arc_prefix in BACKUP_TARGETS:
            if not os.path.exists(src):
                continue
            if os.path.isfile(src):
                zipf.write(src, arc_prefix)
                file_count += 1
            elif os.path.isdir(src):
                for root, dirs, files in os.walk(src):
                    for f in files:
                        fp = os.path.join(root, f)
                        rel = os.path.relpath(fp, src)
                        arcname = os.path.join(arc_prefix, rel).replace("\\", "/")
                        zipf.write(fp, arcname)
                        file_count += 1

    size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"[+] Backup completed: {file_count} files archived ({size_mb:.2f} MB)")
    return zip_path

if __name__ == "__main__":
    create_backup()
