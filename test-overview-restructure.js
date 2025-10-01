const { chromium } = require('playwright');

async function testStudentOverviewRestructure() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING STUDENT OVERVIEW RESTRUCTURE ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Navigate to Student Overview page
    console.log('Navigating to Student Overview page...');
    await page.goto('http://localhost:3000/student-overview');
    await page.waitForLoadState('networkidle');
    
    // Check if caseload sidebar is present
    const caseloadTitle = await page.locator('text=Caseload').count();
    console.log(`Caseload title found: ${caseloadTitle} (should be 1)`);
    
    // Check if search functionality is present
    const searchInput = await page.locator('input[placeholder="Search student..."]').count();
    console.log(`Search input found: ${searchInput} (should be 1)`);
    
    // Check if Add Student button is present
    const addStudentButton = await page.locator('button:has-text("Add Student")').count();
    console.log(`Add Student button found: ${addStudentButton} (should be 1)`);
    
    // Check if student list is present
    const studentList = await page.locator('[class*="space-y-2"]').count();
    console.log(`Student list container found: ${studentList} (should be 1)`);
    
    // Check if tabs are present
    const profileTab = await page.locator('text=Profile').count();
    console.log(`Profile tab found: ${profileTab} (should be 1)`);
    
    const goalsTab = await page.locator('text=Goals').count();
    console.log(`Goals tab found: ${goalsTab} (should be 1)`);
    
    // Check if two-column layout is present
    const leftColumn = await page.locator('.w-80').count();
    console.log(`Left sidebar column found: ${leftColumn} (should be 1)`);
    
    const rightColumn = await page.locator('.flex-1').count();
    console.log(`Right content column found: ${rightColumn} (should be 1)`);
    
    // Take screenshot
    await page.screenshot({ path: 'student-overview-restructured.png', fullPage: true });
    console.log('Screenshot saved: student-overview-restructured.png');
    
    console.log('\n=== STUDENT OVERVIEW RESTRUCTURE VERIFIED ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testStudentOverviewRestructure();
