const { chromium } = require('playwright');

async function testStudentsPage() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  // Set viewport to full screen
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    console.log('=== TESTING STUDENTS PAGE ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Navigate to students page
    console.log('Navigating to students page...');
    await page.goto('http://localhost:3000/students');
    await page.waitForLoadState('networkidle');
    
    // Check if page loaded successfully
    const pageTitle = await page.title();
    console.log(`Page title: ${pageTitle}`);
    
    // Take screenshot before opening chat
    await page.screenshot({ path: 'students-before-chat.png', fullPage: true });
    console.log('Screenshot saved: students-before-chat.png');
    
    // Click chat button to expand
    console.log('Opening chat...');
    await page.click('button[class*="fixed top-4 right-2"]');
    await page.waitForTimeout(2000);
    
    // Get main content element
    const studentsMain = await page.locator('main').first();
    const studentsBox = await studentsMain.boundingBox();
    
    if (studentsBox) {
      const studentsMargin = page.viewportSize().width - studentsBox.x - studentsBox.width;
      console.log(`Students margin-right: ${studentsMargin}px`);
      console.log(`Students width: ${studentsBox.width}px`);
    }
    
    // Take screenshot after opening chat
    await page.screenshot({ path: 'students-after-chat.png', fullPage: true });
    console.log('Screenshot saved: students-after-chat.png');
    
    console.log('\n=== TEST COMPLETED ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testStudentsPage();
