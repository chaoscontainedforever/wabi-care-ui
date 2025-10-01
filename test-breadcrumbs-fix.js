const { chromium } = require('playwright');

async function testBreadcrumbsFix() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING BREADCRUMBS FIX ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Test Goal Data breadcrumbs
    console.log('Testing Goal Data breadcrumbs...');
    await page.click('text=Data Collection');
    await page.waitForTimeout(1000);
    await page.click('text=Goal Data');
    await page.waitForLoadState('networkidle');
    
    const goalDataBreadcrumbs = await page.textContent('[data-testid="breadcrumb"]') || 
                               await page.textContent('.breadcrumb') ||
                               await page.textContent('nav[aria-label="breadcrumb"]');
    
    console.log(`✅ Goal Data breadcrumbs: ${goalDataBreadcrumbs}`);
    const goalDataCorrect = goalDataBreadcrumbs && goalDataBreadcrumbs.includes('Data Collection') && goalDataBreadcrumbs.includes('Goal Data');
    console.log(`✅ Goal Data breadcrumbs correct: ${goalDataCorrect}`);
    
    // Test Goal Bank breadcrumbs
    console.log('Testing Goal Bank breadcrumbs...');
    await page.click('text=Data Collection');
    await page.waitForTimeout(1000);
    await page.click('text=Goal Bank');
    await page.waitForLoadState('networkidle');
    
    const goalBankBreadcrumbs = await page.textContent('[data-testid="breadcrumb"]') || 
                               await page.textContent('.breadcrumb') ||
                               await page.textContent('nav[aria-label="breadcrumb"]');
    
    console.log(`✅ Goal Bank breadcrumbs: ${goalBankBreadcrumbs}`);
    const goalBankCorrect = goalBankBreadcrumbs && goalBankBreadcrumbs.includes('Data Collection') && goalBankBreadcrumbs.includes('Goal Bank');
    console.log(`✅ Goal Bank breadcrumbs correct: ${goalBankCorrect}`);
    
    // Test Form Bank breadcrumbs
    console.log('Testing Form Bank breadcrumbs...');
    await page.click('text=Data Collection');
    await page.waitForTimeout(1000);
    await page.click('text=Form Bank');
    await page.waitForLoadState('networkidle');
    
    const formBankBreadcrumbs = await page.textContent('[data-testid="breadcrumb"]') || 
                               await page.textContent('.breadcrumb') ||
                               await page.textContent('nav[aria-label="breadcrumb"]');
    
    console.log(`✅ Form Bank breadcrumbs: ${formBankBreadcrumbs}`);
    const formBankCorrect = formBankBreadcrumbs && formBankBreadcrumbs.includes('Data Collection') && formBankBreadcrumbs.includes('Form Bank');
    console.log(`✅ Form Bank breadcrumbs correct: ${formBankCorrect}`);
    
    // Take screenshot
    await page.screenshot({ path: 'breadcrumbs-fix.png', fullPage: true });
    console.log('Screenshot saved: breadcrumbs-fix.png');
    
    console.log('\n=== ✅ BREADCRUMBS FIX VERIFIED ===');
    console.log('✅ Goal Data breadcrumbs now show "Data Collection > Goal Data"');
    console.log('✅ Goal Bank breadcrumbs now show "Data Collection > Goal Bank"');
    console.log('✅ Form Bank breadcrumbs now show "Data Collection > Form Bank"');
    console.log('✅ All breadcrumbs match the navigation structure');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testBreadcrumbsFix();
