const { chromium } = require('playwright');

async function testCorrectPort() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  // Set viewport to full screen
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    console.log('=== TESTING CORRECT PORT (3000) ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Test Dashboard Page
    console.log('1. TESTING DASHBOARD PAGE:');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Click chat button to expand
    await page.click('button[class*="fixed top-4 right-2"]');
    await page.waitForTimeout(2000);
    
    // Get main content element
    const dashboardMain = await page.locator('main').first();
    const dashboardBox = await dashboardMain.boundingBox();
    
    if (dashboardBox) {
      const dashboardMargin = page.viewportSize().width - dashboardBox.x - dashboardBox.width;
      console.log(`  Dashboard margin-right: ${dashboardMargin}px`);
      console.log(`  Dashboard width: ${dashboardBox.width}px`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'dashboard-port-3000.png', fullPage: true });
    console.log('  Screenshot saved: dashboard-port-3000.png');
    
    // Close chat
    await page.click('button[class*="fixed top-2 right-2"] button');
    await page.waitForTimeout(1000);
    
    console.log('');
    
    // Test Students Page
    console.log('2. TESTING STUDENTS PAGE:');
    await page.goto('http://localhost:3000/students');
    await page.waitForLoadState('networkidle');
    
    // Check if page loaded successfully
    const pageTitle = await page.title();
    console.log(`  Page title: ${pageTitle}`);
    
    // Click chat button to expand
    await page.click('button[class*="fixed top-4 right-2"]');
    await page.waitForTimeout(2000);
    
    // Get main content element
    const studentsMain = await page.locator('main').first();
    const studentsBox = await studentsMain.boundingBox();
    
    if (studentsBox) {
      const studentsMargin = page.viewportSize().width - studentsBox.x - studentsBox.width;
      console.log(`  Students margin-right: ${studentsMargin}px`);
      console.log(`  Students width: ${studentsBox.width}px`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'students-port-3000.png', fullPage: true });
    console.log('  Screenshot saved: students-port-3000.png');
    
    console.log('\n=== TEST COMPLETED ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testCorrectPort();
