#!/usr/bin/env node

// Canvas Requirements Mapper
// Session 142: Maps all 11 Canvas wireframes to features for progress tracking
// Based on actual files in archive/legacy-canvas-work/

const CANVAS_REQUIREMENTS = {
  "001-1": {
    name: "Onboarding & Directory",
    file: "001-1. num.label.Onboarding&Directory.canvas",
    features: [
      {
        feature_name: "Student Onboarding Flow",
        user_story: "US-001",
        priority: "P0",
        category: "onboarding"
      },
      {
        feature_name: "Guardian Onboarding Flow",
        user_story: "US-002", 
        priority: "P0",
        category: "onboarding"
      },
      {
        feature_name: "School Directory Search",
        user_story: "US-003",
        priority: "P1",
        category: "directory"
      },
      {
        feature_name: "Profile Creation Wizard",
        user_story: "US-004",
        priority: "P0",
        category: "onboarding"
      }
    ]
  },
  
  "001-2": {
    name: "Communication, Messages and Invitations",
    file: "001-2. label.Communication, messages and Invitations.canvas",
    features: [
      {
        feature_name: "Friend Request System",
        user_story: "US-050",
        priority: "P0",
        category: "communication"
      },
      {
        feature_name: "Team Chat Interface",
        user_story: "US-051",
        priority: "P1",
        category: "communication"
      },
      {
        feature_name: "Direct Messaging",
        user_story: "US-052",
        priority: "P1",
        category: "communication"
      },
      {
        feature_name: "Guild Invitations",
        user_story: "US-053",
        priority: "P1",
        category: "communication"
      }
    ]
  },
  
  "001-3": {
    name: "Contact Us Box",
    file: "001-3. seed.Contact Us Box.canvas",
    features: [
      {
        feature_name: "Contact Form",
        user_story: "US-200",
        priority: "P2",
        category: "support"
      },
      {
        feature_name: "Support Ticket System",
        user_story: "US-201",
        priority: "P2",
        category: "support"
      }
    ]
  },
  
  "001-4": {
    name: "Activity & Registrar Box",
    file: "001-4. needlabel.Activity & Registrar Box.canvas",
    features: [
      {
        feature_name: "Activity Runtime Engine",
        user_story: "US-155",
        priority: "P0",
        category: "activities"
      },
      {
        feature_name: "Activity Registration",
        user_story: "US-170",
        priority: "P1",
        category: "activities"
      },
      {
        feature_name: "Activity Discovery",
        user_story: "US-171",
        priority: "P1",
        category: "activities"
      }
    ]
  },
  
  "001-5": {
    name: "Activity Instance",
    file: "001-5. seed.Activity Instance.canvas",
    features: [
      {
        feature_name: "Activity Session Tracking",
        user_story: "US-156",
        priority: "P0",
        category: "activities"
      },
      {
        feature_name: "Progress Persistence",
        user_story: "US-157",
        priority: "P0",
        category: "activities"
      },
      {
        feature_name: "Assignment Submission",
        user_story: "US-158",
        priority: "P0",
        category: "activities"
      },
      {
        feature_name: "Activity Auto-Save",
        user_story: "US-159",
        priority: "P0",
        category: "activities"
      }
    ]
  },

  "002-1": {
    name: "PlayerID Profile Box",
    file: "002-1. seed.PlayerID Profile Box.canvas",
    features: [
      {
        feature_name: "Player Profile Display",
        user_story: "US-080",
        priority: "P0",
        category: "profile"
      },
      {
        feature_name: "Profile Customization",
        user_story: "US-081",
        priority: "P1",
        category: "profile"
      },
      {
        feature_name: "Achievement Display",
        user_story: "US-082",
        priority: "P1",
        category: "profile"
      }
    ]
  },

  "002-2": {
    name: "Associated Teams Box",
    file: "002-2. needlabel.Associated Teams Box.canvas",
    features: [
      {
        feature_name: "Team Creation",
        user_story: "US-100",
        priority: "P0",
        category: "teams"
      },
      {
        feature_name: "Team Management",
        user_story: "US-101",
        priority: "P0",
        category: "teams"
      },
      {
        feature_name: "Team Member Roles",
        user_story: "US-102",
        priority: "P1",
        category: "teams"
      },
      {
        feature_name: "Team Activity Tracking",
        user_story: "US-103",
        priority: "P1",
        category: "teams"
      }
    ]
  },

  "002-3": {
    name: "Badges Box",
    file: "002-3. seed.Badges Box.canvas",
    features: [
      {
        feature_name: "Badge System Core",
        user_story: "US-120",
        priority: "P1",
        category: "gamification"
      },
      {
        feature_name: "Badge Achievement Engine",
        user_story: "US-121",
        priority: "P1",
        category: "gamification"
      },
      {
        feature_name: "Badge Display Gallery",
        user_story: "US-122",
        priority: "P1",
        category: "gamification"
      }
    ]
  },

  "002-4": {
    name: "HoG Box (Hall of Greats)",
    file: "002-4. seed.HoG Box.canvas",
    features: [
      {
        feature_name: "Hall of Greats Leaderboard",
        user_story: "US-130",
        priority: "P2",
        category: "gamification"
      },
      {
        feature_name: "Historical Achievements",
        user_story: "US-131",
        priority: "P2",
        category: "gamification"
      }
    ]
  },

  "002-5": {
    name: "Resources Box",
    file: "002-5. seed.Resources Box.canvas",
    features: [
      {
        feature_name: "Resource Library",
        user_story: "US-140",
        priority: "P2",
        category: "resources"
      },
      {
        feature_name: "Resource Upload System",
        user_story: "US-141",
        priority: "P2",
        category: "resources"
      },
      {
        feature_name: "Resource Categorization",
        user_story: "US-142",
        priority: "P2",
        category: "resources"
      }
    ]
  },

  "003-2": {
    name: "emCoin Transactions Box",
    file: "003-2 seed.emCoin Transactions Box.canvas",
    features: [
      {
        feature_name: "EmCoin Backend Foundation",
        user_story: "US-180",
        priority: "P1",
        category: "emcoin"
      },
      {
        feature_name: "EmCoin Transaction Engine",
        user_story: "US-181",
        priority: "P1",
        category: "emcoin"
      },
      {
        feature_name: "EmCoin Balance Display",
        user_story: "US-182",
        priority: "P1",
        category: "emcoin"
      },
      {
        feature_name: "EmCoin Reward System",
        user_story: "US-183",
        priority: "P1",
        category: "emcoin"
      }
    ]
  }
};

// Export for use in other scripts
module.exports = { CANVAS_REQUIREMENTS };

// If run directly, output the mapping
if (require.main === module) {
  console.log("Canvas Requirements Mapping");
  console.log("===========================");
  
  let totalFeatures = 0;
  let p0Count = 0;
  let p1Count = 0;
  let p2Count = 0;
  
  Object.entries(CANVAS_REQUIREMENTS).forEach(([canvasId, canvas]) => {
    console.log(`\n${canvasId}: ${canvas.name}`);
    console.log(`File: ${canvas.file}`);
    console.log("Features:");
    
    canvas.features.forEach(feature => {
      console.log(`  - ${feature.feature_name} (${feature.priority}, ${feature.user_story})`);
      totalFeatures++;
      
      if (feature.priority === 'P0') p0Count++;
      else if (feature.priority === 'P1') p1Count++;
      else if (feature.priority === 'P2') p2Count++;
    });
  });
  
  console.log("\n===========================");
  console.log("Summary:");
  console.log(`Total Canvas Files: 11`);
  console.log(`Total Features: ${totalFeatures}`);
  console.log(`  P0 (Critical): ${p0Count}`);
  console.log(`  P1 (Important): ${p1Count}`);
  console.log(`  P2 (Nice-to-have): ${p2Count}`);
}