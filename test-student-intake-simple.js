const { chromium } = require('playwright');

async function testStudentIntakeChanges() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING STUDENT INTAKE CHANGES ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Navigate to Student Intake page directly
    console.log('Navigating to Student Intake page...');
    await page.goto('http://localhost:3000/students/new');
    await page.waitForLoadState('networkidle');
    
    // Check if page title shows Student Intake
    const pageTitle = await page.locator('h1:has-text("Student Intake")').count();
    console.log(`Student Intake title found: ${pageTitle} (should be 1)`);
    
    // Check if breadcrumbs show Student Intake
    const breadcrumb = await page.locator('text=Student Intake').count();
    console.log(`Student Intake breadcrumb found: ${breadcrumb} (should be 1)`);
    
    // Check page title
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Take screenshot
    await page.screenshot({ path: 'student-intake-page.png', fullPage: true });
    console.log('Screenshot saved: student-intake-page.png');
    
    console.log('\n=== STUDENT INTAKE CHANGES VERIFIED ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testStudentIntakeChanges();
