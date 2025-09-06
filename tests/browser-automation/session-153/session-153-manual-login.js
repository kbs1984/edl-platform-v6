const puppeteer = require('puppeteer');

console.log('=== Session 153: Manual Login Demonstration ===');
console.log('This will open a browser and manually log you in.');
console.log('Watch the browser window to see the dashboard.\n');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  
  console.log('1. Opening login page...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  
  console.log('2. Clicking email field and typing (should be WHITE)...');
  await page.click('[data-testid="email"]');
  await page.type('[data-testid="email"]', 'brian.bumsik.kim+08test@gmail.com', { delay: 100 });
  
  console.log('3. Clicking password field and typing...');  
  await page.click('[data-testid="password"]');
  await page.type('[data-testid="password"]', '16180339*emD', { delay: 100 });
  
  console.log('4. Submitting form...');
  await page.click('button[type="submit"]');
  
  console.log('5. Waiting for dashboard redirect...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const url = page.url();
  console.log('\n📍 Current URL:', url);
  
  if (url.includes('localhost:3001')) {
    console.log('✅ SUCCESS! You should see the dashboard now!');
    console.log('\nBrowser will stay open. You can manually explore the dashboard.');
  } else {
    console.log('⚠️ Still on login page. Check the terminal logs for errors.');
  }
  
  console.log('\nPress Ctrl+C when done exploring.');
})();