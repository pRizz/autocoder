#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# Open-Autocoder Development Environment Setup Script
# ============================================================================
# This script sets up the development environment for the open-autocoder project.
# Run it from the project root directory.
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check required dependencies
check_dependencies() {
    log_info "Checking required dependencies..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 20+ from https://nodejs.org"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        log_error "Node.js 20+ is required. Current version: $(node -v)"
        exit 1
    fi
    log_success "Node.js $(node -v) found"

    # Check pnpm
    if ! command -v pnpm &> /dev/null; then
        log_warn "pnpm is not installed. Installing globally..."
        npm install -g pnpm
    fi
    log_success "pnpm $(pnpm -v) found"

    # Check git
    if ! command -v git &> /dev/null; then
        log_error "Git is not installed. Please install Git from https://git-scm.com"
        exit 1
    fi
    log_success "Git $(git --version | cut -d' ' -f3) found"

    # Check opencode (optional but recommended)
    if command -v opencode &> /dev/null; then
        log_success "opencode found"
    else
        log_warn "opencode is not installed. Install it for AI agent functionality."
        log_warn "Visit: https://github.com/opencode-ai/opencode"
    fi
}

# Install project dependencies
install_dependencies() {
    log_info "Installing project dependencies with pnpm..."
    pnpm install
    log_success "Dependencies installed"
}

# Build all packages
build_packages() {
    log_info "Building all packages..."
    pnpm build
    log_success "All packages built successfully"
}

# Initialize database
init_database() {
    log_info "Initializing database..."

    # Create data directory if it doesn't exist
    mkdir -p ~/.open-autocoder

    log_success "Database directory initialized at ~/.open-autocoder"
}

# Start development servers
start_dev() {
    log_info "Starting development servers..."

    # Start in development mode
    pnpm dev
}

# Print help information
print_help() {
    echo ""
    echo "Open-Autocoder Development Environment"
    echo "======================================="
    echo ""
    echo "Usage: ./init.sh [command]"
    echo ""
    echo "Commands:"
    echo "  (no args)   Full setup: check deps, install, build, and start dev servers"
    echo "  check       Check dependencies only"
    echo "  install     Install dependencies only"
    echo "  build       Build all packages"
    echo "  dev         Start development servers"
    echo "  help        Show this help message"
    echo ""
    echo "After setup, you can access:"
    echo "  - Web UI:    http://localhost:3000"
    echo "  - API:       http://localhost:3001"
    echo ""
    echo "Environment Variables:"
    echo "  PORT              API server port (default: 3001)"
    echo "  WEB_PORT          Web UI port (default: 3000)"
    echo "  PLAYWRIGHT_HEADLESS  Run browser tests headless (default: true)"
    echo ""
}

# Main script execution
main() {
    echo ""
    echo "=============================================="
    echo "  Open-Autocoder Development Setup"
    echo "=============================================="
    echo ""

    case "${1:-}" in
        check)
            check_dependencies
            ;;
        install)
            check_dependencies
            install_dependencies
            ;;
        build)
            build_packages
            ;;
        dev)
            start_dev
            ;;
        help|--help|-h)
            print_help
            ;;
        "")
            # Full setup
            check_dependencies
            install_dependencies
            init_database
            build_packages

            echo ""
            log_success "Setup complete!"
            echo ""
            echo "To start development servers, run:"
            echo "  pnpm dev"
            echo ""
            echo "Or to start just the API server:"
            echo "  pnpm --filter @open-autocoder/server dev"
            echo ""
            echo "Web UI will be available at: http://localhost:3000"
            echo "API will be available at:    http://localhost:3001"
            echo ""
            ;;
        *)
            log_error "Unknown command: $1"
            print_help
            exit 1
            ;;
    esac
}

main "$@"
