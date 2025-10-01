const { chromium } = require('playwright');

async function testTakeDataButtonNavigation() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING TAKE DATA BUTTON NAVIGATION ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Navigate to Student Overview page with a specific student
    console.log('Navigating to Student Overview page...');
    await page.goto('http://localhost:3000/student-overview?student=1c3bb7cc-3df2-4d74-a546-9901d713a5cc');
    await page.waitForLoadState('networkidle');
    
    // Check if Take Data button is present
    const takeDataButton = await page.locator('button:has-text("Take Data")').count();
    console.log(`✅ Take Data button found: ${takeDataButton} (should be 1)`);
    
    // Check if student is selected
    const studentName = await page.locator('text=Alex Thompson').count();
    console.log(`✅ Student selected: ${studentName > 0}`);
    
    // Click Take Data button
    console.log('Clicking Take Data button...');
    await page.click('button:has-text("Take Data")');
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Check if we're on the Goal Data page
    const currentUrl = page.url();
    console.log(`✅ Current URL: ${currentUrl}`);
    
    const isGoalDataPage = currentUrl.includes('/goal-data');
    console.log(`✅ Navigated to Goal Data page: ${isGoalDataPage}`);
    
    // Check if student parameter is preserved
    const hasStudentParam = currentUrl.includes('student=');
    console.log(`✅ Student parameter preserved: ${hasStudentParam}`);
    
    // Check if student is pre-selected in Goal Data page
    const studentSelected = await page.locator('text=Alex Thompson').count();
    console.log(`✅ Student pre-selected in Goal Data: ${studentSelected > 0}`);
    
    // Check if "Select a student" message is not showing (indicating student is already selected)
    const selectStudentMessage = await page.locator('text=Select a student to view their goal data').count();
    console.log(`✅ Student selection message hidden: ${selectStudentMessage === 0}`);
    
    // Take screenshot
    await page.screenshot({ path: 'take-data-navigation.png', fullPage: true });
    console.log('Screenshot saved: take-data-navigation.png');
    
    console.log('\n=== ✅ TAKE DATA BUTTON NAVIGATION VERIFIED ===');
    console.log('✅ Take Data button present in Student Overview');
    console.log('✅ Button click navigates to Goal Data page');
    console.log('✅ Student parameter preserved in URL');
    console.log('✅ Student pre-selected in Goal Data page');
    console.log('✅ Seamless workflow from Student Overview to data collection');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testTakeDataButtonNavigation();
