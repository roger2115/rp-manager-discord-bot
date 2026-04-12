# RP Manager - Pre-Deployment Checklist Script (PowerShell)
# Run this before deploying to production

Write-Host "🚀 RP Manager - Pre-Deployment Checklist" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Track overall status
$script:Errors = 0
$script:Warnings = 0

function Check-Pass {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Check-Fail {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
    $script:Errors++
}

function Check-Warn {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
    $script:Warnings++
}

function Get-EnvValue {
    param(
        [string]$FilePath,
        [string]$Key
    )
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath
        foreach ($line in $content) {
            if ($line -match "^$Key=(.*)$") {
                return $matches[1].Trim('"')
            }
        }
    }
    return $null
}

# 1. Check Node.js version
Write-Host "1. Checking Node.js version..."
try {
    $nodeVersion = node -v
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -ge 18) {
        Check-Pass "Node.js version: $nodeVersion"
    } else {
        Check-Fail "Node.js version too old. Need 18+, found: $nodeVersion"
    }
} catch {
    Check-Fail "Node.js not installed"
}

Write-Host ""
Write-Host "2. Checking environment files..."

# Backend .env
$backendEnv = "packages\backend\.env"
if (Test-Path $backendEnv) {
    Check-Pass "Backend .env exists"
    
    # Check required variables
    $clientId = Get-EnvValue $backendEnv "DISCORD_CLIENT_ID"
    if ([string]::IsNullOrEmpty($clientId)) {
        Check-Fail "DISCORD_CLIENT_ID not set in backend .env"
    } else {
        Check-Pass "DISCORD_CLIENT_ID is set"
    }
    
    $clientSecret = Get-EnvValue $backendEnv "DISCORD_CLIENT_SECRET"
    if ([string]::IsNullOrEmpty($clientSecret)) {
        Check-Fail "DISCORD_CLIENT_SECRET not set in backend .env"
    } else {
        Check-Pass "DISCORD_CLIENT_SECRET is set"
    }
    
    $botToken = Get-EnvValue $backendEnv "DISCORD_BOT_TOKEN"
    if ([string]::IsNullOrEmpty($botToken)) {
        Check-Fail "DISCORD_BOT_TOKEN not set in backend .env"
    } else {
        Check-Pass "DISCORD_BOT_TOKEN is set"
    }
    
    $sessionSecret = Get-EnvValue $backendEnv "SESSION_SECRET"
    if ([string]::IsNullOrEmpty($sessionSecret)) {
        Check-Fail "SESSION_SECRET not set in backend .env"
    } else {
        Check-Pass "SESSION_SECRET is set"
    }
    
    $encryptionKey = Get-EnvValue $backendEnv "ENCRYPTION_KEY"
    if ([string]::IsNullOrEmpty($encryptionKey)) {
        Check-Fail "ENCRYPTION_KEY not set in backend .env"
    } else {
        $keyLength = $encryptionKey.Length
        if ($keyLength -eq 32) {
            Check-Pass "ENCRYPTION_KEY is exactly 32 characters"
        } else {
            Check-Fail "ENCRYPTION_KEY must be exactly 32 characters (found: $keyLength)"
        }
    }
    
    $databaseUrl = Get-EnvValue $backendEnv "DATABASE_URL"
    if ([string]::IsNullOrEmpty($databaseUrl)) {
        Check-Fail "DATABASE_URL not set in backend .env"
    } else {
        if ($databaseUrl -like "*postgresql*") {
            Check-Pass "DATABASE_URL uses PostgreSQL (production ready)"
        } elseif ($databaseUrl -like "*sqlite*" -or $databaseUrl -like "*file:*") {
            Check-Warn "DATABASE_URL uses SQLite (not recommended for production)"
        } else {
            Check-Pass "DATABASE_URL is set"
        }
    }
    
    $frontendUrl = Get-EnvValue $backendEnv "FRONTEND_URL"
    if ([string]::IsNullOrEmpty($frontendUrl)) {
        Check-Warn "FRONTEND_URL not set (CORS may not work)"
    } else {
        Check-Pass "FRONTEND_URL is set"
    }
    
} else {
    Check-Fail "Backend .env not found"
}

# Bot .env
Write-Host ""
$botEnv = "packages\bot\.env"
if (Test-Path $botEnv) {
    Check-Pass "Bot .env exists"
    
    $botToken = Get-EnvValue $botEnv "DISCORD_BOT_TOKEN"
    if ([string]::IsNullOrEmpty($botToken)) {
        Check-Fail "DISCORD_BOT_TOKEN not set in bot .env"
    } else {
        Check-Pass "DISCORD_BOT_TOKEN is set"
    }
    
    $apiUrl = Get-EnvValue $botEnv "API_URL"
    if ([string]::IsNullOrEmpty($apiUrl)) {
        Check-Fail "API_URL not set in bot .env"
    } else {
        Check-Pass "API_URL is set"
    }
} else {
    Check-Fail "Bot .env not found"
}

# Frontend .env
Write-Host ""
$frontendEnv = "packages\frontend\.env.local"
if (Test-Path $frontendEnv) {
    Check-Pass "Frontend .env.local exists"
    
    $apiUrl = Get-EnvValue $frontendEnv "NEXT_PUBLIC_API_URL"
    if ([string]::IsNullOrEmpty($apiUrl)) {
        Check-Fail "NEXT_PUBLIC_API_URL not set in frontend .env.local"
    } else {
        Check-Pass "NEXT_PUBLIC_API_URL is set"
    }
} else {
    Check-Fail "Frontend .env.local not found"
}

Write-Host ""
Write-Host "3. Checking dependencies..."

if (Test-Path "node_modules") {
    Check-Pass "Root dependencies installed"
} else {
    Check-Warn "Root dependencies not installed (run: npm install)"
}

if (Test-Path "packages\backend\node_modules") {
    Check-Pass "Backend dependencies installed"
} else {
    Check-Warn "Backend dependencies not installed"
}

if (Test-Path "packages\bot\node_modules") {
    Check-Pass "Bot dependencies installed"
} else {
    Check-Warn "Bot dependencies not installed"
}

if (Test-Path "packages\frontend\node_modules") {
    Check-Pass "Frontend dependencies installed"
} else {
    Check-Warn "Frontend dependencies not installed"
}

Write-Host ""
Write-Host "4. Checking Prisma setup..."

if (Test-Path "packages\backend\prisma\schema.prisma") {
    Check-Pass "Prisma schema exists"
    
    if (Test-Path "packages\backend\node_modules\.prisma") {
        Check-Pass "Prisma client generated"
    } else {
        Check-Warn "Prisma client not generated (run: npx prisma generate)"
    }
} else {
    Check-Fail "Prisma schema not found"
}

Write-Host ""
Write-Host "5. Checking build status..."

if (Test-Path "packages\backend\dist") {
    Check-Pass "Backend built"
} else {
    Check-Warn "Backend not built (run: npm run build in packages/backend)"
}

if (Test-Path "packages\bot\dist") {
    Check-Pass "Bot built"
} else {
    Check-Warn "Bot not built (run: npm run build in packages/bot)"
}

if (Test-Path "packages\frontend\.next") {
    Check-Pass "Frontend built"
} else {
    Check-Warn "Frontend not built (run: npm run build in packages/frontend)"
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host ""

if ($script:Errors -eq 0 -and $script:Warnings -eq 0) {
    Write-Host "✓ All checks passed! Ready for deployment." -ForegroundColor Green
    exit 0
} elseif ($script:Errors -eq 0) {
    Write-Host "⚠ $($script:Warnings) warning(s) found. Review before deploying." -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "✗ $($script:Errors) error(s) and $($script:Warnings) warning(s) found." -ForegroundColor Red
    Write-Host "Please fix errors before deploying." -ForegroundColor Red
    exit 1
}
