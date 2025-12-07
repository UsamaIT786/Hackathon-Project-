#!/usr/bin/env bash
# Quick verification script - ensures everything is set up correctly

echo "🔍 RAG Chatbot - Verification Script"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

checks_passed=0
checks_failed=0

# Function to check if command exists
command_exists () {
    command -v "$1" >/dev/null 2>&1
}

# Function to print check result
print_check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((checks_passed++))
    else
        echo -e "${RED}✗${NC} $2"
        ((checks_failed++))
    fi
}

# Check Node.js
if command_exists node; then
    node_version=$(node -v)
    print_check 0 "Node.js found: $node_version"
else
    print_check 1 "Node.js not found (required)"
fi

# Check npm
if command_exists npm; then
    npm_version=$(npm -v)
    print_check 0 "npm found: $npm_version"
else
    print_check 1 "npm not found (required)"
fi

echo ""
echo "Checking project files..."
echo ""

# Check key files
files=(
    "package.json"
    "docusaurus.config.js"
    "sidebars.js"
    "README.md"
    "rag/ingest.js"
    "rag/embed.js"
    "rag/server.js"
    "rag/search.js"
    "rag/utils.js"
    "src/components/Chatbot/index.jsx"
    "src/components/Chatbot/style.module.css"
    "src/theme/Root.js"
    "src/css/custom.css"
    "docs/index.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        print_check 0 "Found: $file"
    else
        print_check 1 "Missing: $file"
    fi
done

echo ""
echo "Checking directories..."
echo ""

dirs=(
    "docs"
    "rag"
    "src"
    "src/components"
    "src/components/Chatbot"
    "src/theme"
    "src/css"
)

for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        print_check 0 "Found: $dir/"
    else
        print_check 1 "Missing: $dir/"
    fi
done

echo ""
echo "===================================="
echo -e "Results: ${GREEN}$checks_passed passed${NC}, ${RED}$checks_failed failed${NC}"
echo ""

if [ $checks_failed -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. npm install"
    echo "2. npm run rag:ingest"
    echo "3. npm run rag:embed"
    echo "4. npm run rag:serve"
    echo "5. npm start"
    exit 0
else
    echo -e "${RED}✗ Some checks failed!${NC}"
    echo "See messages above for details."
    exit 1
fi
