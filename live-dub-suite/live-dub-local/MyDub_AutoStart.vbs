Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd.exe /c cd /d d:\folder\tools\live-dub-local && python server.py", 0, False
