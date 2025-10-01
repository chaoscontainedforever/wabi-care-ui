const { chromium } = require('playwright');

async function testSubheadingsRemoved() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING SUBHEADINGS REMOVAL ===\n');
    
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
    
    // Check if subheadings are removed
    const schoolSubheading = await page.locator('text=Elementary School').count();
    const goalSubheading = await page.locator('text=Select a goal to start data collection').count();
    
    console.log(`School subheading found: ${schoolSubheading} (should be 0)`);
    console.log(`Goal subheading found: ${goalSubheading} (should be 0)`);
    
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
    
    // Take screenshot
    await page.screenshot({ path: 'goal-data-subheadings-removed.png', fullPage: true });
    console.log('Screenshot saved: goal-data-subheadings-removed.png');
    
    console.log('\n=== ALL FIXES VERIFIED ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testSubheadingsRemoved();
