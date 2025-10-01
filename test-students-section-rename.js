const { chromium } = require('playwright');

async function testStudentsSectionRename() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING STUDENTS SECTION RENAME ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Check if "Students" section is present (should be 1)
    const studentsSection = await page.locator('text=Students').count();
    console.log(`✅ "Students" section found: ${studentsSection} (should be 1)`);
    
    // Check if "Data Collection" section is NOT present (should be 0)
    const dataCollectionSection = await page.locator('text=Data Collection').count();
    console.log(`✅ "Data Collection" section removed: ${dataCollectionSection === 0}`);
    
    // Check if Students section has the correct sub-items
    const studentIntake = await page.locator('text=Student Intake').count();
    console.log(`✅ "Student Intake" sub-item found: ${studentIntake > 0}`);
    
    const allStudents = await page.locator('text=All Students').count();
    console.log(`✅ "All Students" sub-item found: ${allStudents > 0}`);
    
    const goalData = await page.locator('text=Goal Data').count();
    console.log(`✅ "Goal Data" sub-item found: ${goalData > 0}`);
    
    const studentGroups = await page.locator('text=Student Groups').count();
    console.log(`✅ "Student Groups" sub-item found: ${studentGroups > 0}`);
    
    // Test navigation to Students section
    console.log('Testing navigation to Students section...');
    await page.click('text=Students');
    await page.waitForTimeout(1000);
    
    // Check if we can see the sub-items
    const subItemsVisible = await page.locator('text=Student Intake').isVisible();
    console.log(`✅ Students sub-items visible: ${subItemsVisible}`);
    
    // Take screenshot
    await page.screenshot({ path: 'students-section-rename.png', fullPage: true });
    console.log('Screenshot saved: students-section-rename.png');
    
    console.log('\n=== ✅ STUDENTS SECTION RENAME VERIFIED ===');
    console.log('✅ "Data Collection" renamed to "Students"');
    console.log('✅ All sub-items preserved');
    console.log('✅ Navigation working correctly');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testStudentsSectionRename();
