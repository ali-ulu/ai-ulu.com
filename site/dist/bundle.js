(() => {
  const bundles = {
    web: {
      title: 'Web üretim yolu',
      subtitle: 'Yazılımın büyük resminden erişilebilir arayüze ve güvenilir API’ye uzanan üç program.',
      code: 'WEB',
      audience: 'Bir web ürününü baştan sona anlamak isteyenler.',
      prerequisite: 'Yazılım temelleri programı başlangıç noktasıdır. Arayüz ve sunucu geliştirme programlarında temel programlama, web ve Git bilgisi gerekir.',
      courses: ['foundations', 'frontend', 'backend'],
      output: 'Hedef: MiniShop’un mühendislik haritası, arayüzü ve API’si.',
      outputCopy: 'Üç program; ihtiyaç ve sınırlar, tarayıcı deneyimi, veri ve API sözleşmesini aynı örnek ürün üzerinden ele alacak şekilde hazırlanıyor. Ortak uygulama henüz erişime açık değil.',
      steps: ['Sistemin parçalarını ve kararlarını haritala', 'Erişilebilir, test edilebilir arayüzü tasarla', 'API ve veri bütünlüğü kararlarını bağla']
    },
    production: {
      title: 'Yayına hazırlık yolu',
      subtitle: 'Mimari karar, güvenilir yayın ve güvenli teslimi aynı ürün üzerinde birleştiren üç program.',
      code: 'PROD',
      audience: 'Çalışan bir yazılımın yayına ve işletime taşınmasını yöneten geliştiriciler.',
      prerequisite: 'İstemci/sunucu, veri tabanı ve uygulama geliştirme temeli önerilir. Altyapı ve güvenli teslim programları için temel Linux, ağ ve güvenlik kavramları yararlı olacaktır; başlangıç düzeyi bir yol değildir.',
      courses: ['system-design', 'devops', 'devsecops'],
      output: 'Hedef: MiniShop için mimari, yayın ve güvenlik karar dosyası.',
      outputCopy: 'Hedeflenen ortak çalışma; kapasite ve tutarlılık varsayımlarını, dağıtım ve geri alma adımlarını, tehdit ve kontrol kararlarını aynı senaryoda birleştirir. Uygulama ortamı henüz erişime açık değil.',
      steps: ['Kısıtları, kapasiteyi ve mimari seçenekleri karşılaştır', 'Yayın, gözlem ve geri alma planını oluştur', 'Tehdit modelini ve güvenlik kontrollerini doğrula']
    }
  };
  const id = new URLSearchParams(location.search).get('paket');
  const bundle = Object.hasOwn(bundles, id) ? bundles[id] : null;
  if (!bundle) {
    document.getElementById('bundle-title').textContent = 'Eğitim yolu bulunamadı.';
    document.getElementById('bundle-subtitle').textContent = 'Katalogdan bir eğitim yolu seçin.';
    document.querySelectorAll('[data-bundle-section]').forEach(section => { section.hidden = true; });
    return;
  }
  document.title = bundle.title + ' | Senior Academy';
  for (const [elementId, value] of Object.entries({
    'bundle-title': bundle.title,
    'bundle-subtitle': bundle.subtitle,
    'bundle-audience': bundle.audience,
    'bundle-prerequisite': bundle.prerequisite,
    'bundle-code': bundle.code,
    'bundle-cover-name': bundle.title.toLocaleUpperCase('tr-TR'),
    'bundle-output': bundle.output,
    'bundle-output-copy': bundle.outputCopy
  })) {
    document.getElementById(elementId).textContent = value;
  }
  const courses = window.ACADEMY_CATALOG || [];
  const courseMount = document.getElementById('bundle-programs');
  bundle.courses.forEach((courseId, index) => {
    const course = courses.find(item => item.id === courseId);
    if (!course) return;
    const article = document.createElement('article');
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    const copy = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = course.title;
    const outcome = document.createElement('p');
    outcome.textContent = course.outcome;
    const link = document.createElement('a');
    link.href = 'egitim.html?program=' + encodeURIComponent(course.id);
    link.textContent = '15 ders başlığını inceleyin ↗';
    copy.append(title, outcome, link);
    article.append(number, copy);
    courseMount.append(article);
  });
  const steps = document.getElementById('bundle-steps');
  bundle.steps.forEach(step => {
    const item = document.createElement('li');
    item.textContent = step;
    steps.append(item);
  });
  const purchaseUrl = window.ACADEMY_STORE_LINKS?.bundles?.[id];
  if (purchaseUrl) {
    try {
      const url = new URL(purchaseUrl);
      if (url.protocol === 'https:') {
        document.getElementById('bundle-purchase-title').textContent = 'ikas mağazasında inceleyin.';
        document.getElementById('bundle-purchase-copy').textContent = 'Güncel fiyat, erişim süresi, içerik ve destek kapsamı ikas ürün sayfasında yer alır. Satın alma mağazada tamamlanır.';
        const link = document.createElement('a');
        link.className = 'btn dark';
        link.href = url.href;
        link.textContent = 'ikas ürün sayfasını açın ↗';
        document.getElementById('bundle-purchase-actions').prepend(link);
      }
    } catch {
      // Invalid store configuration leaves the closed-sale state visible.
    }
  }
})();
