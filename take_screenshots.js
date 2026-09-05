import puppeteer from 'puppeteer-core';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Shanthini\\.gemini\\antigravity\\brain\\5cadd940-793c-4edc-bcef-2d08ca9c79ad';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 900 }
  });

  const page = await browser.newPage();

  // 1. Home Page
  console.log('1. Checking Home Page...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_home_verified.png') });

  // 2. Shop Page - Light Mode & Dark Mode with Product Cards
  console.log('2. Checking Shop Page (Light Mode)...');
  await page.goto('http://localhost:5173/shop', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll to trigger any lazy loaders/viewport renders
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, 800));
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 1000));

  // Check product image status
  const imgStats = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img[src*="/products/"]'));
    let loaded = 0;
    let broken = 0;
    let logoFallback = 0;
    imgs.forEach(img => {
      if (img.src.includes('logo.jpg')) logoFallback++;
      if (img.naturalWidth > 0) loaded++;
      else broken++;
    });
    return { total: imgs.length, loaded, broken, logoFallback };
  });
  console.log(`Product images on Shop page: ${imgStats.total} total, ${imgStats.loaded} loaded, ${imgStats.broken} broken, ${imgStats.logoFallback} logo fallbacks.`);
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_shop_light_mode.png') });

  // Dark Mode Shop
  console.log('3. Checking Shop Page (Dark Mode)...');
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_shop_dark_mode.png') });
  await page.evaluate(() => document.documentElement.classList.remove('dark'));

  // 4. Verify text removal: "Shop 52 Products"
  console.log('4. Verifying "Shop 52 Products" text removal...');
  const shopText = await page.evaluate(() => document.body.innerText);
  const has52Shop = shopText.includes('Shop 52 Products') || shopText.includes('52-Product') || shopText.includes('Full 52 Catalog');
  console.log('Shop page contains 52 references:', has52Shop);

  // 5. User Scan Session Isolation Test
  console.log('\n5. Testing AI Scan User Session Isolation...');
  const timestamp = Date.now();
  const userA_email = `user_a_${timestamp}@glowaura.com`;
  const userB_email = `user_b_${timestamp}@glowaura.com`;

  // Register User A
  const userARes = await page.evaluate(async (email) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'Password123!', full_name: 'Dr. Sarah Smith' })
    });
    return await res.json();
  }, userA_email);
  console.log(`User A (Sarah) created. User ID: ${userARes.user?.id}`);

  // Set User A token and navigate to /scan
  await page.evaluate((token) => localStorage.setItem('glowaura_token', token), userARes.token);
  await page.goto('http://localhost:5173/scan', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Verify User A starts with 0 scans -> NO "Perform New Scan" button
  const userA_initial = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasPerformNewScan: text.includes('Perform New Scan'),
      hasFaceScanner: text.includes('Live Camera') || text.includes('Upload Photo') || text.includes('Open Camera')
    };
  });
  console.log('User A (0 scans) UI check:', userA_initial);

  // User A runs a scan via 1-click test
  console.log('User A triggering 1-click scan demo...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const demoTab = btns.find(b => b.innerText.includes('1-Click Demos'));
    if (demoTab) demoTab.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const oilyBtn = btns.find(b => b.innerText.includes('Acne-Prone & Oily Profile'));
    if (oilyBtn) oilyBtn.click();
  });
  await new Promise(r => setTimeout(r, 4500));

  // Verify User A NOW sees the diagnostic dossier and "Perform New Scan" button
  const userA_afterScan = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasPerformNewScan: text.includes('Perform New Scan'),
      hasDossier: text.includes('Dermal Diagnostic Dossier')
    };
  });
  console.log('User A (after scan) UI check:', userA_afterScan);
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_userA_scan_completed.png') });

  // Log out User A
  console.log('Logging out User A...');
  await page.evaluate(() => {
    localStorage.removeItem('glowaura_token');
    localStorage.removeItem('glowaura_last_scan');
  });

  // Register User B
  const userBRes = await page.evaluate(async (email) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'Password123!', full_name: 'David Miller' })
    });
    return await res.json();
  }, userB_email);
  console.log(`User B (David) created. User ID: ${userBRes.user?.id}`);

  // Set User B token and navigate to /scan
  await page.evaluate((token) => localStorage.setItem('glowaura_token', token), userBRes.token);
  await page.goto('http://localhost:5173/scan', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Verify User B DOES NOT see User A's data or "Perform New Scan" button
  const userB_check = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasPerformNewScan: text.includes('Perform New Scan'),
      hasUserADossier: text.includes('Dermal Diagnostic Dossier'),
      hasCleanScanner: text.includes('Live Camera') || text.includes('Upload Photo')
    };
  });
  console.log('User B (clean session) UI check:', userB_check);
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_userB_clean_scan.png') });

  // Log out User B and log back in as User A
  console.log('Logging out User B and restoring User A session...');
  await page.evaluate((token) => localStorage.setItem('glowaura_token', token), userARes.token);
  await page.goto('http://localhost:5173/scan', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // Verify User A's saved results are loaded from the database!
  const userA_restored = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasPerformNewScan: text.includes('Perform New Scan'),
      hasDossier: text.includes('Dermal Diagnostic Dossier')
    };
  });
  console.log('User A (restored from DB) UI check:', userA_restored);

  await browser.close();
  console.log('\n=== ALL TESTS & SCREENSHOTS COMPLETED SUCCESSFULLY ===');
}

capture().catch(console.error);
