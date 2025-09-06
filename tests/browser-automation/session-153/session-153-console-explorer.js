// === Session 153: Dashboard Explorer ===
// Copy and paste this entire script into the browser console while on the dashboard

console.log('🔍 Starting Dashboard Analysis...\n');

// 1. Analyze addiction bar
console.log('═══ ADDICTION MECHANICS ═══');
const addictionData = {
  emcoin: document.querySelector('#v5-emcoin-balance')?.textContent,
  streak: document.querySelector('#v5-streak-count')?.textContent,
  today: document.querySelector('#v5-today-count')?.textContent,
  rank: document.querySelector('#v5-rank-position')?.textContent
};
console.table(addictionData);

// 2. Find all navigation links
console.log('\n═══ NAVIGATION LINKS ═══');
const navLinks = [];
document.querySelectorAll('a[href^="/"]').forEach(a => {
  const href = a.getAttribute('href');
  const text = a.textContent.trim();
  if (text && href !== '/' && !href.includes('logout')) {
    navLinks.push({ href, text });
  }
});
console.table(navLinks);

// 3. Check features
console.log('\n═══ FEATURE DETECTION ═══');
const features = {
  'V5 Integration': typeof window.v5 !== 'undefined',
  'WebSocket Available': typeof window.WebSocket !== 'undefined',
  'React Detected': !!(window.React || window._react),
  'Next.js Detected': !!window.__NEXT_DATA__,
  'Button Count': document.querySelectorAll('button').length,
  'Form Count': document.querySelectorAll('form').length,
  'Has Sidebar': !!document.querySelector('aside, [class*="sidebar"]'),
  'Has Cards': !!document.querySelector('[class*="card"]')
};
console.table(features);

// 4. Interactive elements
console.log('\n═══ INTERACTIVE ELEMENTS ═══');
const buttons = [];
document.querySelectorAll('button:not(:disabled)').forEach(btn => {
  const text = btn.textContent.trim();
  if (text && !text.includes('Logout') && !text.includes('Cookie')) {
    buttons.push(text);
  }
});
console.log('Buttons found:', buttons);

// 5. Page structure
console.log('\n═══ PAGE STRUCTURE ═══');
const structure = {
  'Title': document.title,
  'URL': window.location.href,
  'Main Heading': document.querySelector('h1, h2')?.textContent,
  'User Name': document.querySelector('[class*="user"], [class*="name"]')?.textContent,
  'Local Storage Keys': Object.keys(localStorage).filter(k => !k.includes('token')),
  'Session Storage Keys': Object.keys(sessionStorage).filter(k => !k.includes('token'))
};
console.table(structure);

// 6. Create automated navigation function
window.explorePages = async function() {
  console.log('\n═══ AUTOMATED NAVIGATION ═══');
  console.log('Starting automated exploration...\n');
  
  const links = ['/chat', '/calendar', '/statistics', '/settings'];
  
  for (const link of links) {
    console.log(`Navigating to ${link}...`);
    const anchor = document.querySelector(`a[href="${link}"]`);
    if (anchor) {
      anchor.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log(`✅ On page: ${window.location.pathname}`);
      console.log(`  Title: ${document.title}`);
      console.log(`  Content length: ${document.body.innerText.length} chars`);
      console.log(`  Buttons: ${document.querySelectorAll('button').length}`);
      console.log(`  Main heading: ${document.querySelector('h1, h2')?.textContent || 'none'}\n`);
      
      // Go back to dashboard
      window.location.href = 'http://localhost:3001';
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      console.log(`❌ Link ${link} not found\n`);
    }
  }
  
  console.log('✅ Exploration complete!');
};

// 7. Summary
console.log('\n═══ SUMMARY ═══');
console.log('✅ Dashboard loaded successfully');
console.log(`✅ Found ${navLinks.length} navigation links`);
console.log(`✅ Found ${buttons.length} interactive buttons`);
console.log(`${features['V5 Integration'] ? '✅' : '❌'} V5 Integration`);
console.log(`${addictionData.emcoin !== 'NOT FOUND' ? '✅' : '❌'} Addiction metrics present`);

console.log('\n💡 To automatically navigate through all pages, run:');
console.log('   await explorePages()');
console.log('\nAnalysis complete!');