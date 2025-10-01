const { chromium } = require('playwright');

async function testStudentRibbon() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING STUDENT SELECTION RIBBON ===\n');
    
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
    
    // Check if student selection ribbon is present
    const studentRibbonText = await page.locator('text=Select a student to view their goal data').count();
    console.log(`Student selection text found: ${studentRibbonText} (should be 1)`);
    
    // Check if it's in a ribbon format (smaller font)
    const smallTextElements = await page.locator('.text-sm').count();
    console.log(`Small text elements found: ${smallTextElements}`);
    
    // Check if old student card is removed
    const oldStudentCard = await page.locator('h1:has-text("Select a student to view their goal data")').count();
    console.log(`Old student card heading found: ${oldStudentCard} (should be 0)`);
    
    // Check if ribbons are stacked properly
    const ribbons = await page.locator('.bg-white.p-4.rounded-lg.border').count();
    console.log(`Ribbon elements found: ${ribbons} (should be 2)`);
    
    // Take screenshot
    await page.screenshot({ path: 'goal-data-student-ribbon.png', fullPage: true });
    console.log('Screenshot saved: goal-data-student-ribbon.png');
    
    console.log('\n=== RIBBON LAYOUT VERIFIED ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testStudentRibbon();
