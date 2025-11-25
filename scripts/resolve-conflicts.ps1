# Script to resolve all merge conflicts by keeping the "Updated upstream" version
# This script removes merge conflict markers and keeps the upstream changes

$files = @(
    "src\types\index.ts",
    "src\pages\Admin.tsx",
    "src\components\ui\Pagination.tsx",
    "src\components\responsive-test\ResponsiveTest.tsx",
    "src\components\responsive-test\MobileRefinementTest.tsx",
    "src\components\admin\ui\AdminSidebar.tsx",
    "src\components\admin\management\UsersManagement.tsx",
    "src\components\admin\management\TestimonialsManagement.tsx",
    "src\components\admin\dashboard\AdvancedDashboard.tsx"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $fullPath) {
        Write-Host "Processing: $file" -ForegroundColor Cyan
        
        $content = Get-Content $fullPath -Raw
        
        # Pattern to match merge conflicts and keep upstream version
        # This regex captures everything between <<<<<<< and ======= (upstream)
        # and removes everything from ======= to >>>>>>> (stashed changes)
        $pattern = '<<<<<<< [^\r\n]+\r?\n(.*?)\r?\n=======\r?\n.*?\r?\n>>>>>>> [^\r\n]+'
        
        $newContent = $content -replace $pattern, '$1'
        
        if ($content -ne $newContent) {
            Set-Content -Path $fullPath -Value $newContent -NoNewline
            Write-Host "  ✓ Resolved conflicts in $file" -ForegroundColor Green
        }
        else {
            Write-Host "  - No conflicts found in $file" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "  ✗ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "All merge conflicts resolved!" -ForegroundColor Green
