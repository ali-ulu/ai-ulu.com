const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const base = process.env.SITE_BASE || 'http://127.0.0.1:4189/';
const out = path.join(__dirname, 'lab');
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });
  try {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(new URL('index.html', base).href, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      const state = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
        ctaBottom: document.querySelector('.hero-actions .btn').getBoundingClientRect().bottom,
        brokenImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src)
      }));
      assert.ok(state.width <= state.viewport + 1, 'horizontal overflow: ' + JSON.stringify({ viewport, state }));
      assert.ok(state.ctaBottom < viewport.height, 'hero CTA below fold: ' + JSON.stringify({ viewport, state }));
      assert.deepEqual(state.brokenImages, []);
      assert.deepEqual(errors, []);
      await page.screenshot({ path: path.join(out, 'home-' + viewport.width + '.png') });
      await page.locator('.dossier-sheet').scrollIntoViewIfNeeded();
      const sheet = await page.locator('.dossier-sheet').boundingBox();
      assert.ok(sheet.x >= -1 && sheet.x + sheet.width <= viewport.width + 1, 'dossier clipped: ' + JSON.stringify({ viewport, sheet }));
      await page.screenshot({ path: path.join(out, 'dossier-' + viewport.width + '.png') });
      await context.close();
      console.log('home ' + viewport.width + ': CTA visible, images loaded, no overflow or JS error');
    }
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(new URL('academy.html', base).href, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.track').count(), 6);
    assert.equal(await page.locator('.track li').count(), 90);
    assert.doesNotMatch(await page.locator('main').innerText(), /\b(Foundations|Frontend|Backend|Production|Blueprint|Engineering System|bundle)\b/);
    const coverColors = await page.locator('.track-cover').evaluateAll(covers => covers.map(cover => getComputedStyle(cover).color));
    assert.equal(new Set(coverColors).size, 6, 'each subject must have its own readable cover accent');
    await page.locator('.track:first-child .track-cover').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(out, 'academy-cover.png') });
    await page.getByRole('button', { name: 'Web', exact: true }).click();
    assert.equal(await page.locator('.track:visible').count(), 2);
    await page.screenshot({ path: path.join(out, 'academy.png') });
    assert.equal(await page.locator('.bundle-detail-link').count(), 2);
    for (const [bundle, expected] of [['web', 'Web üretim yolu'], ['production', 'Yayına hazırlık yolu']]) {
      const response = await page.goto(new URL('paket.html?paket=' + bundle, base).href, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      assert.equal(await page.locator('#bundle-title').textContent(), expected);
      assert.equal(await page.locator('.bundle-programs article').count(), 3);
      assert.equal(await page.locator('.bundle-programs a').count(), 3);
      assert.match(await page.locator('#bundle-purchase-title').textContent(), /henüz açılmadı/);
      assert.equal(await page.locator('#bundle-purchase-actions a[href^="https://"]').count(), 0);
      await page.setViewportSize({ width: 390, height: 844 });
      const width = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
      assert.ok(width.content <= width.viewport + 1, bundle + ' bundle horizontal overflow: ' + JSON.stringify(width));
      await page.locator('.bundle-cover').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(out, 'bundle-' + bundle + '-390.png') });
      await page.setViewportSize({ width: 1440, height: 900 });
    }
    for (const course of ['foundations', 'frontend', 'backend', 'devops', 'devsecops', 'system-design']) {
      const response = await page.goto(new URL('egitim.html?program=' + course, base).href, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      assert.equal(await page.locator('.program-days li').count(), 15);
      assert.equal(await page.locator('.track-cover').getAttribute('data-course'), course);
      assert.equal(await page.locator('#related-bundle-link').getAttribute('href'), 'paket.html?paket=' + (['foundations', 'frontend', 'backend'].includes(course) ? 'web' : 'production'));
      assert.match(await page.locator('#purchase-title').textContent(), /henüz açılmadı/);
      assert.equal(await page.locator('#purchase-actions a[href^="https://"]').count(), 0);
    }
    for (const route of ['danismanlik.html', 'web-gelistirme.html', 'portfolyo.html', 'hakkimda.html', 'ders.html', 'ornek-proje.html']) {
      const response = await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      assert.ok(await page.locator('h1').count() >= 1);
      assert.doesNotMatch(await page.locator('main').innerText(), /\b(Blueprint|Cinematic|Engineering System|LEARNING)\b/);
      if (route === 'danismanlik.html') {
        await page.screenshot({ path: path.join(out, 'consulting-1440.png') });
      }
      if (route === 'portfolyo.html') {
        assert.equal(await page.locator('.case').count(), 4);
        const webRoutes = await page.locator('#web .route').evaluateAll(links => links.map(link => link.getAttribute('href')));
        assert.deepEqual(webRoutes, ['a-sinematik/', 'b-urun/', 'c-portfoy/', 'd-imza/'].map(slug => 'https://ai-ulu.com/ornekler/' + slug));
        assert.deepEqual(await page.locator('.portfolio-shot img').evaluateAll(images => images.map(image => image.complete && image.naturalWidth > 0)), [true]);
        assert.match(await page.locator('.portfolio-shot figcaption').textContent(), /Örnek veriler/);
        assert.equal(await page.locator('a[href="https://github.com/ali-ulu/levh"]').count(), 1);
        await page.setViewportSize({ width: 390, height: 844 });
        const portfolioWidth = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
        assert.ok(portfolioWidth.content <= portfolioWidth.viewport + 1, 'portfolio horizontal overflow: ' + JSON.stringify(portfolioWidth));
        await page.locator('#levh').scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(out, 'portfolio-levh-390.png') });
        await page.setViewportSize({ width: 1440, height: 900 });
      }
    }
    const practicePosts = [];
    page.on('request', request => { if (request.method() !== 'GET') practicePosts.push(request.url()); });
    await page.goto(new URL('ders.html', base).href, { waitUntil: 'networkidle' });
    await page.locator('#practice-requirement').fill('Geçerli sepet kaydedilir; eksik teslimat bilgisinde sipariş oluşmaz.');
    assert.match(await page.locator('#practice-status').textContent(), /yalnız bu tarayıcıya kaydedildi/);
    await page.reload({ waitUntil: 'networkidle' });
    assert.match(await page.locator('#practice-requirement').inputValue(), /Geçerli sepet kaydedilir/);
    await page.locator('#practice-review').click();
    assert.equal(await page.locator('#practice-rubric').isVisible(), true);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.practice-card').scrollIntoViewIfNeeded();
    const practiceWidth = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
    assert.ok(practiceWidth.content <= practiceWidth.viewport + 1, 'practice horizontal overflow: ' + JSON.stringify(practiceWidth));
    await page.screenshot({ path: path.join(out, 'practice-390.png') });
    await page.locator('#practice-clear').click();
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('#practice-requirement').inputValue(), '');
    assert.deepEqual(practicePosts, [], 'practice must not submit answers to the site');
    await page.goto(new URL('danismanlik.html', base).href, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.package-action').count(), 4);
    for (const service of ['blueprint', 'blueprint-verify', 'blueprint-build', 'verify']) {
      await page.goto(new URL('danismanlik.html', base).href, { waitUntil: 'networkidle' });
      await page.locator('.package[data-service="' + service + '"] .package-action').click();
      assert.equal(await page.locator('select[name=service]').inputValue(), service);
    }
    await page.goto(new URL('index.html?service=unknown#iletisim', base).href, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('select[name=service]').inputValue(), '');
    await page.goto(new URL('web-gelistirme.html', base).href, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.package-action').count(), 4);
    await page.locator('.package-action').first().click();
    assert.equal(await page.locator('select[name=service]').inputValue(), 'website');
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of ['danismanlik.html', 'web-gelistirme.html']) {
      await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' });
      const width = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
      assert.ok(width.content <= width.viewport + 1, route + ' horizontal overflow: ' + JSON.stringify(width));
      assert.equal(await page.locator('.package-action').count(), 4);
      if (route === 'danismanlik.html') {
        await page.screenshot({ path: path.join(out, 'consulting-390.png') });
      }
    }
    await page.goto(new URL('index.html', base).href, { waitUntil: 'networkidle' });
    await page.locator('input[name=name]').fill('Deneme Kullanıcı');
    await page.locator('input[name=email]').fill('deneme@example.com');
    await page.locator('select[name=service]').selectOption({ label: 'Proje hazırlama' });
    await page.locator('textarea[name=message]').fill('Bir web uygulaması fikrim var; ilk kapsamı ve testleri planlamak istiyorum.');
    assert.equal(await page.locator('#project-form').evaluate(form => form.checkValidity()), true);
    await page.locator('#project-form button').click();
    assert.match(await page.locator('.form-status').textContent(), /e-posta uygulaman/i);
    assert.match(await page.locator('.form-status').textContent(), /henüz gönderilmedi/);
    await context.close();
    for (const width of [390, 1440]) {
      const moving = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
      const animated = await moving.newPage();
      const motionErrors = [];
      animated.on('pageerror', error => motionErrors.push(error.message));
      for (const route of ['index.html', 'danismanlik.html']) {
        await animated.goto(new URL(route, base).href, { waitUntil: 'networkidle' });
        await animated.screenshot({ path: path.join(out, route.replace('.html','') + '-motion-start-' + width + '.png') });
        await animated.locator(route === 'index.html' ? '.paper-stack' : '#paketler').scrollIntoViewIfNeeded();
        await animated.waitForTimeout(450);
        assert.equal(await animated.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
        await animated.screenshot({ path: path.join(out, route.replace('.html','') + '-motion-middle-' + width + '.png') });
      }
      assert.deepEqual(motionErrors, []);
      await moving.close();
    }
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const staticPage = await noJs.newPage();
    await staticPage.goto(new URL('danismanlik.html', base).href);
    assert.equal(await staticPage.locator('.package-action').count(), 4);
    assert.equal(await staticPage.locator('.consult-delivery').isVisible(), true);
    await noJs.close();
    console.log('academy: 6 tracks / 90 lessons, filter works; routes and form checked');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
