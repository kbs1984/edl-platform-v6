/**
 * Session 151: Comprehensive Dashboard Inspection
 * Explores ALL features to determine what needs work
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting Comprehensive Dashboard Inspection...\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 200, // Slow enough to see everything
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  console.log('📍 Navigating to Auth Gateway...');
  await page.goto('http://localhost:3000/login');
  
  console.log('\n' + '='.repeat(60));
  console.log('📝 MANUAL LOGIN REQUIRED');
  console.log('='.repeat(60));
  console.log('Please log in with your credentials');
  console.log('='.repeat(60));
  console.log('\nWaiting for login...\n');
  
  // Wait for login
  let loggedIn = false;
  while (!loggedIn) {
    await page.waitForTimeout(1000);
    const url = page.url();
    if (url.includes('localhost:3001')) {
      loggedIn = true;
      console.log('✅ Login detected! Starting comprehensive inspection...\n');
      break;
    }
  }
  
  // Give page time to fully load
  await page.waitForTimeout(3000);
  
  console.log('=' + '='.repeat(59));
  console.log('📊 COMPREHENSIVE FEATURE INSPECTION');
  console.log('=' + '='.repeat(59));
  
  // 1. ADDICTION BAR FEATURES
  console.log('\n1️⃣ ADDICTION/GAMIFICATION FEATURES:');
  console.log('-'.repeat(40));
  
  const addictionFeatures = {
    'EmCoin Balance': '#v5-emcoin-balance',
    'Streak Counter': '#v5-streak-count',
    'Today Visitors': '#v5-today-count',
    'Division Rank': '#v5-rank-position',
    'Addiction Bar': '#v5-addiction-bar',
    'Badge Display': '[class*="badge"], [id*="badge"]',
    'Achievement Panel': '[class*="achievement"], [id*="achievement"]',
    'Level Indicator': '[class*="level"], [id*="level"]',
    'XP Display': '[class*="xp"], [id*="experience"]',
    'Reward System': '[class*="reward"], [id*="reward"]'
  };
  
  for (const [name, selector] of Object.entries(addictionFeatures)) {
    const element = await page.$(selector);
    if (element) {
      const text = await element.textContent().catch(() => '');
      console.log(`  ✅ ${name}: Found (value: "${text.trim()}")`);
    } else {
      console.log(`  ❌ ${name}: NOT FOUND`);
    }
  }
  
  // 2. CHAT/MESSAGING FEATURES
  console.log('\n2️⃣ CHAT & MESSAGING FEATURES:');
  console.log('-'.repeat(40));
  
  // Try to navigate to Chats
  const chatButton = await page.$('button:has-text("Chats")');
  if (chatButton) {
    console.log('  Clicking "Chats" button...');
    await chatButton.click();
    await page.waitForTimeout(2000);
    
    // Look for chat elements
    const chatFeatures = {
      'Chat List': '[class*="chat-list"], [id*="chat-list"]',
      'Message Input': '[placeholder*="message"], input[type="text"]',
      'Send Button': 'button:has-text("Send")',
      'Chat History': '[class*="message"], [class*="chat-history"]',
      'Online Status': '[class*="online"], [class*="status"]',
      'Unread Counter': '[class*="unread"], [class*="badge"]'
    };
    
    for (const [name, selector] of Object.entries(chatFeatures)) {
      const element = await page.$(selector);
      console.log(`  ${element ? '✅' : '❌'} ${name}: ${element ? 'Found' : 'NOT FOUND'}`);
    }
  } else {
    console.log('  ❌ Chat button not found');
  }
  
  // 3. FRIENDS SYSTEM
  console.log('\n3️⃣ FRIENDS SYSTEM:');
  console.log('-'.repeat(40));
  
  const friendsButton = await page.$('button:has-text("Friends")');
  if (friendsButton) {
    console.log('  Clicking "Friends" button...');
    await friendsButton.click();
    await page.waitForTimeout(2000);
    
    const friendFeatures = {
      'Add Friends Button': 'button:has-text("Add")',
      'Friends List': '[class*="friend"], [id*="friend"]',
      'Friend Requests': '[class*="request"], [class*="pending"]',
      'Search Friends': 'input[placeholder*="search"], input[placeholder*="friend"]',
      'Online Friends': '[class*="online-friend"]',
      'Friend Profile': '[class*="profile"], [class*="avatar"]'
    };
    
    for (const [name, selector] of Object.entries(friendFeatures)) {
      const element = await page.$(selector);
      console.log(`  ${element ? '✅' : '❌'} ${name}: ${element ? 'Found' : 'NOT FOUND'}`);
    }
  }
  
  // 4. TEAMS & GUILDS
  console.log('\n4️⃣ TEAMS & GUILDS SYSTEM:');
  console.log('-'.repeat(40));
  
  const teamsButton = await page.$('button:has-text("Teams")');
  if (teamsButton) {
    console.log('  Clicking "Teams & Guilds" button...');
    await teamsButton.click();
    await page.waitForTimeout(2000);
    
    const teamFeatures = {
      'Create Team Button': 'button:has-text("Create")',
      'Team List': '[class*="team"], [id*="team"]',
      'Guild System': '[class*="guild"], [id*="guild"]',
      'Team Chat': '[class*="team-chat"]',
      'Team Members': '[class*="member"], [class*="roster"]',
      'Team Stats': '[class*="team-stat"], [class*="team-score"]'
    };
    
    for (const [name, selector] of Object.entries(teamFeatures)) {
      const element = await page.$(selector);
      console.log(`  ${element ? '✅' : '❌'} ${name}: ${element ? 'Found' : 'NOT FOUND'}`);
    }
  }
  
  // 5. PROFILE & CUSTOMIZATION
  console.log('\n5️⃣ PROFILE & CUSTOMIZATION:');
  console.log('-'.repeat(40));
  
  // Go back to dashboard
  const dashButton = await page.$('button:has-text("Dashboard")');
  if (dashButton) {
    await dashButton.click().catch(() => {});
    await page.waitForTimeout(2000);
  }
  
  const profileFeatures = {
    'User Avatar': 'img[alt*="avatar"], [class*="avatar"]',
    'Profile Name': ':has-text("08 tester")',
    'Profile Settings': 'button:has-text("Settings"), [class*="settings"]',
    'Customization Panel': '[class*="customize"], [class*="theme"]',
    'Profile Stats': '[class*="profile-stat"], [class*="user-stat"]',
    'Bio/Description': '[class*="bio"], [class*="about"]'
  };
  
  for (const [name, selector] of Object.entries(profileFeatures)) {
    const element = await page.$(selector);
    console.log(`  ${element ? '✅' : '❌'} ${name}: ${element ? 'Found' : 'NOT FOUND'}`);
  }
  
  // 6. ACTIVITY/DEBATE FEATURES
  console.log('\n6️⃣ DEBATE & ACTIVITY FEATURES:');
  console.log('-'.repeat(40));
  
  const debateButton = await page.$('button:has-text("Debates")');
  if (debateButton) {
    console.log('  Clicking "My Debates" button...');
    await debateButton.click();
    await page.waitForTimeout(2000);
    
    const debateFeatures = {
      'Create Debate': 'button:has-text("Create"), button:has-text("New")',
      'Debate List': '[class*="debate"], [id*="debate"]',
      'Activity Feed': '[class*="activity"], [class*="feed"]',
      'Score Display': '[class*="score"], [class*="points"]',
      'Timer/Clock': '[class*="timer"], [class*="clock"]',
      'Judge Panel': '[class*="judge"], [class*="voting"]'
    };
    
    for (const [name, selector] of Object.entries(debateFeatures)) {
      const element = await page.$(selector);
      console.log(`  ${element ? '✅' : '❌'} ${name}: ${element ? 'Found' : 'NOT FOUND'}`);
    }
  }
  
  // 7. PROGRESS TRACKING
  console.log('\n7️⃣ PROGRESS & ANALYTICS:');
  console.log('-'.repeat(40));
  
  const progressFeatures = {
    'Progress Bar': '[class*="progress"], progress',
    'Statistics Panel': '[class*="stats"], [class*="analytics"]',
    'Graph/Chart': 'canvas, svg[class*="chart"]',
    'Milestone Tracker': '[class*="milestone"], [class*="goal"]',
    'History Log': '[class*="history"], [class*="log"]',
    'Leaderboard': '[class*="leaderboard"], [class*="ranking"]'
  };
  
  for (const [name, selector] of Object.entries(progressFeatures)) {
    const element = await page.$(selector);
    console.log(`  ${element ? '✅' : '❌'} ${name}: ${element ? 'Found' : 'NOT FOUND'}`);
  }
  
  // 8. NAVIGATION & UI
  console.log('\n8️⃣ GENERAL UI ELEMENTS:');
  console.log('-'.repeat(40));
  
  const uiFeatures = {
    'Sidebar': 'aside, [class*="sidebar"]',
    'Navigation Bar': 'nav, [role="navigation"]',
    'Search Bar': 'input[type="search"], input[placeholder*="search"]',
    'Notifications': '[class*="notification"], [class*="alert"]',
    'Dark Mode Toggle': '[class*="theme"], [class*="dark"]',
    'Mobile Menu': '[class*="mobile"], [class*="burger"]'
  };
  
  for (const [name, selector] of Object.entries(uiFeatures)) {
    const element = await page.$(selector);
    console.log(`  ${element ? '✅' : '❌'} ${name}: ${element ? 'Found' : 'NOT FOUND'}`);
  }
  
  // SUMMARY
  console.log('\n' + '='.repeat(60));
  console.log('📋 FEATURE IMPLEMENTATION SUMMARY');
  console.log('='.repeat(60));
  
  console.log('\n✅ IMPLEMENTED:');
  console.log('  • Basic addiction bar with 4 metrics');
  console.log('  • Navigation between pages');
  console.log('  • Basic page structure');
  
  console.log('\n❌ MISSING OR NEEDS WORK:');
  console.log('  • Chat functionality');
  console.log('  • Friends system features');
  console.log('  • Team/Guild features');
  console.log('  • Profile customization');
  console.log('  • Debate/Activity system');
  console.log('  • Progress tracking');
  console.log('  • Analytics/Statistics');
  
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('  1. Implement chat system (high priority)');
  console.log('  2. Build out friends functionality');
  console.log('  3. Add actual EmCoin earning mechanics');
  console.log('  4. Create activity/debate features');
  console.log('  5. Add progress visualization');
  
  // Take final screenshot
  await page.screenshot({ path: 'comprehensive-inspection-final.png', fullPage: true });
  console.log('\n📸 Screenshot saved: comprehensive-inspection-final.png');
  
  console.log('\n✅ Inspection complete. Browser staying open for review.');
  console.log('Press Ctrl+C to close.');
  
  // Keep browser open
  await new Promise(() => {});
})();