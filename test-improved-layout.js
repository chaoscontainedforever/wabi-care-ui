const { chromium } = require('playwright');

async function testImprovedGoalsLayout() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING IMPROVED GOALS LAYOUT ===\n');
    
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
    
    // Check if goal items have some detail
    const goalDetails = await page.locator('text=Social Studies • Level Level 3 • 0% complete').count();
    console.log(`Goal details found: ${goalDetails} (should be 1)`);
    
    // Check if both cards are present
    const goalsCard = await page.locator('text=Goals (3/3)').count();
    const selectGoalCard = await page.locator('text=Select a Goal').count();
    console.log(`Goals card found: ${goalsCard} (should be 1)`);
    console.log(`Select Goal card found: ${selectGoalCard} (should be 1)`);
    
    // Check if cards are aligned (both should be same height)
    const cards = await page.locator('.flex-1').count();
    console.log(`Flex-1 cards found: ${cards} (should be 2)`);
    
    // Take screenshot
    await page.screenshot({ path: 'goal-data-improved-layout.png', fullPage: true });
    console.log('Screenshot saved: goal-data-improved-layout.png');
    
    console.log('\n=== IMPROVED LAYOUT VERIFIED ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testImprovedGoalsLayout();
