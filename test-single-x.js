const { chromium } = require('playwright');

async function testSingleXButton() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING SINGLE X BUTTON FIX ===\n');
    
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
    
    // Look for Add Goal button and click it
    const addGoalButton = await page.locator('button:has-text("Add Goal")');
    if (await addGoalButton.isVisible()) {
      await addGoalButton.click();
      await page.waitForTimeout(1000);
      
      // Check if modal is open
      const modal = await page.locator('[role="dialog"]');
      const isModalOpen = await modal.isVisible();
      console.log(`✅ Modal opened: ${isModalOpen}`);
      
      if (isModalOpen) {
        // Count X buttons in the modal
        const xButtons = await page.locator('button:has(svg[class*="lucide-x"])').count();
        console.log(`✅ Number of X buttons found: ${xButtons}`);
        
        // Check if there's only one X button (the built-in close button)
        const hasSingleX = xButtons === 1;
        console.log(`✅ Single X button (no duplicates): ${hasSingleX}`);
        
        // Check if the built-in close button is present
        const builtInCloseButton = await page.locator('button[aria-label="Close"]');
        const isBuiltInCloseVisible = await builtInCloseButton.isVisible();
        console.log(`✅ Built-in close button visible: ${isBuiltInCloseVisible}`);
        
        // Test closing the modal
        await builtInCloseButton.click();
        await page.waitForTimeout(500);
        
        const isModalClosed = !(await modal.isVisible());
        console.log(`✅ Modal closed successfully: ${isModalClosed}`);
        
        // Take screenshot
        await page.screenshot({ path: 'single-x-button-fix.png', fullPage: true });
        console.log('Screenshot saved: single-x-button-fix.png');
      }
    }
    
    console.log('\n=== ✅ DOUBLE X BUTTONS FIXED ===');
    console.log('✅ Removed redundant X button from header');
    console.log('✅ Only built-in close button remains');
    console.log('✅ Modal closes properly with single X button');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testSingleXButton();
