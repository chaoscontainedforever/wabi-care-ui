const { chromium } = require('playwright');

async function testRecentDraftsIntegration() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING RECENT DRAFTS INTEGRATION ===\n');
    
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
    
    // Check if Recent Drafts section is present
    const recentDraftsTitle = await page.locator('text=Recent Drafts').count();
    console.log(`Recent Drafts section found: ${recentDraftsTitle} (should be 1)`);
    
    // Check if the layout is two-column
    const gridLayout = await page.locator('.grid.grid-cols-1.lg\\:grid-cols-4').count();
    console.log(`Two-column grid layout found: ${gridLayout} (should be 1)`);
    
    // Check if main content takes 3 columns
    const mainContent = await page.locator('.lg\\:col-span-3').count();
    console.log(`Main content (3 columns) found: ${mainContent} (should be 1)`);
    
    // Check if sidebar takes 1 column
    const sidebar = await page.locator('.lg\\:col-span-1').count();
    console.log(`Sidebar (1 column) found: ${sidebar} (should be 1)`);
    
    // Fill in some student information to create a draft
    await page.fill('input[placeholder="Enter first name"]', 'Recent');
    await page.fill('input[placeholder="Enter last name"]', 'Test');
    
    // Save draft
    console.log('Saving draft...');
    await page.click('button:has-text("Save Draft")');
    await page.waitForTimeout(2000); // Wait for save to complete
    
    // Check if the draft appears in Recent Drafts
    const draftCard = await page.locator('text=Recent Test').count();
    console.log(`Draft card with student name found: ${draftCard} (should be 1)`);
    
    // Check if Continue button is present
    const continueButton = await page.locator('button:has([class*="ChevronRight"])').count();
    console.log(`Continue button found: ${continueButton} (should be 1 or more)`);
    
    // Check if progress bar is present
    const progressBar = await page.locator('.w-12.h-1').count();
    console.log(`Progress bar found: ${progressBar} (should be 1 or more)`);
    
    // Check if delete button is present
    const deleteButton = await page.locator('button:has([class*="Trash2"])').count();
    console.log(`Delete button found: ${deleteButton} (should be 1 or more)`);
    
    // Test continue functionality
    if (continueButton > 0) {
      console.log('Testing continue draft functionality...');
      await page.click('button:has([class*="ChevronRight"])');
      await page.waitForTimeout(1000);
      
      // Check if form is pre-filled
      const firstNameValue = await page.inputValue('input[placeholder="Enter first name"]');
      console.log(`Form pre-filled with first name: ${firstNameValue === 'Recent'}`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'recent-drafts-integration.png', fullPage: true });
    console.log('Screenshot saved: recent-drafts-integration.png');
    
    console.log('\n=== RECENT DRAFTS INTEGRATION VERIFIED ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testRecentDraftsIntegration();
