# Script to easily deploy the NeoClip website to the public GitHub repo
$ErrorActionPreference = "Stop"
Write-Host "Deploying NeoClip Website to lelongc/neoclip.git..." -ForegroundColor Cyan

$tempFolder = "d:\folder\tools\money\magic-clip\_temp_deploy_repo"
if (Test-Path $tempFolder) { Remove-Item -Path $tempFolder -Recurse -Force }

git clone https://github.com/lelongc/neoclip.git $tempFolder
Copy-Item -Path "d:\folder\tools\money\magic-clip\website\*" -Destination $tempFolder -Recurse -Force

cd $tempFolder
git add .
git commit -m "Auto-deploy website update"
git push origin main
cd ..

Remove-Item -Path $tempFolder -Recurse -Force
Write-Host "Deployment Complete!" -ForegroundColor Green
