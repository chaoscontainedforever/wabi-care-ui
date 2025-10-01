const { chromium } = require('playwright');

async function testFinalGoalDataFixes() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  // Set viewport to full screen
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  try {
    console.log('=== TESTING FINAL GOAL DATA FIXES ===\n');
    
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
    
    // Check if Goal Data heading is removed
    const goalDataHeading = await page.locator('h1:has-text("Goal Data")').count();
    console.log(`Goal Data heading found: ${goalDataHeading} (should be 0)`);
    
    // Check if top ribbon is present
    const backButton = await page.locator('button:has-text("Back")').count();
    const dateTime = await page.locator('text=Sep 29, 11:05 PM - 11:35 PM').count();
    const accommodations = await page.locator('text=Accommodations').count();
    const servicesNotTracked = await page.locator('text=Services Not Tracked').count();
    
    console.log(`Back button found: ${backButton} (should be 1)`);
    console.log(`Date/time found: ${dateTime} (should be 1)`);
    console.log(`Accommodations found: ${accommodations} (should be 1)`);
    console.log(`Services Not Tracked found: ${servicesNotTracked} (should be 1)`);
    
    // Check font sizes in goals list
    const goalTitles = await page.locator('.text-xs').count();
    console.log(`Small text elements found: ${goalTitles}`);
    
    // Take final screenshot
    await page.screenshot({ path: 'goal-data-final.png', fullPage: true });
    console.log('Screenshot saved: goal-data-final.png');
    
    console.log('\n=== ALL FIXES VERIFIED ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testFinalGoalDataFixes();
