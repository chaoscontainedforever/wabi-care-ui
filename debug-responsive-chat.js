const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Debugging responsive chat behavior...');
    
    // Navigate to dashboard
    await page.goto('http://localhost:3001/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check if floating button is visible
    const button = await page.locator('button[class*="fixed top-4 right-2"]');
    await button.waitFor({ timeout: 5000 });
    console.log('✅ Floating button is visible');
    
    // Check initial state
    const mainContent = await page.locator('main[class*="relative flex w-full flex-1 flex-col bg-background"]');
    const initialMarginRight = await mainContent.evaluate(el => {
      return window.getComputedStyle(el).marginRight;
    });
    console.log(`📏 Initial marginRight: ${initialMarginRight}`);
    
    // Click to expand chat
    await button.click();
    await page.waitForTimeout(2000); // Wait longer for state to update
    
    // Check if chat card is visible
    const chatCard = await page.locator('div[class*="fixed top-2 right-2"]');
    await chatCard.waitFor({ timeout: 5000 });
    console.log('✅ Chat card expanded');
    
    // Check responsive margin after expansion
    const expandedMarginRight = await mainContent.evaluate(el => {
      return window.getComputedStyle(el).marginRight;
    });
    console.log(`📏 Expanded marginRight: ${expandedMarginRight}`);
    
    // Check chat context state
    const chatContext = await page.evaluate(() => {
      // Try to access the chat context from the window or React dev tools
      return window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ? 'Dev tools available' : 'No dev tools';
    });
    console.log(`🔧 React dev tools: ${chatContext}`);
    
    // Check if the style attribute is being set
    const styleAttribute = await mainContent.evaluate(el => {
      return el.getAttribute('style');
    });
    console.log(`🎨 Style attribute: ${styleAttribute}`);
    
    // Check if the chat context hook is working
    const chatState = await page.evaluate(() => {
      // Look for any elements that might indicate chat state
      const chatElements = document.querySelectorAll('[class*="fixed top-2 right-2"]');
      return chatElements.length > 0 ? 'Chat expanded' : 'Chat collapsed';
    });
    console.log(`💬 Chat state: ${chatState}`);
    
    if (expandedMarginRight !== '0px') {
      console.log('✅ Dashboard page is responsive');
    } else {
      console.log('❌ Dashboard page not responsive - investigating...');
      
      // Check if PageLayout is being used
      const pageLayoutElements = await page.locator('[class*="PageLayout"]').count();
      console.log(`📄 PageLayout elements found: ${pageLayoutElements}`);
      
      // Check if useChatAssistant hook is working
      const chatHookElements = await page.locator('[data-chat-assistant]').count();
      console.log(`🎣 Chat hook elements: ${chatHookElements}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
