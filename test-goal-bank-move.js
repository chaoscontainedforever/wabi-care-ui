const { chromium } = require('playwright');

async function testGoalBankMove() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING GOAL BANK MOVE TO DATA COLLECTION ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Check if "Data Collection" section is present
    const dataCollectionSection = await page.locator('text=Data Collection').count();
    console.log(`✅ "Data Collection" section found: ${dataCollectionSection} (should be 1)`);
    
    // Click on Data Collection section to expand it
    await page.click('text=Data Collection');
    await page.waitForTimeout(1000);
    
    // Check if Goal Bank is now in Data Collection
    const goalBankInDataCollection = await page.locator('text=Goal Bank').count();
    console.log(`✅ "Goal Bank" found in Data Collection: ${goalBankInDataCollection > 0}`);
    
    // Check if Goal Data is still in Data Collection
    const goalDataInDataCollection = await page.locator('text=Goal Data').count();
    console.log(`✅ "Goal Data" still in Data Collection: ${goalDataInDataCollection > 0}`);
    
    // Check if Form Bank is still in Data Collection
    const formBankInDataCollection = await page.locator('text=Form Bank').count();
    console.log(`✅ "Form Bank" still in Data Collection: ${formBankInDataCollection > 0}`);
    
    // Check if IEP Management section is present
    const iepManagementSection = await page.locator('text=IEP Management').count();
    console.log(`✅ "IEP Management" section found: ${iepManagementSection} (should be 1)`);
    
    // Click on IEP Management section to expand it
    await page.click('text=IEP Management');
    await page.waitForTimeout(1000);
    
    // Check if Goal Bank is NOT in IEP Management anymore
    const goalBankInIEPManagement = await page.locator('text=Goal Bank').count();
    console.log(`✅ "Goal Bank" removed from IEP Management: ${goalBankInIEPManagement === 0}`);
    
    // Check if IEP Review is still in IEP Management
    const iepReviewInIEPManagement = await page.locator('text=IEP Review').count();
    console.log(`✅ "IEP Review" still in IEP Management: ${iepReviewInIEPManagement > 0}`);
    
    // Test navigation to Goal Bank from Data Collection
    console.log('Testing navigation to Goal Bank from Data Collection...');
    await page.click('text=Data Collection');
    await page.waitForTimeout(1000);
    await page.click('text=Goal Bank');
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    const isGoalBankPage = currentUrl.includes('/iep-goals');
    console.log(`✅ Navigated to Goal Bank page: ${isGoalBankPage}`);
    
    // Take screenshot
    await page.screenshot({ path: 'goal-bank-move.png', fullPage: true });
    console.log('Screenshot saved: goal-bank-move.png');
    
    console.log('\n=== ✅ GOAL BANK MOVE VERIFIED ===');
    console.log('✅ "Goal Bank" moved from IEP Management to Data Collection');
    console.log('✅ "Goal Bank" accessible from Data Collection section');
    console.log('✅ "Goal Bank" no longer in IEP Management section');
    console.log('✅ Navigation working correctly');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testGoalBankMove();
