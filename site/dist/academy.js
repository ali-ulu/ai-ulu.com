(() => {
  const catalog = window.ACADEMY_CATALOG;
  const mount = document.getElementById('course-list');
  if (!Array.isArray(catalog) || !mount) return;
  const descriptions = {
    foundations: 'Bilgisayar, kod, ekip, veri, test, güvenlik ve mimarinin ortak haritası.',
    frontend: 'Tarayıcı, erişilebilirlik, arayüz mimarisi, veri akışı ve üretim kalitesi.',
    backend: 'API, veri, tutarlılık, güvenlik, performans ve operasyon kararları.',
    devops: 'Teslim, altyapı, yayın, gözlemlenebilirlik ve güvenilirlik.',
    devsecops: 'Tehdit modeli, kimlik, tedarik zinciri, güvenli yayın ve olay müdahalesi.',
    'system-design': 'Gereksinimden kapasiteye, veri akışından ölçek ve maliyete sistem kararı.'
  };
  const groups = {foundations:'foundations',frontend:'web',backend:'web',devops:'systems',devsecops:'systems','system-design':'systems'};
  const codes = {foundations:'SE',frontend:'FE',backend:'BE',devops:'DO',devsecops:'DS','system-design':'SD'};
  mount.replaceChildren();
  for (const course of catalog) {
    const section = document.createElement('article');
    section.className = 'track';
    section.dataset.group = groups[course.id] || 'systems';
    section.id = course.id;
    const identity = document.createElement('div');
    identity.className = 'track-identity';
    const cover = document.createElement('div');
    cover.className = 'track-cover';
    cover.dataset.course = course.id;
    cover.setAttribute('aria-hidden', 'true');
    const coverBrand = document.createElement('span');
    coverBrand.textContent = 'SENIOR ACADEMY';
    const coverCode = document.createElement('strong');
    coverCode.textContent = codes[course.id] || 'SA';
    const coverFoot = document.createElement('span');
    coverFoot.textContent = course.title.replace(/^Senior /, '').toLocaleUpperCase('tr-TR') + ' / ALI ULU';
    cover.append(coverBrand, coverCode, coverFoot);
    const status = document.createElement('span');
    status.className = 'track-status';
    status.textContent = 'Hazırlanıyor · Satışa açık değil';
    identity.append(cover, status);
    const body = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = course.title;
    const description = document.createElement('p');
    description.textContent = descriptions[course.id] || '';
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = course.days.length + ' ders başlığını inceleyin';
    const list = document.createElement('ol');
    for (const day of course.days) {
      const item = document.createElement('li');
      item.textContent = day.title;
      list.append(item);
    }
    details.append(summary, list);
    const link = document.createElement('a');
    link.className = 'line-link';
    link.href = 'egitim.html?program=' + encodeURIComponent(course.id);
    link.textContent = 'Programı inceleyin ↗';
    body.append(title, description, details, link);
    section.append(identity, body);
    mount.append(section);
  }
  const buttons = [...document.querySelectorAll('[data-filter]')];
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      mount.querySelectorAll('.track').forEach(track => {
        track.hidden = filter !== 'all' && track.dataset.group !== filter;
      });
    });
  }
})();
