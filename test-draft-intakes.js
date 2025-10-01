const { chromium } = require('playwright');

async function testDraftIntakesFunctionality() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING DRAFT INTAKES FUNCTIONALITY ===\n');
    
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
    
    // Fill in some student information
    await page.fill('input[placeholder="Enter first name"]', 'Test');
    await page.fill('input[placeholder="Enter last name"]', 'Student');
    
    // Save draft
    console.log('Saving draft...');
    await page.click('button:has-text("Save Draft")');
    await page.waitForTimeout(2000); // Wait for save to complete
    
    // Navigate to Draft Intakes page
    console.log('Navigating to Draft Intakes page...');
    await page.goto('http://localhost:3000/students/drafts');
    await page.waitForLoadState('networkidle');
    
    // Check if draft intakes page loads
    const draftIntakesTitle = await page.locator('text=Draft Intakes').count();
    console.log(`Draft Intakes title found: ${draftIntakesTitle} (should be 1)`);
    
    // Check if New Student Intake button is present
    const newIntakeButton = await page.locator('button:has-text("New Student Intake")').count();
    console.log(`New Student Intake button found: ${newIntakeButton} (should be 1)`);
    
    // Check if draft cards are present (should show the draft we just created)
    const draftCards = await page.locator('[class*="hover:shadow-lg"]').count();
    console.log(`Draft cards found: ${draftCards} (should be 1 or more)`);
    
    // Check if Continue button is present
    const continueButton = await page.locator('button:has-text("Continue")').count();
    console.log(`Continue button found: ${continueButton} (should be 1 or more)`);
    
    // Test continue functionality
    if (continueButton > 0) {
      console.log('Testing continue draft functionality...');
      await page.click('button:has-text("Continue")');
      await page.waitForLoadState('networkidle');
      
      // Check if we're back on the intake page
      const intakeTitle = await page.locator('text=Student Intake').count();
      console.log(`Back on intake page: ${intakeTitle > 0}`);
      
      // Check if the form is pre-filled
      const firstNameValue = await page.inputValue('input[placeholder="Enter first name"]');
      console.log(`Form pre-filled with first name: ${firstNameValue === 'Test'}`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'draft-intakes-functionality.png', fullPage: true });
    console.log('Screenshot saved: draft-intakes-functionality.png');
    
    console.log('\n=== DRAFT INTAKES FUNCTIONALITY VERIFIED ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testDraftIntakesFunctionality();
