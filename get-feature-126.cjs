/**
 * Feature #126 Verification Script
 *
 * Tests that filter parameters are correctly reflected in URL query params
 * and that the filter state is preserved when opening the URL in a new tab.
 */

const { chromium } = require('playwright');
const path = require('path');

async function verifyFeature126() {
  console.log('Starting Feature #126 verification: Filter parameters in URL');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const screenshotDir = path.join(__dirname, '.playwright-mcp');

  try {
    // Step 1: Navigate directly to kanban page for project open-autocoder
    // The URL structure includes the project name in the path
    console.log('Step 1: Navigating to /kanban for open-autocoder project...');
    await page.goto('http://localhost:3000/kanban');
    await page.waitForTimeout(2000); // Wait for initial load

    // Take debug screenshot
    await page.screenshot({ path: path.join(screenshotDir, 'feature-126-debug-initial.png'), fullPage: false });
    console.log('Debug screenshot saved');

    // Wait for category filter to appear
    await page.waitForSelector('#category-filter', { timeout: 15000 });

    // Wait for features to load - the dropdown should have more than just "All Categories"
    console.log('Waiting for categories to load...');
    await page.waitForFunction(() => {
      const select = document.querySelector('#category-filter');
      return select && select.querySelectorAll('option').length > 1;
    }, { timeout: 20000 });

    // Take screenshot of initial state
    await page.screenshot({ path: path.join(screenshotDir, 'feature-126-step1-initial-state.png'), fullPage: false });
    console.log('Screenshot saved: feature-126-step1-initial-state.png');

    const initialUrl = page.url();
    console.log(`Initial URL: ${initialUrl}`);

    // Step 2: Find the category dropdown and get available options
    console.log('Step 2: Finding category dropdown and available categories...');
    const categoryOptions = await page.$$eval('#category-filter option', options =>
      options.map(opt => ({ value: opt.value, text: opt.textContent }))
    );
    console.log('Available categories:', categoryOptions);

    // Select a non-empty category (skip "All Categories" which has empty value)
    const nonEmptyCategories = categoryOptions.filter(opt => opt.value !== '');
    if (nonEmptyCategories.length === 0) {
      throw new Error('No categories available to filter by');
    }

    const selectedCategory = nonEmptyCategories[0].value;
    console.log(`Selecting category: "${selectedCategory}"`);

    // Step 3: Apply the category filter
    await page.selectOption('#category-filter', selectedCategory);
    await page.waitForTimeout(500); // Wait for URL update and data fetch

    // Take screenshot showing filtered results and URL
    await page.screenshot({ path: path.join(screenshotDir, 'feature-126-step3-category-filter-applied.png'), fullPage: false });
    console.log('Screenshot saved: feature-126-step3-category-filter-applied.png');

    // Step 4: Verify URL contains ?category=...
    const urlAfterFilter = page.url();
    console.log(`URL after filter: ${urlAfterFilter}`);

    const urlObj = new URL(urlAfterFilter);
    const categoryParam = urlObj.searchParams.get('category');
    console.log(`Category param in URL: ${categoryParam}`);

    if (categoryParam !== selectedCategory) {
      throw new Error(`Expected URL to contain category=${selectedCategory}, but got category=${categoryParam}`);
    }
    console.log('PASS: URL contains correct category parameter');

    // Step 5: Open a new tab with the same URL
    console.log('Step 5: Opening new tab with the same URL...');
    const newPage = await context.newPage();
    await newPage.goto(urlAfterFilter);
    await newPage.waitForSelector('#category-filter', { timeout: 15000 });

    // Wait for the category options to load in the new tab
    console.log('Waiting for categories to load in new tab...');
    await newPage.waitForFunction(() => {
      const select = document.querySelector('#category-filter');
      return select && select.querySelectorAll('option').length > 1;
    }, { timeout: 20000 });

    // Additional wait for the filter state to be applied from URL params
    await newPage.waitForTimeout(1000);

    // Take screenshot of new tab showing filter is applied
    await newPage.screenshot({ path: path.join(screenshotDir, 'feature-126-step5-new-tab-filter-applied.png'), fullPage: false });
    console.log('Screenshot saved: feature-126-step5-new-tab-filter-applied.png');

    // Step 6: Verify the category dropdown shows the selected category in the new tab
    const newTabSelectedCategory = await newPage.$eval('#category-filter', el => el.value);
    console.log(`Category dropdown value in new tab: ${newTabSelectedCategory}`);
    console.log(`New tab URL: ${newPage.url()}`);

    if (newTabSelectedCategory !== selectedCategory) {
      throw new Error(`Expected category dropdown in new tab to show "${selectedCategory}", but got "${newTabSelectedCategory}"`);
    }
    console.log('PASS: New tab has filter already applied from URL parameters');

    // Final verification screenshot
    await newPage.screenshot({ path: path.join(screenshotDir, 'feature-126-verification-complete.png'), fullPage: false });
    console.log('Screenshot saved: feature-126-verification-complete.png');

    console.log('\n=== Feature #126 Verification PASSED ===');
    console.log(`URL with category filter: ${urlAfterFilter}`);
    console.log(`Category parameter: ${categoryParam}`);
    console.log('New tab correctly shows the same filter applied from URL');

    return {
      success: true,
      url: urlAfterFilter,
      categoryParam: categoryParam,
      screenshots: [
        'feature-126-step1-initial-state.png',
        'feature-126-step3-category-filter-applied.png',
        'feature-126-step5-new-tab-filter-applied.png',
        'feature-126-verification-complete.png'
      ]
    };

  } catch (error) {
    console.error('Feature #126 verification FAILED:', error.message);
    await page.screenshot({ path: path.join(screenshotDir, 'feature-126-error.png'), fullPage: true });
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the verification
verifyFeature126()
  .then(result => {
    console.log('\nResult:', JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
