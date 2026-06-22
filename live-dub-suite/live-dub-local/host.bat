@echo off
echo %date% %time% - host.bat executed >> d:\folder\tools\live-dub-local\host_bat.log
python d:\folder\tools\live-dub-local\host.py %*
