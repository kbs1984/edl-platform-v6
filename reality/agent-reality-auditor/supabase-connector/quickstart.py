#!/usr/bin/env python3
"""
Supabase Reality Agent - Quickstart
Minimal viable reality check to validate approach
"""

import subprocess
import json
import os
import sys
from datetime import datetime
from pathlib import Path

class QuickRealityCheck:
    """Minimal Supabase reality checker"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent.parent.parent.parent
        self.results = {
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "agent": "supabase-reality-quickstart",
                "check_type": "connection_test"
            },
            "tests": {}
        }
    
    def test_cli_availability(self):
        """Test if Supabase CLI is available"""
        try:
            result = subprocess.run(
                ['supabase', '--version'],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if result.returncode == 0:
                version = result.stdout.strip()
                self.results["tests"]["cli_available"] = {
                    "status": "pass",
                    "version": version
                }
                print(f"✅ Supabase CLI available: {version}")
                return True
            else:
                self.results["tests"]["cli_available"] = {
                    "status": "fail",
                    "error": "CLI not responding correctly"
                }
                print("❌ Supabase CLI not responding")
                return False
                
        except FileNotFoundError:
            self.results["tests"]["cli_available"] = {
                "status": "fail",
                "error": "Supabase CLI not found in PATH"
            }
            print("❌ Supabase CLI not found")
            return False
        except Exception as e:
            self.results["tests"]["cli_available"] = {
                "status": "error",
                "error": str(e)
            }
            print(f"❌ Error testing CLI: {e}")
            return False
    
    def test_credentials_available(self):
        """Test if we have any credentials configured"""
        # Check environment variables
        env_vars = {
            "SUPABASE_URL": os.getenv("SUPABASE_URL"),
            "SUPABASE_ANON_KEY": os.getenv("SUPABASE_ANON_KEY"),
            "SUPABASE_SERVICE_KEY": os.getenv("SUPABASE_SERVICE_KEY")
        }
        
        found_vars = {k: bool(v) for k, v in env_vars.items()}
        
        if found_vars["SUPABASE_URL"] and found_vars["SUPABASE_ANON_KEY"]:
            self.results["tests"]["credentials"] = {
                "status": "pass",
                "found": found_vars,
                "usable": True
            }
            print("✅ Credentials found in environment")
            return True
        else:
            self.results["tests"]["credentials"] = {
                "status": "partial",
                "found": found_vars,
                "usable": False,
                "note": "Need SUPABASE_URL and SUPABASE_ANON_KEY at minimum"
            }
            print("⚠️  Credentials not found in environment")
            print("   Set SUPABASE_URL and SUPABASE_ANON_KEY to continue")
            return False
    
    def test_python_subprocess(self):
        """Test Python's ability to run subprocess commands"""
        try:
            result = subprocess.run(
                ['echo', 'test'],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if result.returncode == 0 and result.stdout.strip() == "test":
                self.results["tests"]["subprocess"] = {
                    "status": "pass"
                }
                print("✅ Python subprocess working")
                return True
            else:
                self.results["tests"]["subprocess"] = {
                    "status": "fail",
                    "error": "Unexpected subprocess behavior"
                }
                print("❌ Python subprocess issues")
                return False
                
        except Exception as e:
            self.results["tests"]["subprocess"] = {
                "status": "error",
                "error": str(e)
            }
            print(f"❌ Subprocess error: {e}")
            return False
    
    def test_cache_directory(self):
        """Test if we can create cache directory"""
        cache_dir = self.project_root / "reality" / "agent-reality-auditor" / ".cache"
        
        try:
            cache_dir.mkdir(parents=True, exist_ok=True)
            
            # Test write
            test_file = cache_dir / "test.json"
            test_file.write_text(json.dumps({"test": "data"}))
            
            # Test read
            data = json.loads(test_file.read_text())
            
            # Clean up
            test_file.unlink()
            
            self.results["tests"]["cache_directory"] = {
                "status": "pass",
                "path": str(cache_dir)
            }
            print(f"✅ Cache directory ready: {cache_dir}")
            return True
            
        except Exception as e:
            self.results["tests"]["cache_directory"] = {
                "status": "fail",
                "error": str(e)
            }
            print(f"❌ Cache directory error: {e}")
            return False
    
    def test_basic_connection(self):
        """Test basic Supabase connection if credentials available"""
        if not (self.results["tests"].get("credentials", {}).get("usable")):
            self.results["tests"]["connection"] = {
                "status": "skipped",
                "reason": "No credentials available"
            }
            print("⏭️  Skipping connection test (no credentials)")
            return False
        
        try:
            # Try a simple API call using curl (most universal)
            url = os.getenv("SUPABASE_URL")
            key = os.getenv("SUPABASE_ANON_KEY")
            
            # Test the API health endpoint
            result = subprocess.run(
                [
                    'curl', '-s', '-o', '/dev/null', '-w', '%{http_code}',
                    f'{url}/rest/v1/',
                    '-H', f'apikey: {key}',
                    '-H', 'Content-Type: application/json'
                ],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            http_code = result.stdout.strip()
            
            if http_code in ['200', '201', '204', '401', '403']:
                # Even auth errors mean we connected
                self.results["tests"]["connection"] = {
                    "status": "pass",
                    "http_code": http_code,
                    "can_connect": True
                }
                print(f"✅ Can connect to Supabase (HTTP {http_code})")
                return True
            else:
                self.results["tests"]["connection"] = {
                    "status": "fail",
                    "http_code": http_code,
                    "can_connect": False
                }
                print(f"❌ Cannot connect to Supabase (HTTP {http_code})")
                return False
                
        except Exception as e:
            self.results["tests"]["connection"] = {
                "status": "error",
                "error": str(e),
                "can_connect": False
            }
            print(f"❌ Connection error: {e}")
            return False
    
    def generate_summary(self):
        """Generate summary and recommendations"""
        all_tests = self.results["tests"]
        passed = sum(1 for t in all_tests.values() if t["status"] == "pass")
        failed = sum(1 for t in all_tests.values() if t["status"] == "fail")
        errors = sum(1 for t in all_tests.values() if t["status"] == "error")
        
        can_proceed = (
            all_tests.get("cli_available", {}).get("status") == "pass" and
            all_tests.get("subprocess", {}).get("status") == "pass" and
            all_tests.get("cache_directory", {}).get("status") == "pass"
        )
        
        self.results["summary"] = {
            "total_tests": len(all_tests),
            "passed": passed,
            "failed": failed,
            "errors": errors,
            "can_proceed": can_proceed,
            "ready_for_production": can_proceed and all_tests.get("credentials", {}).get("usable", False)
        }
        
        # Recommendations
        recommendations = []
        
        if not all_tests.get("cli_available", {}).get("status") == "pass":
            recommendations.append("Install Supabase CLI: npm install -g supabase")
        
        if not all_tests.get("credentials", {}).get("usable"):
            recommendations.append("Set environment variables: SUPABASE_URL and SUPABASE_ANON_KEY")
        
        if recommendations:
            self.results["recommendations"] = recommendations
        
        return self.results
    
    def run_all_tests(self):
        """Run all reality checks"""
        print("\n🔍 Supabase Reality Agent - Quick Start Check")
        print("=" * 50)
        
        # Run tests in order
        self.test_cli_availability()
        self.test_python_subprocess()
        self.test_cache_directory()
        self.test_credentials_available()
        self.test_basic_connection()
        
        # Generate summary
        self.generate_summary()
        
        # Print summary
        print("\n" + "=" * 50)
        print("📊 Summary:")
        summary = self.results["summary"]
        print(f"   Tests: {summary['passed']} passed, {summary['failed']} failed, {summary['errors']} errors")
        
        if summary["ready_for_production"]:
            print("   Status: ✅ READY for production use")
        elif summary["can_proceed"]:
            print("   Status: ⚠️  READY for development (add credentials for production)")
        else:
            print("   Status: ❌ NOT READY (see recommendations)")
        
        if "recommendations" in self.results:
            print("\n💡 Recommendations:")
            for rec in self.results["recommendations"]:
                print(f"   - {rec}")
        
        # Save results
        output_file = self.project_root / "reality" / "agent-reality-auditor" / "quickstart-results.json"
        output_file.parent.mkdir(parents=True, exist_ok=True)
        output_file.write_text(json.dumps(self.results, indent=2))
        print(f"\n📁 Full results saved to: {output_file}")
        
        return summary["can_proceed"]


def main():
    """Command line interface"""
    checker = QuickRealityCheck()
    can_proceed = checker.run_all_tests()
    
    # Exit code based on readiness
    sys.exit(0 if can_proceed else 1)


if __name__ == "__main__":
    main()