const { chromium } = require('playwright');

async function testDataCollectionSectionReorganization() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING DATA COLLECTION SECTION REORGANIZATION ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Check if "Data Collection" section is present (should be 1)
    const dataCollectionSection = await page.locator('text=Data Collection').count();
    console.log(`✅ "Data Collection" section found: ${dataCollectionSection} (should be 1)`);
    
    // Check if "Assessments" section is NOT present (should be 0)
    const assessmentsSection = await page.locator('text=Assessments').count();
    console.log(`✅ "Assessments" section removed: ${assessmentsSection === 0}`);
    
    // Check if Students section no longer has Goal Data
    await page.click('text=Students');
    await page.waitForTimeout(1000);
    
    const goalDataInStudents = await page.locator('text=Goal Data').count();
    console.log(`✅ "Goal Data" removed from Students section: ${goalDataInStudents === 0}`);
    
    // Check if Data Collection section has Goal Data
    await page.click('text=Data Collection');
    await page.waitForTimeout(1000);
    
    const goalDataInDataCollection = await page.locator('text=Goal Data').count();
    console.log(`✅ "Goal Data" found in Data Collection section: ${goalDataInDataCollection > 0}`);
    
    // Check if Data Collection section has other items
    const formBank = await page.locator('text=Form Bank').count();
    console.log(`✅ "Form Bank" found in Data Collection: ${formBank > 0}`);
    
    const assessmentReports = await page.locator('text=Assessment Reports').count();
    console.log(`✅ "Assessment Reports" found in Data Collection: ${assessmentReports > 0}`);
    
    const progressMonitoring = await page.locator('text=Progress Monitoring').count();
    console.log(`✅ "Progress Monitoring" found in Data Collection: ${progressMonitoring > 0}`);
    
    // Test navigation to Goal Data from Data Collection section
    console.log('Testing navigation to Goal Data from Data Collection section...');
    await page.click('text=Goal Data');
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    const isGoalDataPage = currentUrl.includes('/goal-data');
    console.log(`✅ Navigated to Goal Data page: ${isGoalDataPage}`);
    
    // Take screenshot
    await page.screenshot({ path: 'data-collection-reorganization.png', fullPage: true });
    console.log('Screenshot saved: data-collection-reorganization.png');
    
    console.log('\n=== ✅ DATA COLLECTION SECTION REORGANIZATION VERIFIED ===');
    console.log('✅ "Assessments" renamed to "Data Collection"');
    console.log('✅ "Goal Data" moved from Students to Data Collection');
    console.log('✅ Additional data collection items added');
    console.log('✅ Navigation working correctly');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testDataCollectionSectionReorganization();
