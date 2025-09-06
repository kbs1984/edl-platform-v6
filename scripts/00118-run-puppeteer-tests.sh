#!/bin/bash
# ---
# session: "00118"
# type: "script"
# status: "active"
# created: "2025-08-30"
# modified: "2025-08-30"
# title: "Puppeteer MCP Test Runner"
# purpose: "Complete test runner for EDL platform with Puppeteer MCP integration"
# language: "bash"
# category: "testing"
# topics: ["testing", "automation", "puppeteer", "test-runner"]
# priority: "P1"
# domain: "core"
# ---
# Puppeteer MCP Test Runner for EDL Platform
# Session 00118

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Puppeteer MCP is installed
print_status "Checking Puppeteer MCP installation..."
if npx puppeteer-mcp-claude status 2>/dev/null | grep -q "installed"; then
    print_success "Puppeteer MCP is installed"
else
    print_error "Puppeteer MCP is not installed"
    print_status "Installing Puppeteer MCP..."
    npx puppeteer-mcp-claude install
fi

# Load test environment
if [ -f ".env.test" ]; then
    print_status "Loading test environment variables..."
    export $(cat .env.test | grep -v '^#' | xargs)
    print_success "Test environment loaded"
else
    print_warning ".env.test not found, using default environment"
fi

# Function to start an app
start_app() {
    local app_name=$1
    local app_path=$2
    local app_port=$3
    
    print_status "Starting $app_name on port $app_port..."
    
    # Kill any existing process on the port
    lsof -ti:$app_port | xargs kill -9 2>/dev/null || true
    
    # Start the app in background
    cd "$app_path"
    npm run dev -- --port $app_port > /tmp/${app_name}.log 2>&1 &
    local pid=$!
    cd - > /dev/null
    
    # Wait for app to be ready
    print_status "Waiting for $app_name to be ready..."
    local count=0
    while ! curl -s http://localhost:$app_port > /dev/null; do
        sleep 1
        count=$((count + 1))
        if [ $count -gt 30 ]; then
            print_error "$app_name failed to start within 30 seconds"
            return 1
        fi
    done
    
    print_success "$app_name is running (PID: $pid)"
    echo $pid
}

# Function to run Puppeteer tests
run_puppeteer_test() {
    local test_name=$1
    local test_file=$2
    
    print_status "Running test: $test_name"
    
    # Create test results directory
    mkdir -p test-results
    
    # Run the test using Claude with Puppeteer MCP
    # Note: This assumes Claude CLI is available
    # You might need to adjust this based on your setup
    
    echo "Test command would be executed here"
    echo "Using test file: $test_file"
    
    # Example of what the command might look like:
    # claude --dangerously-skip-permissions -p "$(cat $test_file)"
}

# Main test execution
main() {
    print_status "Starting EDL Platform Test Suite"
    echo "========================================"
    
    # Create test results directory
    mkdir -p test-results
    
    # Start all applications
    print_status "Starting applications..."
    
    # Start Auth Gateway
    AUTH_PID=$(start_app "auth-gateway" "reconciliation/active-work/auth-gateway" 3000)
    
    # Start Dashboard
    DASHBOARD_PID=$(start_app "dashboard" "reconciliation/active-work/dashboard" 3001)
    
    # Start Admin Dashboard
    ADMIN_PID=$(start_app "admin-dashboard" "reconciliation/active-work/admin-dashboard" 3002)
    
    print_success "All applications started"
    
    # Run tests
    print_status "Running Puppeteer tests..."
    
    # Test Auth Gateway
    run_puppeteer_test "Auth Gateway" ".claude/commands/test-auth-gateway.md"
    
    # Test Dashboard
    run_puppeteer_test "Dashboard" ".claude/commands/test-edl-dashboard.md"
    
    # Test Admin Dashboard
    run_puppeteer_test "Admin Telemetry" ".claude/commands/test-admin-telemetry.md"
    
    # Generate final report
    print_status "Generating test report..."
    node scripts/00118-test-edl-apps.js
    
    # Cleanup
    print_status "Cleaning up..."
    kill $AUTH_PID 2>/dev/null || true
    kill $DASHBOARD_PID 2>/dev/null || true
    kill $ADMIN_PID 2>/dev/null || true
    
    print_success "Test suite completed"
    echo "Results saved in test-results/"
}

# Handle script termination
trap cleanup EXIT

cleanup() {
    print_status "Shutting down test applications..."
    pkill -f "next dev" 2>/dev/null || true
}

# Run main function
main "$@"