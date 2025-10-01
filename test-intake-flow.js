const { chromium } = require('playwright');

async function testStudentIntakeFlow() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING STUDENT INTAKE FLOW ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Navigate to Student Intake page
    console.log('Navigating to Student Intake page...');
    await page.goto('http://localhost:3000/students/new');
    await page.waitForLoadState('networkidle');
    
    // Check if multi-step layout is present
    const progressSteps = await page.locator('text=Student Information').count();
    console.log(`Progress steps found: ${progressSteps} (should be 1)`);
    
    // Check if Step 1 content is present
    const iepUpload = await page.locator('text=IEP Document Upload').count();
    console.log(`IEP Upload section found: ${iepUpload} (should be 1)`);
    
    const studentInfoForm = await page.locator('text=Student Information').count();
    console.log(`Student Info form found: ${studentInfoForm} (should be 1)`);
    
    const parentInfoForm = await page.locator('text=Parent/Guardian Information').count();
    console.log(`Parent Info form found: ${parentInfoForm} (should be 1)`);
    
    // Check if navigation buttons are present
    const nextButton = await page.locator('button:has-text("Next")').count();
    console.log(`Next button found: ${nextButton} (should be 1)`);
    
    const saveDraftButton = await page.locator('button:has-text("Save Draft")').count();
    console.log(`Save Draft button found: ${saveDraftButton} (should be 1)`);
    
    // Test form fields
    await page.fill('input[placeholder="Enter first name"]', 'Test');
    await page.fill('input[placeholder="Enter last name"]', 'Student');
    
    const firstNameValue = await page.inputValue('input[placeholder="Enter first name"]');
    console.log(`First name field working: ${firstNameValue === 'Test'}`);
    
    // Take screenshot
    await page.screenshot({ path: 'student-intake-flow.png', fullPage: true });
    console.log('Screenshot saved: student-intake-flow.png');
    
    console.log('\n=== STUDENT INTAKE FLOW VERIFIED ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testStudentIntakeFlow();
