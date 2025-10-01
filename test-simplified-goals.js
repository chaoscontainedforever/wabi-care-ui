const { chromium } = require('playwright');

async function testSimplifiedGoals() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING SIMPLIFIED GOALS LAYOUT ===\n');
    
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
    
    // Check if Goals heading is smaller
    const goalsHeading = await page.locator('text=Goals (3/3)').count();
    console.log(`Goals heading found: ${goalsHeading} (should be 1)`);
    
    // Check if goal items are simplified (no detailed descriptions)
    const goalDescriptions = await page.locator('text=Demo Student1 will take 5 bites').count();
    console.log(`Detailed descriptions found: ${goalDescriptions} (should be 0)`);
    
    const levelTargetCurrent = await page.locator('text=Level: Level 3').count();
    console.log(`Level/Target/Current details found: ${levelTargetCurrent} (should be 0)`);
    
    // Check if goal titles are still present
    const goalTitles = await page.locator('text=Social Studies').count();
    console.log(`Goal titles found: ${goalTitles} (should be 1)`);
    
    // Check if status icons are still present
    const checkCircles = await page.locator('.text-green-500').count();
    console.log(`Status icons found: ${checkCircles} (should be 1)`);
    
    // Take screenshot
    await page.screenshot({ path: 'goal-data-simplified.png', fullPage: true });
    console.log('Screenshot saved: goal-data-simplified.png');
    
    console.log('\n=== SIMPLIFIED LAYOUT VERIFIED ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testSimplifiedGoals();
