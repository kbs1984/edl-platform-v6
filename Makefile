# Personal Operating System - Automation Commands
# Run 'make help' for available commands

.PHONY: help check health audit gaps status autofix start-session end-session

# Default target
help:
	@echo "Personal Operating System - Automation Commands"
	@echo ""
	@echo "System Health:"
	@echo "  make check      - Full system health check"
	@echo "  make health     - Reality domain health score"
	@echo "  make audit      - Constitution compliance audit"
	@echo "  make gaps       - Gap detection scan"
	@echo "  make status     - Current system status"
	@echo "  make autofix    - Auto-fix safe issues"
	@echo ""
	@echo "Session Management:"
	@echo "  make start-session SESSION=00002  - Start new session"
	@echo "  make end-session SESSION=00001    - End current session"
	@echo ""
	@echo "Quick Commands:"
	@echo "  make enforce    - Constitution enforcement"
	@echo "  make discover   - Reality discovery"
	@echo "  make prioritize - Prioritize gaps"
	@echo ""

# System health commands
check:
	@python3 shared/tools/system-guardian.py check CLI

health:
	@python3 shared/tools/auditing/reality-auditor.py health

audit:
	@python3 shared/tools/enforcement/constitution-enforcer.py audit CLI

gaps:
	@python3 shared/tools/monitoring/gap-detector.py scan CLI

status:
	@shared/tools/session-guardian.sh status

autofix:
	@python3 shared/tools/system-guardian.py autofix CLI

# Session management
start-session:
	@if [ -z "$(SESSION)" ]; then \
		echo "Usage: make start-session SESSION=00002"; \
		exit 1; \
	fi
	@shared/tools/session-guardian.sh start $(SESSION)

end-session:
	@if [ -z "$(SESSION)" ]; then \
		echo "Usage: make end-session SESSION=00001"; \
		exit 1; \
	fi
	@shared/tools/session-guardian.sh end $(SESSION)

# Session tracking commands (Constitutional requirement as of v1.2.0)
track-init:
	@if [ -z "$(SESSION)" ]; then \
		echo "Usage: make track-init SESSION=00003"; \
		exit 1; \
	fi
	@python3 shared/tools/session-tracker.py init --session $(SESSION)
	@echo "✅ Session $(SESSION) tracking initialized"

track-log:
	@if [ -z "$(SESSION)" ] || [ -z "$(MSG)" ]; then \
		echo "Usage: make track-log SESSION=00003 MSG='Implementation complete' CATEGORY=implementation"; \
		exit 1; \
	fi
	@python3 shared/tools/session-tracker.py log --session $(SESSION) --message "$(MSG)" --category $${CATEGORY:-general}

track-decision:
	@if [ -z "$(SESSION)" ] || [ -z "$(MSG)" ]; then \
		echo "Usage: make track-decision SESSION=00003 MSG='Use SHA-256' RATIONALE='Security balance'"; \
		exit 1; \
	fi
	@python3 shared/tools/session-tracker.py decision --session $(SESSION) --message "$(MSG)" --rationale "$${RATIONALE:-Not specified}"

track-summary:
	@if [ -z "$(SESSION)" ]; then \
		echo "Usage: make track-summary SESSION=00003"; \
		exit 1; \
	fi
	@python3 shared/tools/session-tracker.py summary --session $(SESSION)

track-end:
	@if [ -z "$(SESSION)" ]; then \
		echo "Usage: make track-end SESSION=00003"; \
		exit 1; \
	fi
	@python3 shared/tools/session-tracker.py end --session $(SESSION)
	@echo "✅ Session $(SESSION) tracking complete"

# Convenience: Start new session with tracking
new-session:
	@read -p "Enter session number (e.g., 00003): " SESSION; \
	python3 shared/tools/session-tracker.py init --session $$SESSION; \
	echo "export CURRENT_SESSION=$$SESSION" > .session.env; \
	echo "✅ Session $$SESSION started. Run: source .session.env"

# Quick commands
enforce:
	@python3 shared/tools/enforcement/constitution-enforcer.py validate

discover:
	@python3 shared/tools/auditing/reality-auditor.py discover

prioritize:
	@python3 shared/tools/monitoring/gap-detector.py prioritize

# Development commands
install-hooks:
	@echo "Installing git hooks..."
	@mkdir -p .git/hooks
	@cp shared/tools/enforcement/pre-commit-hook.sh .git/hooks/pre-commit
	@chmod +x .git/hooks/pre-commit
	@echo "Git hooks installed"

validate-structure:
	@python3 shared/tools/enforcement/constitution-enforcer.py validate

test-automation:
	@echo "Testing automation systems..."
	@make audit
	@make health
	@make gaps
	@make check
	@echo "All automation tests completed"

# Documentation
docs:
	@echo "Generating documentation index..."
	@echo "📖 Personal Operating System Documentation" > DOCS-INDEX.md
	@echo "" >> DOCS-INDEX.md
	@echo "## Foundation Documents" >> DOCS-INDEX.md
	@echo "- [Directory Map Constitution](DIRECTORY-MAP-CONSTITUTION.md)" >> DOCS-INDEX.md
	@echo "- [System Index](SYSTEM-INDEX.md)" >> DOCS-INDEX.md
	@echo "- [Session Protocol](SESSION-PROTOCOL.md)" >> DOCS-INDEX.md
	@echo "" >> DOCS-INDEX.md
	@echo "## Domain Documentation" >> DOCS-INDEX.md
	@echo "- [Requirements Purpose](requirements/PURPOSE.md)" >> DOCS-INDEX.md
	@echo "- [Reality Purpose](reality/PURPOSE.md)" >> DOCS-INDEX.md
	@echo "- [Reconciliation Purpose](reconciliation/PURPOSE.md)" >> DOCS-INDEX.md
	@echo "" >> DOCS-INDEX.md
	@echo "## Automation Tools" >> DOCS-INDEX.md
	@echo "- Constitution Enforcer: shared/tools/enforcement/constitution-enforcer.py" >> DOCS-INDEX.md
	@echo "- Reality Auditor: shared/tools/auditing/reality-auditor.py" >> DOCS-INDEX.md
	@echo "- Gap Detector: shared/tools/monitoring/gap-detector.py" >> DOCS-INDEX.md
	@echo "- System Guardian: shared/tools/system-guardian.py" >> DOCS-INDEX.md
	@echo "- Session Guardian: shared/tools/session-guardian.sh" >> DOCS-INDEX.md
	@echo "" >> DOCS-INDEX.md
	@echo "*Generated: $$(date)*" >> DOCS-INDEX.md
	@echo "Documentation index generated: DOCS-INDEX.md"

# Maintenance
clean:
	@echo "Cleaning temporary files..."
	@find . -name "*.pyc" -delete
	@find . -name "__pycache__" -delete
	@echo "Clean completed"

backup:
	@echo "Creating system backup..."
	@timestamp=$$(date +%Y%m%d_%H%M%S); \
	tar -czf "../edl-platform-v6-backup-$$timestamp.tar.gz" \
		--exclude='.git' \
		--exclude='__pycache__' \
		--exclude='*.pyc' \
		.
	@echo "Backup created in parent directory"