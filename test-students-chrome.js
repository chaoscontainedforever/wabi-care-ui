const { chromium } = require('playwright');

async function testStudentsWithChrome() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome', // Use Chrome browser
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
    
    console.log('=== TESTING STUDENTS PAGE WITH CHROME ===\n');
    
    // Navigate directly to students page
    await page.goto('http://localhost:3002/students');
    await page.waitForLoadState('networkidle');
    
    console.log('Students page loaded successfully');
    
    // Get initial main content
    const mainContent = await page.locator('main').first();
    const initialBox = await mainContent.boundingBox();
    
    if (initialBox) {
      console.log(`Initial main content width: ${initialBox.width}px`);
      console.log(`Initial main content x position: ${initialBox.x}px`);
    }
    
    // Click chat button to expand
    console.log('Clicking chat button...');
    await page.click('button[class*="fixed top-4 right-2"]');
    await page.waitForTimeout(3000); // Wait longer for animation
    
    // Get expanded main content
    const expandedBox = await mainContent.boundingBox();
    
    if (expandedBox) {
      console.log(`Expanded main content width: ${expandedBox.width}px`);
      console.log(`Expanded main content x position: ${expandedBox.x}px`);
      
      const marginRight = page.viewportSize().width - expandedBox.x - expandedBox.width;
      console.log(`Margin-right: ${marginRight}px`);
    }
    
    // Get chat card position
    const chatCard = await page.locator('[class*="fixed top-2 right-2"]').first();
    const chatBox = await chatCard.boundingBox();
    
    if (chatBox) {
      console.log(`Chat card width: ${chatBox.width}px`);
      console.log(`Chat card x position: ${chatBox.x}px`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'students-chrome-final.png', fullPage: true });
    console.log('Screenshot saved: students-chrome-final.png');
    
    // Check for overlap
    if (expandedBox && chatBox) {
      const mainRightEdge = expandedBox.x + expandedBox.width;
      const chatLeftEdge = chatBox.x;
      
      console.log(`\n=== OVERLAP CHECK ===`);
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

testStudentsWithChrome();
