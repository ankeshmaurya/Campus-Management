$ErrorActionPreference = 'Stop'

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$BACKEND = Join-Path $ROOT 'backend'
$FRONTEND = Join-Path $ROOT 'frontend'
$VENV_DOT = Join-Path $ROOT '.venv'
$VENV = Join-Path $ROOT 'venv'

function Resolve-VenvPath {
  if (Test-Path (Join-Path $VENV 'Scripts\python.exe')) { return $VENV }
  if (Test-Path (Join-Path $VENV_DOT 'Scripts\python.exe')) { return $VENV_DOT }
  return $VENV_DOT
}

$VENV_PATH = Resolve-VenvPath

Write-Host '=== Campus Management: Startup ==='

# --- Python venv ---
if (!(Test-Path (Join-Path $VENV_PATH 'Scripts\python.exe'))) {
  Write-Host ("Creating Python virtual environment (" + (Split-Path $VENV_PATH -Leaf) + ")...")
  py -m venv $VENV_PATH
}

$PY = Join-Path $VENV_PATH 'Scripts\python.exe'
$PIP = Join-Path $VENV_PATH 'Scripts\pip.exe'

Write-Host 'Installing backend dependencies...'
& $PIP install -r (Join-Path $BACKEND 'requirements.txt')

Write-Host 'Running migrations...'
& $PY (Join-Path $BACKEND 'manage.py') migrate

Write-Host 'Seeding demo data (safe to run multiple times)...'
& $PY (Join-Path $BACKEND 'manage.py') seed_demo_data

# --- Frontend deps ---
Write-Host 'Installing frontend dependencies...'
npm --prefix $FRONTEND install

Write-Host 'Starting backend and frontend...'
Start-Process -WorkingDirectory $BACKEND -FilePath $PY -ArgumentList @('manage.py','runserver')
Start-Process -WorkingDirectory $FRONTEND -FilePath 'npm' -ArgumentList @('run','dev')

Write-Host ''
Write-Host 'Backend:  http://127.0.0.1:8000'
Write-Host 'Frontend: http://localhost:5173'
Write-Host 'Login:    admin / Demo@123'
Write-Host '================================='
