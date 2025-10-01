const { chromium } = require('playwright');

async function testStudentPages() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  // Set viewport to full screen
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    console.log('=== TESTING STUDENT PAGES ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Test Student Overview Page
    console.log('1. TESTING STUDENT OVERVIEW PAGE:');
    await page.goto('http://localhost:3000/student-overview');
    await page.waitForLoadState('networkidle');
    
    // Check if page loaded successfully
    const overviewTitle = await page.title();
    console.log(`  Page title: ${overviewTitle}`);
    
    // Click chat button to expand
    await page.click('button[class*="fixed top-4 right-2"]');
    await page.waitForTimeout(2000);
    
    // Get main content element
    const overviewMain = await page.locator('main').first();
    const overviewBox = await overviewMain.boundingBox();
    
    if (overviewBox) {
      const overviewMargin = page.viewportSize().width - overviewBox.x - overviewBox.width;
      console.log(`  Student Overview margin-right: ${overviewMargin}px`);
      console.log(`  Student Overview width: ${overviewBox.width}px`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'student-overview-fixed.png', fullPage: true });
    console.log('  Screenshot saved: student-overview-fixed.png');
    
    // Close chat
    await page.click('button[class*="fixed top-2 right-2"] button');
    await page.waitForTimeout(1000);
    
    console.log('');
    
    // Test Goal Data Page
    console.log('2. TESTING GOAL DATA PAGE:');
    await page.goto('http://localhost:3000/goal-data');
    await page.waitForLoadState('networkidle');
    
    // Check if page loaded successfully
    const goalDataTitle = await page.title();
    console.log(`  Page title: ${goalDataTitle}`);
    
    // Click chat button to expand
    await page.click('button[class*="fixed top-4 right-2"]');
    await page.waitForTimeout(2000);
    
    // Get main content element
    const goalDataMain = await page.locator('main').first();
    const goalDataBox = await goalDataMain.boundingBox();
    
    if (goalDataBox) {
      const goalDataMargin = page.viewportSize().width - goalDataBox.x - goalDataBox.width;
      console.log(`  Goal Data margin-right: ${goalDataMargin}px`);
      console.log(`  Goal Data width: ${goalDataBox.width}px`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'goal-data-fixed.png', fullPage: true });
    console.log('  Screenshot saved: goal-data-fixed.png');
    
    console.log('\n=== TEST COMPLETED ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testStudentPages();
