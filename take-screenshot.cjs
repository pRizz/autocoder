const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('http://localhost:3000/projects/open-autocoder');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: '.playwright-mcp/current-state-screenshot.png', fullPage: true });
  console.log('Screenshot saved to .playwright-mcp/current-state-screenshot.png');
  await browser.close();
})();
