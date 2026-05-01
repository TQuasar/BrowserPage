# run-dev.ps1
Set-Location $PSScriptRoot
Start-Process "http://localhost:5173"
Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -WindowStyle Hidden