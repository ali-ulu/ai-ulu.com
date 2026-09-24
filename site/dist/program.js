(() => {
  const id = new URLSearchParams(location.search).get('program');
  const course = (window.ACADEMY_CATALOG || []).find(item => item.id === id);
  if (!course) {
    document.getElementById('program-title').textContent = 'Program bulunamadı.';
    document.getElementById('program-subtitle').textContent = 'Katalogdan bir program seçin.';
    return;
  }
  const codes = {foundations:'SE',frontend:'FE',backend:'BE',devops:'DO',devsecops:'DS','system-design':'SD'};
  document.title = course.title + ' | Senior Academy';
  document.getElementById('program-title').textContent = course.title;
  document.getElementById('program-subtitle').textContent = course.subtitle;
  document.getElementById('program-goal').textContent = course.outcome;
  document.getElementById('program-project').textContent = course.project;
  document.getElementById('program-code').textContent = codes[course.id] || 'SA';
  const cover = document.querySelector('.track-cover');
  cover.dataset.course = course.id;
  cover.querySelector('span:last-child').textContent = course.title.replace(/^Senior /, '').toLocaleUpperCase('tr-TR') + ' / ALI ULU';
  const days = document.getElementById('program-days');
  for (const day of course.days) {
    const item = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = 'DERS ' + String(day.day).padStart(2, '0');
    const title = document.createElement('strong');
    title.textContent = day.title;
    item.append(label, title);
    days.append(item);
  }
  const stack = document.getElementById('program-stack');
  for (const concept of course.stack) {
    const item = document.createElement('li');
    item.textContent = concept;
    stack.append(item);
  }
  const bundleId = ['foundations', 'frontend', 'backend'].includes(course.id) ? 'web' : 'production';
  const bundleName = bundleId === 'web' ? 'Web üretim yolu' : 'Yayına hazırlık yolu';
  document.getElementById('related-bundle-title').textContent = course.title + ', ' + bundleName + ' içinde.';
  document.getElementById('related-bundle-copy').textContent = bundleId === 'web'
    ? 'Yazılım temelleri, arayüz ve sunucu geliştirme programları aynı MiniShop örneğinde birlikte ilerlemek için hazırlanıyor.'
    : 'Sistem tasarımı, altyapı ve güvenli teslim programları aynı MiniShop senaryosunda mimari, yayın ve güvenlik kararlarını ele alıyor.';
  document.getElementById('related-bundle-link').href = 'paket.html?paket=' + bundleId;
  const purchaseUrl = window.ACADEMY_STORE_LINKS?.courses?.[course.id];
  if (purchaseUrl) {
    try {
      const url = new URL(purchaseUrl);
      if (url.protocol === 'https:') {
        document.getElementById('purchase-title').textContent = 'ikas mağazasında inceleyin.';
        document.getElementById('purchase-copy').textContent = 'Güncel fiyat, erişim süresi, içerik ve destek kapsamı ürün sayfasında yer alır. Satın alma ikas mağazasında tamamlanır.';
        const button = document.createElement('a');
        button.className = 'btn dark';
        button.href = url.href;
        button.textContent = 'ikas ürün sayfasını açın ↗';
        document.getElementById('purchase-actions').prepend(button);
      }
    } catch {
      // Invalid store configuration leaves the truthful closed-sale state visible.
    }
  }
})();
