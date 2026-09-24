(() => {
  const choices = {
  "blueprint": "Proje hazırlama",
  "build": "Mevcut plana göre geliştirme",
  "verify": "Mevcut proje incelemesi",
  "blueprint-verify": "Proje hazırlama + teknik kontrol",
  "blueprint-build": "Proje hazırlama + geliştirme",
  "full-cycle": "Hazırlama + geliştirme + teknik kontrol",
  "launch": "Yayın ve devir",
  "website": "Web sitesi geliştirme",
  "webapp": "Web uygulaması geliştirme",
  "academy": "Senior Academy hakkında"
};
  // Public labels can change without changing the service identifier.
  const legacyPackages = {
    'Sinematik tanıtım sayfası': 'website',
    'Ürün / marka sayfası': 'website',
    Portföy: 'website',
    'Tam marka deneyimi': 'website'
  };
  for (const card of document.querySelectorAll('.package')) {
    if (card.querySelector('.package-action')) continue;
    const service = card.dataset.service || legacyPackages[card.querySelector('h3')?.textContent.trim()];
    if (!Object.hasOwn(choices, service)) continue;
    const link = document.createElement('a');
    link.className = 'package-action';
    link.href = 'index.html?service=' + encodeURIComponent(service) + '#iletisim';
    link.textContent = 'Bu kapsam için görüşme talebi ↗';
    card.append(link);
  }
  const form = document.getElementById('project-form');
  if (!form) return;
  const status = form.querySelector('.form-status');
  const select = form.querySelector('select[name="service"]');
  const requested = new URLSearchParams(location.search).get('service');
  if (Object.hasOwn(choices, requested)) {
    select.value = requested;
    status.textContent = 'Seçtiğiniz görüşme konusu forma aktarıldı.';
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const service = choices[String(data.get('service'))];
    if (!service) return;
    const subject = 'Görüşme talebi: ' + service;
    const body = 'Ad: ' + String(data.get('name')).trim() +
      '\nE-posta: ' + String(data.get('email')).trim() +
      '\nKonu: ' + service + '\n\nProjenin özeti:\n' +
      String(data.get('message')).trim();
    status.textContent = 'E-posta uygulamanızda taslak açılıyor. Talep henüz gönderilmedi; e-postayı uygulamanızdan göndermeniz gerekir. Açılmazsa aliulu@ai-ulu.com adresine yazabilirsiniz.';
    window.location.href = 'mailto:aliulu@ai-ulu.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();
