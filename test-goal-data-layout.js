const { chromium } = require('playwright');

async function testGoalDataLayout() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  // Set viewport to full screen
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    console.log('=== TESTING GOAL DATA LAYOUT ===\n');
    
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
    
    // Take screenshot before opening chat
    await page.screenshot({ path: 'goal-data-new-layout.png', fullPage: true });
    console.log('Screenshot saved: goal-data-new-layout.png');
    
    // Click chat button to expand
    console.log('Opening chat...');
    await page.click('button[class*="fixed top-4 right-2"]');
    await page.waitForTimeout(2000);
    
    // Get main content element
    const goalDataMain = await page.locator('main').first();
    const goalDataBox = await goalDataMain.boundingBox();
    
    if (goalDataBox) {
      const goalDataMargin = page.viewportSize().width - goalDataBox.x - goalDataBox.width;
      console.log(`Goal Data margin-right: ${goalDataMargin}px`);
      console.log(`Goal Data width: ${goalDataBox.width}px`);
    }
    
    // Take screenshot after opening chat
    await page.screenshot({ path: 'goal-data-with-chat.png', fullPage: true });
    console.log('Screenshot saved: goal-data-with-chat.png');
    
    console.log('\n=== TEST COMPLETED ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testGoalDataLayout();
