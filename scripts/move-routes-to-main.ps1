# Script to move all non-auth routes to (main) route group
# Run this from the project root: .\scripts\move-routes-to-main.ps1

$appDir = "src\app"
$mainDir = "$appDir\(main)"

# Routes to move (excluding route groups, api, actions, styles)
$routesToMove = @(
    "coffees",
    "roasters", 
    "dashboard",
    "learn",
    "tools",
    "demo",
    "dark-roast",
    "french-press-coffee",
    "light-roast",
    "medium-roast",
    "mid-range-coffee",
    "v60-coffee",
    "aeropress-coffee",
    "budget-coffee"
)

Write-Host "Moving routes to (main) route group..." -ForegroundColor Cyan

foreach ($route in $routesToMove) {
    $sourcePath = Join-Path $appDir $route
    $destPath = Join-Path $mainDir $route
    
    if (Test-Path $sourcePath) {
        Write-Host "Moving $route..." -ForegroundColor Yellow
        try {
            Move-Item -Path $sourcePath -Destination $destPath -Force -ErrorAction Stop
            Write-Host "  ✓ Moved $route" -ForegroundColor Green
        } catch {
            Write-Host "  ✗ Failed to move $route : $_" -ForegroundColor Red
        }
    } else {
        Write-Host "  ⊘ $route not found, skipping..." -ForegroundColor Gray
    }
}

# Handle root page.tsx (should already be moved, but check)
$rootPage = Join-Path $appDir "page.tsx"
$mainPage = Join-Path $mainDir "page.tsx"

if ((Test-Path $rootPage) -And !(Test-Path $mainPage)) {
    Write-Host "Moving root page.tsx..." -ForegroundColor Yellow
    try {
        Move-Item -Path $rootPage -Destination $mainPage -Force -ErrorAction Stop
        Write-Host "  ✓ Moved page.tsx" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Failed to move page.tsx : $_" -ForegroundColor Red
    }
}

Write-Host "`nDone! All routes have been moved to (main) route group." -ForegroundColor Cyan
Write-Host "Note: You may need to delete old directories if they still exist." -ForegroundColor Yellow
