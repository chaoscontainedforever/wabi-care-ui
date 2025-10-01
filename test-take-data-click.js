const { chromium } = require('playwright');

async function testTakeDataButtonClick() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING TAKE DATA BUTTON CLICK ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Navigate to Student Overview page with a specific student
    console.log('Navigating to Student Overview page...');
    await page.goto('http://localhost:3000/student-overview?student=1c3bb7cc-3df2-4d74-a546-9901d713a5cc');
    await page.waitForLoadState('networkidle');
    
    // Check if Take Data button is present and enabled
    const takeDataButton = page.locator('button:has-text("Take Data")');
    const isVisible = await takeDataButton.isVisible();
    const isEnabled = await takeDataButton.isEnabled();
    
    console.log(`✅ Take Data button visible: ${isVisible}`);
    console.log(`✅ Take Data button enabled: ${isEnabled}`);
    
    // Listen for console logs
    page.on('console', msg => {
      if (msg.text().includes('Take Data button clicked')) {
        console.log('✅ Console log detected:', msg.text());
      }
      if (msg.text().includes('Navigating to:')) {
        console.log('✅ Navigation log detected:', msg.text());
      }
    });
    
    // Click Take Data button
    console.log('Clicking Take Data button...');
    await takeDataButton.click();
    
    // Wait a bit for any navigation
    await page.waitForTimeout(2000);
    
    // Check current URL
    const currentUrl = page.url();
    console.log(`✅ Current URL after click: ${currentUrl}`);
    
    // Check if URL changed
    const urlChanged = currentUrl.includes('/goal-data');
    console.log(`✅ URL changed to Goal Data page: ${urlChanged}`);
    
    // Take screenshot
    await page.screenshot({ path: 'take-data-button-test.png', fullPage: true });
    console.log('Screenshot saved: take-data-button-test.png');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testTakeDataButtonClick();
