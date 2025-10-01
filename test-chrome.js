const { chromium } = require('playwright');

async function testWithChrome() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome', // Use Chrome browser instead of Chromium
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  // Set viewport to full screen
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    // Navigate to login page
    await page.goto('http://localhost:3002/login');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    console.log('=== TESTING WITH CHROME BROWSER ===\n');
    
    // Test Dashboard Page
    console.log('1. TESTING DASHBOARD PAGE:');
    await page.goto('http://localhost:3002/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Click chat button to expand
    await page.click('button[class*="fixed top-4 right-2"]');
    await page.waitForTimeout(2000);
    
    // Get main content element
    const dashboardMain = await page.locator('main').first();
    const dashboardBox = await dashboardMain.boundingBox();
    
    if (dashboardBox) {
      const dashboardMargin = page.viewportSize().width - dashboardBox.x - dashboardBox.width;
      console.log(`  Dashboard main content margin-right: ${dashboardMargin}px`);
      console.log(`  Dashboard main content width: ${dashboardBox.width}px`);
      console.log(`  Dashboard main content x position: ${dashboardBox.x}px`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'dashboard-chrome.png', fullPage: true });
    console.log('  Screenshot saved: dashboard-chrome.png');
    
    // Close chat
    await page.click('button[class*="fixed top-2 right-2"] button');
    await page.waitForTimeout(1000);
    
    console.log('');
    
    // Test Students Page
    console.log('2. TESTING STUDENTS PAGE:');
    await page.goto('http://localhost:3002/students');
    await page.waitForLoadState('networkidle');
    
    // Click chat button to expand
    await page.click('button[class*="fixed top-4 right-2"]');
    await page.waitForTimeout(2000);
    
    // Get main content element
    const studentsMain = await page.locator('main').first();
    const studentsBox = await studentsMain.boundingBox();
    
    if (studentsBox) {
      const studentsMargin = page.viewportSize().width - studentsBox.x - studentsBox.width;
      console.log(`  Students main content margin-right: ${studentsMargin}px`);
      console.log(`  Students main content width: ${studentsBox.width}px`);
      console.log(`  Students main content x position: ${studentsBox.x}px`);
    }
    
    // Get chat card position
    const chatCard = await page.locator('[class*="fixed top-2 right-2"]').first();
    const chatBox = await chatCard.boundingBox();
    
    if (chatBox) {
      console.log(`  Chat card width: ${chatBox.width}px`);
      console.log(`  Chat card x position: ${chatBox.x}px`);
      console.log(`  Chat card right edge: ${chatBox.x + chatBox.width}px`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'students-chrome.png', fullPage: true });
    console.log('  Screenshot saved: students-chrome.png');
    
    // Check for overlap
    if (studentsBox && chatBox) {
      const mainRightEdge = studentsBox.x + studentsBox.width;
      const chatLeftEdge = chatBox.x;
      
      console.log(`\n=== OVERLAP ANALYSIS ===`);
      console.log(`Main content right edge: ${mainRightEdge}px`);
      console.log(`Chat card left edge: ${chatLeftEdge}px`);
      
      if (mainRightEdge > chatLeftEdge) {
        console.log(`❌ OVERLAP DETECTED: ${mainRightEdge - chatLeftEdge}px overlap`);
      } else {
        console.log(`✅ NO OVERLAP: ${chatLeftEdge - mainRightEdge}px gap`);
      }
    }
    
    console.log('\n=== CHROME TEST COMPLETE ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testWithChrome();
