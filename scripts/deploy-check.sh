#!/bin/bash

# RP Manager - Pre-Deployment Checklist Script
# Run this before deploying to production

echo "🚀 RP Manager - Pre-Deployment Checklist"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Track overall status
ERRORS=0
WARNINGS=0

echo "1. Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        check_pass "Node.js version: $(node -v)"
    else
        check_fail "Node.js version too old. Need 18+, found: $(node -v)"
        ERRORS=$((ERRORS + 1))
    fi
else
    check_fail "Node.js not installed"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "2. Checking environment files..."

# Backend .env
if [ -f "packages/backend/.env" ]; then
    check_pass "Backend .env exists"
    
    # Check required variables
    source packages/backend/.env
    
    if [ -z "$DISCORD_CLIENT_ID" ]; then
        check_fail "DISCORD_CLIENT_ID not set in backend .env"
        ERRORS=$((ERRORS + 1))
    else
        check_pass "DISCORD_CLIENT_ID is set"
    fi
    
    if [ -z "$DISCORD_CLIENT_SECRET" ]; then
        check_fail "DISCORD_CLIENT_SECRET not set in backend .env"
        ERRORS=$((ERRORS + 1))
    else
        check_pass "DISCORD_CLIENT_SECRET is set"
    fi
    
    if [ -z "$DISCORD_BOT_TOKEN" ]; then
        check_fail "DISCORD_BOT_TOKEN not set in backend .env"
        ERRORS=$((ERRORS + 1))
    else
        check_pass "DISCORD_BOT_TOKEN is set"
    fi
    
    if [ -z "$SESSION_SECRET" ]; then
        check_fail "SESSION_SECRET not set in backend .env"
        ERRORS=$((ERRORS + 1))
    else
        check_pass "SESSION_SECRET is set"
    fi
    
    if [ -z "$ENCRYPTION_KEY" ]; then
        check_fail "ENCRYPTION_KEY not set in backend .env"
        ERRORS=$((ERRORS + 1))
    else
        KEY_LENGTH=${#ENCRYPTION_KEY}
        if [ "$KEY_LENGTH" -eq 32 ]; then
            check_pass "ENCRYPTION_KEY is exactly 32 characters"
        else
            check_fail "ENCRYPTION_KEY must be exactly 32 characters (found: $KEY_LENGTH)"
            ERRORS=$((ERRORS + 1))
        fi
    fi
    
    if [ -z "$DATABASE_URL" ]; then
        check_fail "DATABASE_URL not set in backend .env"
        ERRORS=$((ERRORS + 1))
    else
        if [[ "$DATABASE_URL" == *"postgresql"* ]]; then
            check_pass "DATABASE_URL uses PostgreSQL (production ready)"
        elif [[ "$DATABASE_URL" == *"sqlite"* ]] || [[ "$DATABASE_URL" == *"file:"* ]]; then
            check_warn "DATABASE_URL uses SQLite (not recommended for production)"
            WARNINGS=$((WARNINGS + 1))
        else
            check_pass "DATABASE_URL is set"
        fi
    fi
    
    if [ -z "$FRONTEND_URL" ]; then
        check_warn "FRONTEND_URL not set (CORS may not work)"
        WARNINGS=$((WARNINGS + 1))
    else
        check_pass "FRONTEND_URL is set"
    fi
    
else
    check_fail "Backend .env not found"
    ERRORS=$((ERRORS + 1))
fi

# Bot .env
echo ""
if [ -f "packages/bot/.env" ]; then
    check_pass "Bot .env exists"
    
    source packages/bot/.env
    
    if [ -z "$DISCORD_BOT_TOKEN" ]; then
        check_fail "DISCORD_BOT_TOKEN not set in bot .env"
        ERRORS=$((ERRORS + 1))
    else
        check_pass "DISCORD_BOT_TOKEN is set"
    fi
    
    if [ -z "$API_URL" ]; then
        check_fail "API_URL not set in bot .env"
        ERRORS=$((ERRORS + 1))
    else
        check_pass "API_URL is set"
    fi
else
    check_fail "Bot .env not found"
    ERRORS=$((ERRORS + 1))
fi

# Frontend .env
echo ""
if [ -f "packages/frontend/.env.local" ]; then
    check_pass "Frontend .env.local exists"
    
    source packages/frontend/.env.local
    
    if [ -z "$NEXT_PUBLIC_API_URL" ]; then
        check_fail "NEXT_PUBLIC_API_URL not set in frontend .env.local"
        ERRORS=$((ERRORS + 1))
    else
        check_pass "NEXT_PUBLIC_API_URL is set"
    fi
else
    check_fail "Frontend .env.local not found"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "3. Checking dependencies..."

if [ -d "node_modules" ]; then
    check_pass "Root dependencies installed"
else
    check_warn "Root dependencies not installed (run: npm install)"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -d "packages/backend/node_modules" ]; then
    check_pass "Backend dependencies installed"
else
    check_warn "Backend dependencies not installed"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -d "packages/bot/node_modules" ]; then
    check_pass "Bot dependencies installed"
else
    check_warn "Bot dependencies not installed"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -d "packages/frontend/node_modules" ]; then
    check_pass "Frontend dependencies installed"
else
    check_warn "Frontend dependencies not installed"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "4. Checking Prisma setup..."

if [ -f "packages/backend/prisma/schema.prisma" ]; then
    check_pass "Prisma schema exists"
    
    if [ -d "packages/backend/node_modules/.prisma" ]; then
        check_pass "Prisma client generated"
    else
        check_warn "Prisma client not generated (run: npx prisma generate)"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    check_fail "Prisma schema not found"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "5. Checking build status..."

if [ -d "packages/backend/dist" ]; then
    check_pass "Backend built"
else
    check_warn "Backend not built (run: npm run build in packages/backend)"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -d "packages/bot/dist" ]; then
    check_pass "Bot built"
else
    check_warn "Bot not built (run: npm run build in packages/bot)"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -d "packages/frontend/.next" ]; then
    check_pass "Frontend built"
else
    check_warn "Frontend not built (run: npm run build in packages/frontend)"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "=========================================="
echo "Summary:"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready for deployment.${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found. Review before deploying.${NC}"
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) and $WARNINGS warning(s) found.${NC}"
    echo -e "${RED}Please fix errors before deploying.${NC}"
    exit 1
fi
