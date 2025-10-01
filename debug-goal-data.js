const { chromium } = require('playwright');

async function testGoalDataPage() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING GOAL DATA PAGE ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Navigate to Goal Data page
    await page.click('text=Data Collection');
    await page.waitForTimeout(1000);
    await page.click('text=Goal Data');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for content to load
    await page.waitForTimeout(2000);
    
    // Check if any content is visible
    const pageContent = await page.locator('body').textContent();
    console.log('Page content preview:', pageContent?.substring(0, 200));
    
    // Check for specific elements
    const backButton = await page.locator('text=Back');
    const isBackButtonVisible = await backButton.isVisible();
    console.log(`✅ Back button visible: ${isBackButtonVisible}`);
    
    const studentSelection = await page.locator('text=Select a student to view their goal data');
    const isStudentSelectionVisible = await studentSelection.isVisible();
    console.log(`✅ Student selection text visible: ${isStudentSelectionVisible}`);
    
    // Check if there are any cards
    const cards = await page.locator('[class*="card"]').count();
    console.log(`✅ Number of cards found: ${cards}`);
    
    // Check for goals
    const goalsText = await page.locator('text=Goals').count();
    console.log(`✅ Goals text found: ${goalsText} times`);
    
    // Check for trial
    const trialText = await page.locator('text=Trial').count();
    console.log(`✅ Trial text found: ${trialText} times`);
    
    // Check for notes
    const notesText = await page.locator('text=Notes').count();
    console.log(`✅ Notes text found: ${notesText} times`);
    
    // Take screenshot
    await page.screenshot({ path: 'goal-data-debug.png', fullPage: true });
    console.log('Screenshot saved: goal-data-debug.png');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testGoalDataPage();
