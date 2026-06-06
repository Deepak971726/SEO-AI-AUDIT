$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"
$python = Join-Path $backend "venv\Scripts\python.exe"

if (-not (Test-Path $python)) {
    throw "Backend virtual environment not found at $python"
}

$backendPort = 8010
$frontendPort = 5173

foreach ($port in @($backendPort, $frontendPort)) {
    $listeners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($listener in $listeners) {
        $process = Get-CimInstance Win32_Process -Filter "ProcessId=$($listener.OwningProcess)"
        if ($process.CommandLine -notlike "*$root*") {
            throw "Port $port is already used by another application. Stop it or change the project port."
        }
        Stop-Process -Id $listener.OwningProcess -Force
    }
}

$backendArgs = @(
    "-m", "uvicorn",
    "app.main:app",
    "--app-dir", $backend,
    "--host", "127.0.0.1",
    "--port", "$backendPort",
    "--reload"
)

Start-Process `
    -FilePath $python `
    -ArgumentList $backendArgs `
    -WorkingDirectory $backend `
    -WindowStyle Hidden

$healthUrl = "http://127.0.0.1:$backendPort/health"
$deadline = (Get-Date).AddSeconds(20)
$health = $null

while ((Get-Date) -lt $deadline) {
    try {
        $health = Invoke-RestMethod -Uri $healthUrl -TimeoutSec 2
        if ($health.service -eq "seo-ai-audit") {
            break
        }
        throw "Unexpected service '$($health.service)' on backend port $backendPort"
    } catch {
        Start-Sleep -Milliseconds 500
    }
}

if (-not $health -or $health.service -ne "seo-ai-audit") {
    throw "The SEO audit backend did not become ready at $healthUrl"
}

Start-Process `
    -FilePath "npm.cmd" `
    -ArgumentList @("run", "dev", "--", "--host", "127.0.0.1") `
    -WorkingDirectory $frontend `
    -WindowStyle Hidden

Write-Host "SEO AI Audit is running:"
Write-Host "  App:     http://127.0.0.1:$frontendPort"
Write-Host "  Backend: $healthUrl"
