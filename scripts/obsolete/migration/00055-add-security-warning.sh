#!/bin/bash
# Security Warning Addition for Session Startup
# Created: Session 00045 (Prevention Protocol)
# Purpose: Add security warning to session startup when truth-seed database detected

# Function to display database security warning
show_database_security_warning() {
    echo ""
    echo "🔒═══════════════════════════════════════════════════════════🔒"
    echo "║                    SECURITY WARNING                        ║"
    echo "║             Working with SECURED Database                  ║"
    echo "🔒═══════════════════════════════════════════════════════════🔒"
    echo ""
    echo "⚠️  You're working with the emdash/truth-seed database"
    echo "    This database has ENTERPRISE-GRADE security (RLS enabled)"
    echo ""
    echo "📋 EXPECTED 'ERRORS' (These are actually SUCCESS!):"
    echo "    ❌ student: PGRST205 'Could not find table'"
    echo "    ❌ profile: PGRST205 'Could not find table'"
    echo "    → This means RLS is protecting data correctly!"
    echo ""
    echo "✅ BEFORE starting database work, read:"
    echo "    • reconciliation/PRE-SESSION-CHECKLIST.md"
    echo "    • TRUTH-SEED-ADOPTION-DECISION.md (RLS warning section)"
    echo "    • CLAUDE.md (Database Verification Protocol)"
    echo ""
    echo "🧪 TEST CORRECTLY with:"
    echo "    • scripts/00055-test-database-access.sh"
    echo "    • Use authenticated clients, not anonymous"
    echo "    • PGRST205 = security success, not failure!"
    echo ""
    echo "❌ DON'T PANIC when you see PGRST205 errors!"
    echo "✅ DO celebrate - it means your database is secure!"
    echo ""
    echo "🔒═══════════════════════════════════════════════════════════🔒"
    echo ""
}

# Check if this is a database-related session
check_database_work() {
    # Look for indicators this session will involve database work
    if [ -d "truth-seed/" ] || [ -f "TRUTH-SEED-ADOPTION-DECISION.md" ] || 
       [ -d "reconciliation/active-work/" ] || grep -q "database\|supabase\|RLS" <<< "$SESSION_FOCUS" 2>/dev/null; then
        return 0  # Database work detected
    fi
    return 1  # No database work detected
}

# Main execution
if [ "$1" = "--check-and-warn" ]; then
    # Called by session startup script
    SESSION_FOCUS="$2"
    
    if check_database_work; then
        show_database_security_warning
        
        # Optional: Require acknowledgment for critical database sessions
        if [[ "$SESSION_FOCUS" =~ (database|migration|schema|RLS|auth) ]]; then
            echo "⚠️  This appears to be critical database work."
            echo "    Type 'I understand RLS security' to continue:"
            read -r acknowledgment
            
            if [[ "$acknowledgment" != "I understand RLS security" ]]; then
                echo ""
                echo "❌ Please read the security documentation before proceeding."
                echo "   Exiting for your protection."
                exit 1
            fi
            
            echo "✅ Acknowledgment received. Proceeding with session..."
            echo ""
        fi
    fi
elif [ "$1" = "--force-show" ]; then
    # Force show warning for testing
    show_database_security_warning
else
    echo "Usage: $0 [--check-and-warn SESSION_FOCUS] [--force-show]"
    echo ""
    echo "This script is called by session startup to show security warnings"
    echo "when database work is detected."
fi