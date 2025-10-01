const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Testing responsive chat behavior...');
    
    // Navigate to dashboard
    await page.goto('http://localhost:3001/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check if floating button is visible
    const button = await page.locator('button[class*="fixed top-4 right-2"]');
    await button.waitFor({ timeout: 5000 });
    console.log('✅ Floating button is visible');
    
    // Click to expand chat
    await button.click();
    await page.waitForTimeout(1000);
    
    // Check if chat card is visible
    const chatCard = await page.locator('div[class*="fixed top-2 right-2"]');
    await chatCard.waitFor({ timeout: 5000 });
    console.log('✅ Chat card expanded');
    
    // Check if main content has responsive margin
    const mainContent = await page.locator('main[class*="relative flex w-full flex-1 flex-col bg-background"]');
    const marginRight = await mainContent.evaluate(el => {
      return window.getComputedStyle(el).marginRight;
    });
    
    console.log(`📏 Main content marginRight: ${marginRight}`);
    
    if (marginRight !== '0px') {
      console.log('✅ Main content is responsive - marginRight applied');
    } else {
      console.log('❌ Main content not responsive - no marginRight');
    }
    
    // Test on another page
    console.log('🔄 Testing on data collection page...');
    await page.goto('http://localhost:3001/data-collection');
    await page.waitForLoadState('networkidle');
    
    // Check if button is still visible
    const button2 = await page.locator('button[class*="fixed top-4 right-2"]');
    await button2.waitFor({ timeout: 5000 });
    console.log('✅ Floating button visible on data collection page');
    
    // Click to expand
    await button2.click();
    await page.waitForTimeout(1000);
    
    // Check responsive behavior
    const mainContent2 = await page.locator('main[class*="relative flex w-full flex-1 flex-col bg-background"]');
    const marginRight2 = await mainContent2.evaluate(el => {
      return window.getComputedStyle(el).marginRight;
    });
    
    console.log(`📏 Data collection marginRight: ${marginRight2}`);
    
    if (marginRight2 !== '0px') {
      console.log('✅ Data collection page is responsive');
    } else {
      console.log('❌ Data collection page not responsive');
    }
    
    console.log('🎉 Responsive chat test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
