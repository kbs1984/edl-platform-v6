#!/usr/bin/env python3
"""
Session Attribution System
Tracks WHO did WHAT and WHEN with automatic file headers and git integration

Session 00009 Implementation
"""

import json
import os
import sys
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
import argparse


class SessionAttribution:
    """Track WHO did WHAT and WHEN across all project files"""
    
    def __init__(self, project_root: Optional[Path] = None):
        self.name = "Session Attribution System"
        self.version = "1.0.0"
        
        # Set project root
        if project_root:
            self.project_root = Path(project_root)
        else:
            self.project_root = Path.cwd()
        
        # Attribution storage
        self.attribution_db = self.project_root / ".attribution" / "attribution.json"
        self.attribution_db.parent.mkdir(exist_ok=True)
        
        # Current task tracking
        self.current_task_file = self.project_root / ".attribution" / "current_task.json"
        
        # Load existing attributions
        self.attributions = self._load_attributions()
        
        # File type configurations
        self.header_configs = {
            ".py": {
                "comment_style": "#",
                "header_template": self._python_header_template,
                "detect_existing": lambda content: "# Attribution:" in content
            },
            ".js": {
                "comment_style": "//",
                "header_template": self._js_header_template,
                "detect_existing": lambda content: "// Attribution:" in content
            },
            ".ts": {
                "comment_style": "//",
                "header_template": self._js_header_template,
                "detect_existing": lambda content: "// Attribution:" in content
            },
            ".md": {
                "comment_style": "yaml",
                "header_template": self._markdown_header_template,
                "detect_existing": lambda content: "attribution:" in content[:500]
            },
            ".sql": {
                "comment_style": "--",
                "header_template": self._sql_header_template,
                "detect_existing": lambda content: "-- Attribution:" in content
            },
            ".html": {
                "comment_style": "<!--",
                "header_template": self._html_header_template,
                "detect_existing": lambda content: "<!-- Attribution:" in content
            }
        }
    
    def _load_attributions(self) -> Dict[str, Any]:
        """Load existing attribution data"""
        if self.attribution_db.exists():
            try:
                with open(self.attribution_db, 'r') as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError):
                print(f"⚠️ Warning: Could not load {self.attribution_db}, starting fresh")
        
        return {}
    
    def _save_attributions(self):
        """Persist attribution data"""
        with open(self.attribution_db, 'w') as f:
            json.dump(self.attributions, f, indent=2, default=str)
    
    def set_current_task(self, task_id: str, description: str, session_id: str):
        """Set the current task context"""
        task_info = {
            "task_id": task_id,
            "description": description,
            "session_id": session_id,
            "started_at": datetime.utcnow().isoformat()
        }
        
        with open(self.current_task_file, 'w') as f:
            json.dump(task_info, f, indent=2)
    
    def get_current_task(self) -> Dict[str, Any]:
        """Get current task context"""
        if self.current_task_file.exists():
            try:
                with open(self.current_task_file, 'r') as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError):
                pass
        
        return {
            "task_id": "unknown",
            "description": "No task context set",
            "session_id": "unknown"
        }
    
    def attribute_file(self, file_path: Path, session_id: str, 
                      action: str = "created", intent: str = "",
                      force_header: bool = False) -> Dict[str, Any]:
        """Add attribution to a file and track in database"""
        
        file_path = Path(file_path).resolve()
        relative_path = str(file_path.relative_to(self.project_root))
        
        # Get current task context
        current_task = self.get_current_task()
        
        # Update database first
        result = self._update_attribution_db(relative_path, session_id, action, intent, current_task)
        
        # Add header to file if appropriate
        if file_path.exists() and file_path.suffix in self.header_configs:
            header_result = self._add_attribution_header(file_path, session_id, action, intent, current_task, force_header)
            result.update(header_result)
        
        self._save_attributions()
        
        return result
    
    def _update_attribution_db(self, relative_path: str, session_id: str, 
                              action: str, intent: str, current_task: Dict) -> Dict[str, Any]:
        """Update the attribution database"""
        
        now = datetime.utcnow().isoformat()
        
        if relative_path not in self.attributions:
            # New file
            self.attributions[relative_path] = {
                "created_by": session_id,
                "created_at": now,
                "modified_by": [session_id],
                "modified_at": [now],
                "actions": []
            }
        else:
            # Existing file
            if session_id not in self.attributions[relative_path].get("modified_by", []):
                self.attributions[relative_path]["modified_by"].append(session_id)
            self.attributions[relative_path]["modified_at"].append(now)
        
        # Add action record
        action_record = {
            "session": session_id,
            "action": action,
            "timestamp": now,
            "intent": intent,
            "task_id": current_task.get("task_id", "unknown"),
            "task_description": current_task.get("description", "")
        }
        
        self.attributions[relative_path]["actions"].append(action_record)
        
        return {
            "database_updated": True,
            "action_recorded": action_record,
            "total_actions": len(self.attributions[relative_path]["actions"])
        }
    
    def _add_attribution_header(self, file_path: Path, session_id: str, 
                               action: str, intent: str, current_task: Dict,
                               force_header: bool = False) -> Dict[str, Any]:
        """Add attribution header to file"""
        
        suffix = file_path.suffix.lower()
        if suffix not in self.header_configs:
            return {"header_added": False, "reason": f"Unsupported file type: {suffix}"}
        
        config = self.header_configs[suffix]
        
        try:
            # Read existing content
            content = file_path.read_text(encoding='utf-8')
            
            # Check if header already exists
            if not force_header and config["detect_existing"](content):
                return {"header_added": False, "reason": "Attribution header already exists"}
            
            # Generate header
            header = config["header_template"](session_id, action, intent, current_task)
            
            # Add header to content
            new_content = header + "\n" + content
            
            # Write back to file
            file_path.write_text(new_content, encoding='utf-8')
            
            return {
                "header_added": True,
                "header_type": suffix,
                "header_length": len(header.split('\n'))
            }
            
        except (IOError, UnicodeDecodeError) as e:
            return {"header_added": False, "reason": f"Error processing file: {e}"}
    
    def _python_header_template(self, session_id: str, action: str, intent: str, current_task: Dict) -> str:
        """Generate Python file header"""
        task_id = current_task.get("task_id", "unknown")
        task_desc = current_task.get("description", "No task context")
        
        return f"""# Attribution: {action} by Session {session_id} on {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC
# Intent: {intent}
# Task: {task_id} - {task_desc}
# Session: {session_id}"""
    
    def _js_header_template(self, session_id: str, action: str, intent: str, current_task: Dict) -> str:
        """Generate JavaScript/TypeScript file header"""
        task_id = current_task.get("task_id", "unknown")
        task_desc = current_task.get("description", "No task context")
        
        return f"""// Attribution: {action} by Session {session_id} on {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC
// Intent: {intent}
// Task: {task_id} - {task_desc}
// Session: {session_id}"""
    
    def _markdown_header_template(self, session_id: str, action: str, intent: str, current_task: Dict) -> str:
        """Generate Markdown file header"""
        task_id = current_task.get("task_id", "unknown")
        task_desc = current_task.get("description", "No task context")
        
        return f"""---
attribution:
  {action}_by: Session {session_id}
  {action}_at: {datetime.utcnow().isoformat()}
  intent: "{intent}"
  task_id: {task_id}
  task_description: "{task_desc}"
  session: {session_id}
---"""
    
    def _sql_header_template(self, session_id: str, action: str, intent: str, current_task: Dict) -> str:
        """Generate SQL file header"""
        task_id = current_task.get("task_id", "unknown")
        task_desc = current_task.get("description", "No task context")
        
        return f"""-- Attribution: {action} by Session {session_id} on {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC
-- Intent: {intent}
-- Task: {task_id} - {task_desc}
-- Session: {session_id}"""
    
    def _html_header_template(self, session_id: str, action: str, intent: str, current_task: Dict) -> str:
        """Generate HTML file header"""
        task_id = current_task.get("task_id", "unknown")
        task_desc = current_task.get("description", "No task context")
        
        return f"""<!-- Attribution: {action} by Session {session_id} on {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC
     Intent: {intent}
     Task: {task_id} - {task_desc}
     Session: {session_id} -->"""
    
    def attribute_directory(self, directory_path: Path, session_id: str, 
                           patterns: List[str] = None, intent: str = "",
                           exclude_patterns: List[str] = None) -> Dict[str, Any]:
        """Recursively attribute files in a directory"""
        
        if patterns is None:
            patterns = ["*.py", "*.js", "*.ts", "*.md", "*.sql", "*.html"]
        
        if exclude_patterns is None:
            exclude_patterns = ["*/__pycache__/*", "*/.git/*", "*/.cache/*", "*/node_modules/*"]
        
        directory_path = Path(directory_path)
        attributed_files = []
        skipped_files = []
        errors = []
        
        for pattern in patterns:
            for file_path in directory_path.rglob(pattern):
                # Check exclude patterns
                relative_path = str(file_path.relative_to(self.project_root))
                
                skip = False
                for exclude in exclude_patterns:
                    if Path(relative_path).match(exclude):
                        skip = True
                        break
                
                if skip:
                    skipped_files.append(relative_path)
                    continue
                
                try:
                    result = self.attribute_file(file_path, session_id, "modified", intent)
                    attributed_files.append({
                        "file": relative_path,
                        "result": result
                    })
                except Exception as e:
                    errors.append({
                        "file": relative_path,
                        "error": str(e)
                    })
        
        return {
            "attributed_files": len(attributed_files),
            "skipped_files": len(skipped_files),
            "errors": len(errors),
            "details": {
                "attributed": attributed_files,
                "skipped": skipped_files,
                "errors": errors
            }
        }
    
    def generate_ownership_report(self) -> Dict[str, Any]:
        """Generate comprehensive ownership report"""
        
        if not self.attributions:
            return {
                "total_files": 0,
                "sessions": {},
                "summary": "No attributed files found"
            }
        
        sessions = {}
        file_types = {}
        recent_activity = []
        
        for file_path, attrs in self.attributions.items():
            creator = attrs.get("created_by", "unknown")
            
            # Initialize session tracking
            if creator not in sessions:
                sessions[creator] = {
                    "created": [],
                    "modified": [],
                    "total_actions": 0,
                    "first_activity": None,
                    "last_activity": None
                }
            
            sessions[creator]["created"].append(file_path)
            sessions[creator]["total_actions"] += len(attrs.get("actions", []))
            
            # Track file types
            suffix = Path(file_path).suffix
            if suffix not in file_types:
                file_types[suffix] = {"count": 0, "sessions": set()}
            file_types[suffix]["count"] += 1
            file_types[suffix]["sessions"].add(creator)
            
            # Track modifiers
            for session in attrs.get("modified_by", []):
                if session != creator:
                    if session not in sessions:
                        sessions[session] = {
                            "created": [],
                            "modified": [],
                            "total_actions": 0,
                            "first_activity": None,
                            "last_activity": None
                        }
                    sessions[session]["modified"].append(file_path)
            
            # Track activity dates
            for action in attrs.get("actions", []):
                timestamp = action.get("timestamp")
                session_id = action.get("session")
                
                if timestamp and session_id in sessions:
                    if not sessions[session_id]["first_activity"] or timestamp < sessions[session_id]["first_activity"]:
                        sessions[session_id]["first_activity"] = timestamp
                    if not sessions[session_id]["last_activity"] or timestamp > sessions[session_id]["last_activity"]:
                        sessions[session_id]["last_activity"] = timestamp
                    
                    recent_activity.append({
                        "session": session_id,
                        "file": file_path,
                        "action": action.get("action"),
                        "timestamp": timestamp,
                        "task": action.get("task_id")
                    })
        
        # Sort recent activity
        recent_activity.sort(key=lambda x: x["timestamp"], reverse=True)
        
        # Convert sets to lists for JSON serialization
        for ft in file_types.values():
            ft["sessions"] = list(ft["sessions"])
        
        return {
            "total_files": len(self.attributions),
            "sessions": sessions,
            "file_types": file_types,
            "recent_activity": recent_activity[:20],  # Last 20 activities
            "summary": f"{len(self.attributions)} files tracked across {len(sessions)} sessions"
        }
    
    def commit_attributions(self, session_id: str, message: Optional[str] = None) -> Dict[str, Any]:
        """Commit attribution changes to git"""
        
        if message is None:
            message = f"Session {session_id}: Add attribution headers and tracking"
        
        try:
            # Check if we're in a git repository
            result = subprocess.run(
                ["git", "rev-parse", "--git-dir"],
                cwd=self.project_root,
                capture_output=True,
                text=True
            )
            
            if result.returncode != 0:
                return {"committed": False, "reason": "Not a git repository"}
            
            # Stage attribution files
            attribution_files = [
                str(self.attribution_db.relative_to(self.project_root)),
                str(self.current_task_file.relative_to(self.project_root))
            ]
            
            for file_path in attribution_files:
                if Path(self.project_root / file_path).exists():
                    subprocess.run(
                        ["git", "add", file_path],
                        cwd=self.project_root,
                        check=True
                    )
            
            # Stage any files with new attribution headers
            # (This would require tracking which files were modified)
            
            # Commit changes
            commit_result = subprocess.run(
                ["git", "commit", "-m", message],
                cwd=self.project_root,
                capture_output=True,
                text=True
            )
            
            if commit_result.returncode == 0:
                return {
                    "committed": True,
                    "commit_hash": self._get_latest_commit_hash(),
                    "message": message,
                    "files_committed": attribution_files
                }
            else:
                return {
                    "committed": False,
                    "reason": commit_result.stderr or "Git commit failed"
                }
                
        except subprocess.CalledProcessError as e:
            return {"committed": False, "reason": f"Git command failed: {e}"}
        except Exception as e:
            return {"committed": False, "reason": f"Unexpected error: {e}"}
    
    def _get_latest_commit_hash(self) -> str:
        """Get the latest commit hash"""
        try:
            result = subprocess.run(
                ["git", "rev-parse", "HEAD"],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout.strip()
        except:
            return "unknown"
    
    def find_unattributed_files(self, patterns: List[str] = None) -> List[str]:
        """Find files that haven't been attributed yet"""
        
        if patterns is None:
            patterns = ["*.py", "*.js", "*.ts", "*.md", "*.sql", "*.html"]
        
        all_files = set()
        for pattern in patterns:
            for file_path in self.project_root.rglob(pattern):
                relative_path = str(file_path.relative_to(self.project_root))
                all_files.add(relative_path)
        
        attributed_files = set(self.attributions.keys())
        unattributed = all_files - attributed_files
        
        return sorted(list(unattributed))
    
    def get_file_history(self, file_path: str) -> Dict[str, Any]:
        """Get complete history for a specific file"""
        
        if file_path not in self.attributions:
            return {"error": f"File {file_path} not found in attribution database"}
        
        attrs = self.attributions[file_path]
        
        return {
            "file_path": file_path,
            "created_by": attrs.get("created_by"),
            "created_at": attrs.get("created_at"),
            "modified_by": attrs.get("modified_by", []),
            "total_modifications": len(attrs.get("modified_at", [])),
            "total_actions": len(attrs.get("actions", [])),
            "actions": attrs.get("actions", []),
            "current_status": self._analyze_file_status(file_path)
        }
    
    def _analyze_file_status(self, file_path: str) -> Dict[str, Any]:
        """Analyze current status of a file"""
        full_path = self.project_root / file_path
        
        if not full_path.exists():
            return {"status": "deleted", "size": 0, "last_modified": None}
        
        stat = full_path.stat()
        
        return {
            "status": "exists",
            "size": stat.st_size,
            "last_modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            "has_attribution_header": self._check_for_header(full_path)
        }
    
    def _check_for_header(self, file_path: Path) -> bool:
        """Check if file has attribution header"""
        suffix = file_path.suffix.lower()
        if suffix not in self.header_configs:
            return False
        
        try:
            content = file_path.read_text(encoding='utf-8')
            return self.header_configs[suffix]["detect_existing"](content)
        except:
            return False


def main():
    """Command line interface"""
    parser = argparse.ArgumentParser(description='Session Attribution System')
    parser.add_argument('--session', required=True, help='Session ID (e.g., 00009)')
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Set task command
    task_parser = subparsers.add_parser('set-task', help='Set current task context')
    task_parser.add_argument('--task-id', required=True, help='Task ID')
    task_parser.add_argument('--description', required=True, help='Task description')
    
    # Attribute file command
    file_parser = subparsers.add_parser('attribute', help='Attribute a file')
    file_parser.add_argument('--file', required=True, help='File path to attribute')
    file_parser.add_argument('--action', default='modified', help='Action type (created/modified)')
    file_parser.add_argument('--intent', default='', help='Intent/reason for change')
    file_parser.add_argument('--force-header', action='store_true', help='Force header even if exists')
    
    # Attribute directory command
    dir_parser = subparsers.add_parser('attribute-dir', help='Attribute directory recursively')
    dir_parser.add_argument('--directory', required=True, help='Directory path')
    dir_parser.add_argument('--intent', default='', help='Intent/reason for changes')
    dir_parser.add_argument('--patterns', nargs='*', help='File patterns to include')
    
    # Report command
    subparsers.add_parser('report', help='Generate ownership report')
    
    # Find unattributed command
    subparsers.add_parser('unattributed', help='Find unattributed files')
    
    # Commit command
    commit_parser = subparsers.add_parser('commit', help='Commit attribution changes')
    commit_parser.add_argument('--message', help='Commit message')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Initialize attribution system
    attribution = SessionAttribution()
    
    if args.command == 'set-task':
        attribution.set_current_task(args.task_id, args.description, args.session)
        print(f"✅ Set current task: {args.task_id}")
        
    elif args.command == 'attribute':
        result = attribution.attribute_file(
            Path(args.file), 
            args.session, 
            args.action, 
            args.intent,
            args.force_header
        )
        print(f"✅ Attributed {args.file}")
        print(f"   Actions recorded: {result.get('total_actions', 0)}")
        if result.get('header_added'):
            print(f"   Header added: {result.get('header_type', 'unknown')} style")
        
    elif args.command == 'attribute-dir':
        patterns = args.patterns if args.patterns else None
        result = attribution.attribute_directory(
            Path(args.directory),
            args.session,
            patterns,
            args.intent
        )
        print(f"✅ Directory attribution complete")
        print(f"   Files attributed: {result['attributed_files']}")
        print(f"   Files skipped: {result['skipped_files']}")
        print(f"   Errors: {result['errors']}")
        
    elif args.command == 'report':
        report = attribution.generate_ownership_report()
        print(f"📊 Ownership Report")
        print(f"   {report['summary']}")
        print(f"\n   Sessions:")
        for session_id, info in report['sessions'].items():
            print(f"   - {session_id}: {len(info['created'])} created, {len(info['modified'])} modified")
        
    elif args.command == 'unattributed':
        unattributed = attribution.find_unattributed_files()
        print(f"📝 Unattributed Files: {len(unattributed)}")
        for file_path in unattributed[:10]:  # Show first 10
            print(f"   - {file_path}")
        if len(unattributed) > 10:
            print(f"   ... and {len(unattributed) - 10} more")
            
    elif args.command == 'commit':
        result = attribution.commit_attributions(args.session, args.message)
        if result['committed']:
            print(f"✅ Attribution changes committed")
            print(f"   Commit: {result.get('commit_hash', 'unknown')[:8]}")
        else:
            print(f"❌ Commit failed: {result['reason']}")


if __name__ == "__main__":
    main()