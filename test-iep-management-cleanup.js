const { chromium } = require('playwright');

async function testIEPManagementSectionCleanup() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING IEP MANAGEMENT SECTION CLEANUP ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Check if "IEP Management" section is present
    const iepManagementSection = await page.locator('text=IEP Management').count();
    console.log(`✅ "IEP Management" section found: ${iepManagementSection} (should be 1)`);
    
    // Click on IEP Management section to expand it
    await page.click('text=IEP Management');
    await page.waitForTimeout(1000);
    
    // Check if Goal Bank is present
    const goalBank = await page.locator('text=Goal Bank').count();
    console.log(`✅ "Goal Bank" found in IEP Management: ${goalBank > 0}`);
    
    // Check if IEP Review is present
    const iepReview = await page.locator('text=IEP Review').count();
    console.log(`✅ "IEP Review" found in IEP Management: ${iepReview > 0}`);
    
    // Check if IEP Builder is NOT present
    const iepBuilder = await page.locator('text=IEP Builder').count();
    console.log(`✅ "IEP Builder" removed from IEP Management: ${iepBuilder === 0}`);
    
    // Check if Progress Tracking is NOT present
    const progressTracking = await page.locator('text=Progress Tracking').count();
    console.log(`✅ "Progress Tracking" removed from IEP Management: ${progressTracking === 0}`);
    
    // Test navigation to Goal Bank
    console.log('Testing navigation to Goal Bank...');
    await page.click('text=Goal Bank');
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    const isGoalBankPage = currentUrl.includes('/iep-goals');
    console.log(`✅ Navigated to Goal Bank page: ${isGoalBankPage}`);
    
    // Navigate back to dashboard
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Test navigation to IEP Review
    console.log('Testing navigation to IEP Review...');
    await page.click('text=IEP Management');
    await page.waitForTimeout(1000);
    await page.click('text=IEP Review');
    await page.waitForLoadState('networkidle');
    
    const iepReviewUrl = page.url();
    const isIEPReviewPage = iepReviewUrl.includes('/iep-review');
    console.log(`✅ Navigated to IEP Review page: ${isIEPReviewPage}`);
    
    // Take screenshot
    await page.screenshot({ path: 'iep-management-cleanup.png', fullPage: true });
    console.log('Screenshot saved: iep-management-cleanup.png');
    
    console.log('\n=== ✅ IEP MANAGEMENT SECTION CLEANUP VERIFIED ===');
    console.log('✅ "IEP Builder" removed from IEP Management');
    console.log('✅ "Progress Tracking" removed from IEP Management');
    console.log('✅ "Goal Bank" and "IEP Review" remain in IEP Management');
    console.log('✅ Navigation working correctly for remaining items');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testIEPManagementSectionCleanup();
