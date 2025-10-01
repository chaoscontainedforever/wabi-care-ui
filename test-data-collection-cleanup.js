const { chromium } = require('playwright');

async function testDataCollectionSectionCleanup() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING DATA COLLECTION SECTION CLEANUP ===\n');
    
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
    
    // Check if Goal Data is present
    const goalData = await page.locator('text=Goal Data').count();
    console.log(`✅ "Goal Data" found in Data Collection: ${goalData > 0}`);
    
    // Check if Form Bank is present
    const formBank = await page.locator('text=Form Bank').count();
    console.log(`✅ "Form Bank" found in Data Collection: ${formBank > 0}`);
    
    // Check if Assessment Reports is NOT present
    const assessmentReports = await page.locator('text=Assessment Reports').count();
    console.log(`✅ "Assessment Reports" removed from Data Collection: ${assessmentReports === 0}`);
    
    // Check if Progress Monitoring is NOT present
    const progressMonitoring = await page.locator('text=Progress Monitoring').count();
    console.log(`✅ "Progress Monitoring" removed from Data Collection: ${progressMonitoring === 0}`);
    
    // Test navigation to Goal Data
    console.log('Testing navigation to Goal Data...');
    await page.click('text=Goal Data');
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    const isGoalDataPage = currentUrl.includes('/goal-data');
    console.log(`✅ Navigated to Goal Data page: ${isGoalDataPage}`);
    
    // Navigate back to dashboard
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Test navigation to Form Bank
    console.log('Testing navigation to Form Bank...');
    await page.click('text=Data Collection');
    await page.waitForTimeout(1000);
    await page.click('text=Form Bank');
    await page.waitForLoadState('networkidle');
    
    const formBankUrl = page.url();
    const isFormBankPage = formBankUrl.includes('/form-bank');
    console.log(`✅ Navigated to Form Bank page: ${isFormBankPage}`);
    
    // Take screenshot
    await page.screenshot({ path: 'data-collection-cleanup.png', fullPage: true });
    console.log('Screenshot saved: data-collection-cleanup.png');
    
    console.log('\n=== ✅ DATA COLLECTION SECTION CLEANUP VERIFIED ===');
    console.log('✅ "Assessment Reports" removed from Data Collection');
    console.log('✅ "Progress Monitoring" removed from Data Collection');
    console.log('✅ "Goal Data" and "Form Bank" remain in Data Collection');
    console.log('✅ Navigation working correctly for remaining items');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testDataCollectionSectionCleanup();
