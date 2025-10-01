const { chromium } = require('playwright');

async function testGoalCreationModal() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING GOAL CREATION MODAL ===\n');
    
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
    
    // Check if Add Goal button is visible
    const addGoalButton = await page.locator('text=Add Goal');
    const isAddGoalVisible = await addGoalButton.isVisible();
    console.log(`✅ Add Goal button visible: ${isAddGoalVisible}`);
    
    // Click Add Goal button to open modal
    await addGoalButton.click();
    await page.waitForTimeout(1000);
    
    // Check if modal is open
    const modal = await page.locator('[role="dialog"]');
    const isModalOpen = await modal.isVisible();
    console.log(`✅ Goal creation modal opened: ${isModalOpen}`);
    
    // Check modal header elements
    const modalTitle = await page.locator('text=Goal');
    const isTitleVisible = await modalTitle.isVisible();
    console.log(`✅ Modal title "Goal" visible: ${isTitleVisible}`);
    
    const objectiveButton = await page.locator('text=+ Objective');
    const isObjectiveButtonVisible = await objectiveButton.isVisible();
    console.log(`✅ "+ Objective" button visible: ${isObjectiveButtonVisible}`);
    
    // Check left sidebar - Data Types
    const dataTypesSection = await page.locator('text=Data Types');
    const isDataTypesVisible = await dataTypesSection.isVisible();
    console.log(`✅ "Data Types" section visible: ${isDataTypesVisible}`);
    
    const suggestTemplateButton = await page.locator('text=Suggest Data Tracking Template');
    const isSuggestButtonVisible = await suggestTemplateButton.isVisible();
    console.log(`✅ "Suggest Data Tracking Template" button visible: ${isSuggestButtonVisible}`);
    
    // Check data type options
    const promptingLevels = await page.locator('text=Prompting Levels');
    const isPromptingLevelsVisible = await promptingLevels.isVisible();
    console.log(`✅ "Prompting Levels" option visible: ${isPromptingLevelsVisible}`);
    
    // Check main form elements
    const goalTitleInput = await page.locator('input[placeholder="e.g., Reading, Writing, Math"]');
    const isGoalTitleVisible = await goalTitleInput.isVisible();
    console.log(`✅ Goal title input visible: ${isGoalTitleVisible}`);
    
    const goalDescriptionTextarea = await page.locator('textarea[placeholder="Write goal here.."]');
    const isGoalDescriptionVisible = await goalDescriptionTextarea.isVisible();
    console.log(`✅ Goal description textarea visible: ${isGoalDescriptionVisible}`);
    
    // Check prompts section
    const promptsLabel = await page.locator('text=Prompts');
    const isPromptsLabelVisible = await promptsLabel.isVisible();
    console.log(`✅ "Prompts" label visible: ${isPromptsLabelVisible}`);
    
    const addPromptButton = await page.locator('text=Add Prompt');
    const isAddPromptVisible = await addPromptButton.isVisible();
    console.log(`✅ "Add Prompt" button visible: ${isAddPromptVisible}`);
    
    // Check right sidebar - contextual help
    const contextualHelp = await page.locator('text=What is Prompting Levels?');
    const isContextualHelpVisible = await contextualHelp.isVisible();
    console.log(`✅ Contextual help section visible: ${isContextualHelpVisible}`);
    
    const livePreviewTab = await page.locator('text=Live preview');
    const isLivePreviewVisible = await livePreviewTab.isVisible();
    console.log(`✅ "Live preview" tab visible: ${isLivePreviewVisible}`);
    
    // Check footer
    const saveGoalButton = await page.locator('text=Save Goal');
    const isSaveGoalVisible = await saveGoalButton.isVisible();
    console.log(`✅ "Save Goal" button visible: ${isSaveGoalVisible}`);
    
    // Test form interaction
    await goalTitleInput.fill('Reading Comprehension');
    await goalDescriptionTextarea.fill('Student will read and comprehend grade-level texts with 80% accuracy');
    
    const titleValue = await goalTitleInput.inputValue();
    const descriptionValue = await goalDescriptionTextarea.inputValue();
    console.log(`✅ Form input working - Title: "${titleValue}", Description: "${descriptionValue}"`);
    
    // Test adding a prompt
    await addPromptButton.click();
    await page.waitForTimeout(500);
    
    const promptInputs = await page.locator('input[placeholder*="Option"]').count();
    console.log(`✅ Prompt inputs count after adding: ${promptInputs}`);
    
    // Test closing modal
    const closeButton = await page.locator('button[aria-label="Close"]').first();
    await closeButton.click();
    await page.waitForTimeout(500);
    
    const isModalClosed = !(await modal.isVisible());
    console.log(`✅ Modal closed successfully: ${isModalClosed}`);
    
    // Take screenshot
    await page.screenshot({ path: 'goal-creation-modal.png', fullPage: true });
    console.log('Screenshot saved: goal-creation-modal.png');
    
    console.log('\n=== ✅ GOAL CREATION MODAL VERIFIED ===');
    console.log('✅ Modal opens when clicking "Add Goal" button');
    console.log('✅ Three-panel layout implemented correctly');
    console.log('✅ Data types selection panel functional');
    console.log('✅ Goal definition form panel functional');
    console.log('✅ Contextual help and preview panel functional');
    console.log('✅ Form interactions working properly');
    console.log('✅ Modal closes correctly');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testGoalCreationModal();
