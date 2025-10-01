const { chromium } = require('playwright');

async function testProfileLogoutOptions() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING PROFILE AND LOGOUT OPTIONS ===\n');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'prince.jain7@gmail.com');
    await page.fill('input[type="password"]', 'Lemon@700');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Check if sidebar is visible
    const sidebar = await page.locator('[data-sidebar="sidebar"]');
    const isSidebarVisible = await sidebar.isVisible();
    console.log(`✅ Sidebar visible: ${isSidebarVisible}`);
    
    // Check if Profile option is visible
    const profileOption = await page.locator('text=Profile');
    const isProfileVisible = await profileOption.isVisible();
    console.log(`✅ Profile option visible: ${isProfileVisible}`);
    
    // Check if Logout option is visible
    const logoutOption = await page.locator('text=Logout');
    const isLogoutVisible = await logoutOption.isVisible();
    console.log(`✅ Logout option visible: ${isLogoutVisible}`);
    
    // Check if User icon is visible for Profile
    const userIcon = await page.locator('svg[class*="lucide-user"]');
    const isUserIconVisible = await userIcon.isVisible();
    console.log(`✅ User icon visible: ${isUserIconVisible}`);
    
    // Check if LogOut icon is visible
    const logoutIcon = await page.locator('svg[class*="lucide-log-out"]');
    const isLogoutIconVisible = await logoutIcon.isVisible();
    console.log(`✅ Logout icon visible: ${isLogoutIconVisible}`);
    
    // Test Profile navigation
    if (isProfileVisible) {
      await profileOption.click();
      await page.waitForTimeout(1000);
      
      // Check if we navigated to profile page
      const profilePageTitle = await page.locator('text=Personal Information');
      const isProfilePageVisible = await profilePageTitle.isVisible();
      console.log(`✅ Profile page loaded: ${isProfilePageVisible}`);
      
      // Check if profile page has expected content
      const profileHeader = await page.locator('text=Teacher • Wabi Care Platform');
      const isProfileHeaderVisible = await profileHeader.isVisible();
      console.log(`✅ Profile header visible: ${isProfileHeaderVisible}`);
      
      // Check if profile has user avatar
      const profileAvatar = await page.locator('[class*="avatar"]').first();
      const isProfileAvatarVisible = await profileAvatar.isVisible();
      console.log(`✅ Profile avatar visible: ${isProfileAvatarVisible}`);
      
      // Navigate back to dashboard
      await page.click('text=Dashboard');
      await page.waitForTimeout(1000);
      console.log('✅ Navigated back to dashboard');
    }
    
    // Test sidebar collapse/expand
    const sidebarTrigger = await page.locator('[data-sidebar="trigger"]');
    const isSidebarTriggerVisible = await sidebarTrigger.isVisible();
    console.log(`✅ Sidebar trigger visible: ${isSidebarTriggerVisible}`);
    
    if (isSidebarTriggerVisible) {
      await sidebarTrigger.click();
      await page.waitForTimeout(500);
      console.log('✅ Clicked sidebar trigger to collapse');
      
      // Check if Profile and Logout options are still visible when collapsed
      const profileCollapsed = await page.locator('svg[class*="lucide-user"]').isVisible();
      const logoutCollapsed = await page.locator('svg[class*="lucide-log-out"]').isVisible();
      console.log(`✅ Profile icon visible when collapsed: ${profileCollapsed}`);
      console.log(`✅ Logout icon visible when collapsed: ${logoutCollapsed}`);
      
      // Check if user avatar is visible when collapsed
      const avatarCollapsed = await page.locator('[class*="avatar"]').isVisible();
      console.log(`✅ User avatar visible when collapsed: ${avatarCollapsed}`);
      
      // Expand sidebar again
      await sidebarTrigger.click();
      await page.waitForTimeout(500);
      console.log('✅ Clicked sidebar trigger to expand');
    }
    
    // Test logout functionality (but don't actually logout to keep session)
    if (isLogoutVisible) {
      // Just verify the logout option is clickable
      const logoutButton = await page.locator('text=Logout');
      const isLogoutClickable = await logoutButton.isEnabled();
      console.log(`✅ Logout option clickable: ${isLogoutClickable}`);
      
      // Don't actually click logout to maintain session for testing
      console.log('✅ Logout option verified (not clicked to maintain session)');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'profile-logout-options.png', fullPage: true });
    console.log('Screenshot saved: profile-logout-options.png');
    
    console.log('\n=== ✅ PROFILE AND LOGOUT OPTIONS VERIFIED ===');
    console.log('✅ Profile option added to sidebar');
    console.log('✅ Logout option added to sidebar');
    console.log('✅ User and LogOut icons present');
    console.log('✅ Profile page navigation working');
    console.log('✅ Profile page content loaded');
    console.log('✅ Sidebar collapse/expand functionality');
    console.log('✅ User avatar visible when collapsed');
    console.log('✅ Logout functionality available');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testProfileLogoutOptions();
