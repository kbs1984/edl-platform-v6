#!/usr/bin/env python3
"""
Update progress matrix for Session 156 P0 features
Requires SUPABASE_SERVICE_KEY environment variable
"""

import os
import sys
from datetime import datetime
from supabase import create_client

def update_progress_matrix():
    """Update P0 features status based on Session 156 verification"""
    
    # Configuration
    url = 'https://bbrheacetxlnqbibjwsz.supabase.co'
    service_key = os.environ.get('SUPABASE_SERVICE_KEY')
    
    if not service_key:
        print("❌ Error: SUPABASE_SERVICE_KEY environment variable not set")
        print("\nTo use this script:")
        print("export SUPABASE_SERVICE_KEY='your-service-key'")
        print("python3 scripts/00156-update-progress-matrix.py")
        return False
    
    try:
        # Create client with service key (bypasses RLS)
        client = create_client(url, service_key)
        
        # Features to mark as implemented
        implemented_features = [
            'Student Onboarding Flow',
            'Profile Creation Wizard', 
            'Team Creation',
            'Profile Customization',
            'Guardian Dashboard'
        ]
        
        # Features to mark as validated (were already implemented)
        validated_features = [
            'EmCoin Display',
            'Visitor Tracking'
        ]
        
        print("📊 Updating Progress Matrix for Session 156\n")
        
        # Update implemented features
        for feature in implemented_features:
            result = client.table('platform_progress_matrix').update({
                'status': 'implemented',
                'implementation_session': 156,
                'last_updated': datetime.now().isoformat()
            }).eq('feature_name', feature).eq('priority', 'P0').execute()
            
            if result.data:
                print(f"✅ {feature}: → implemented")
            else:
                print(f"⚠️  {feature}: not found or already updated")
        
        # Update validated features
        for feature in validated_features:
            result = client.table('platform_progress_matrix').update({
                'status': 'validated',
                'validation_session': 156,
                'last_updated': datetime.now().isoformat()
            }).eq('feature_name', feature).eq('priority', 'P0').execute()
            
            if result.data:
                print(f"✅ {feature}: → validated")
            else:
                print(f"⚠️  {feature}: not found or already updated")
        
        # Get summary
        summary = client.table('platform_progress_matrix').select(
            'priority, status'
        ).eq('priority', 'P0').execute()
        
        if summary.data:
            status_counts = {}
            for row in summary.data:
                status = row['status']
                status_counts[status] = status_counts.get(status, 0) + 1
            
            print("\n📊 P0 Status Summary:")
            for status, count in sorted(status_counts.items()):
                print(f"   {status}: {count}")
        
        print("\n✅ Progress matrix updated successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error updating progress matrix: {str(e)}")
        return False

if __name__ == "__main__":
    success = update_progress_matrix()
    sys.exit(0 if success else 1)