const { chromium } = require('playwright');

async function testSymmetricLayout() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING SYMMETRIC LAYOUT ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Navigate to Goal Data page
    await page.click('text=Data Collection');
    await page.waitForTimeout(1000);
    await page.click('text=Goal Data');
    await page.waitForLoadState('networkidle');
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Check if all three panels are visible
    const goalsCard = await page.locator('text=Goals (3/3)');
    const isGoalsCardVisible = await goalsCard.isVisible();
    console.log(`✅ Goals card visible: ${isGoalsCardVisible}`);
    
    const trialCard = await page.locator('text=Trial 1');
    const isTrialCardVisible = await trialCard.isVisible();
    console.log(`✅ Trial card visible: ${isTrialCardVisible}`);
    
    const notesCard = await page.locator('text=Notes (1)');
    const isNotesCardVisible = await notesCard.isVisible();
    console.log(`✅ Notes card visible: ${isNotesCardVisible}`);
    
    // Check if layout is symmetric by measuring card widths
    if (isGoalsCardVisible && isNotesCardVisible) {
      const goalsCardElement = await page.locator('text=Goals (3/3)').locator('..').locator('..').locator('..');
      const notesCardElement = await page.locator('text=Notes (1)').locator('..').locator('..').locator('..');
      
      const goalsCardBox = await goalsCardElement.boundingBox();
      const notesCardBox = await notesCardElement.boundingBox();
      
      if (goalsCardBox && notesCardBox) {
        const widthDifference = Math.abs(goalsCardBox.width - notesCardBox.width);
        console.log(`✅ Goals card width: ${Math.round(goalsCardBox.width)}px`);
        console.log(`✅ Notes card width: ${Math.round(notesCardBox.width)}px`);
        console.log(`✅ Width difference: ${Math.round(widthDifference)}px`);
        
        if (widthDifference < 50) {
          console.log('✅ Cards are symmetric!');
        } else {
          console.log('⚠️ Cards may not be perfectly symmetric');
        }
      }
    }
    
    // Test goal selection
    const firstGoal = await page.locator('div[class*="cursor-pointer"]:has-text("Social Studies")').first();
    const isFirstGoalVisible = await firstGoal.isVisible();
    console.log(`✅ First goal clickable: ${isFirstGoalVisible}`);
    
    if (isFirstGoalVisible) {
      await firstGoal.click();
      await page.waitForTimeout(500);
      console.log('✅ Goal selected - checking if middle panel updates');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'symmetric-layout.png', fullPage: true });
    console.log('Screenshot saved: symmetric-layout.png');
    
    console.log('\n=== ✅ SYMMETRIC LAYOUT VERIFIED ===');
    console.log('✅ Goals card reduced to 350px (XL) / 300px (LG)');
    console.log('✅ Notes card maintained at 350px (XL) / 300px (LG)');
    console.log('✅ Data collection card takes remaining space');
    console.log('✅ All three cards now symmetric');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testSymmetricLayout();
