const { chromium } = require('playwright');

async function testGoalDataFixes() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  // Set viewport to full screen
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    console.log('=== TESTING GOAL DATA FIXES ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Navigate to goal data page
    console.log('Navigating to goal data page...');
    await page.goto('http://localhost:3000/goal-data');
    await page.waitForLoadState('networkidle');
    
    // Check if page loaded successfully
    const goalDataTitle = await page.title();
    console.log(`Page title: ${goalDataTitle}`);
    
    // Take screenshot to verify fixes
    await page.screenshot({ path: 'goal-data-fixes.png', fullPage: true });
    console.log('Screenshot saved: goal-data-fixes.png');
    
    // Check if Goal Data heading is removed
    const goalDataHeading = await page.locator('h1:has-text("Goal Data")').count();
    console.log(`Goal Data heading found: ${goalDataHeading} (should be 0)`);
    
    // Check font sizes in goals list
    const goalTitles = await page.locator('.text-xs').count();
    console.log(`Small text elements found: ${goalTitles}`);
    
    console.log('\n=== TEST COMPLETED ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testGoalDataFixes();
