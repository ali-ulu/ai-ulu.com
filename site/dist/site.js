(() => {
  const choices = {
    blueprint: 'Proje hazırlama',
    build: 'Mevcut plana göre uygulama',
    verify: 'Bağımsız proje incelemesi',
    'blueprint-verify': 'Proje hazırlama + bağımsız inceleme',
    'blueprint-build': 'Proje hazırlama + uygulama',
    'full-cycle': 'Tam döngü: hazırlama + uygulama + kontrol',
    launch: 'Yayın ve devir',
    website: 'Web sitesi geliştirme',
    webapp: 'Web uygulaması geliştirme',
    academy: 'Senior Academy hakkında'
  };

  const packageChoices = {
    'Proje hazırlama': 'blueprint',
    Uygulama: 'build',
    'Bağımsız kontrol': 'verify',
    'Yayın ve devir': 'launch',
    'Cinematic landing': 'website',
    'Ürün / marka sayfası': 'website',
    Portföy: 'website',
    'Tam marka deneyimi': 'website'
  };

  for (const card of document.querySelectorAll('.package')) {
    const title = card.querySelector('h3')?.textContent?.trim();
    const choice = packageChoices[title];
    if (!choice) continue;
    const link = document.createElement('a');
    link.className = 'package-action';
    link.href = 'index.html?service=' + encodeURIComponent(choice) + '#iletisim';
    link.textContent = 'Görüşme isteyin ↗';
    card.append(link);
  }

  const bundleChoices = {
    'Hazırlama + kontrol': 'blueprint-verify',
    'Hazırlama + uygulama': 'blueprint-build',
    'Tam döngü': 'full-cycle'
  };
  for (const row of document.querySelectorAll('.route')) {
    const title = row.querySelector('h3')?.textContent?.trim();
    const choice = bundleChoices[title];
    if (!choice) continue;
    const link = document.createElement('a');
    link.className = 'line-link route-action';
    link.href = 'index.html?service=' + encodeURIComponent(choice) + '#iletisim';
    link.textContent = 'Görüşme isteyin ↗';
    row.querySelector('div')?.append(link);
  }

  const form = document.getElementById('project-form');
  if (!form) return;
  const status = form.querySelector('.form-status');
  const requested = new URLSearchParams(location.search).get('service');
  const select = form.querySelector('select[name="service"]');
  if (requested && Object.hasOwn(choices, requested)) {
    select.value = choices[requested];
    status.textContent = 'Seçtiğiniz konu hazır. Projenizin mevcut durumunu kısaca yazabilirsiniz.';
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const service = String(data.get('service') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = 'Görüşme talebi: ' + service;
    const body = 'Ad: ' + name + '\nE-posta: ' + email + '\nKonu: ' + service + '\n\nProjenin durumu:\n' + message;
    const link = 'mailto:aliulu@ai-ulu.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status.textContent = 'E-posta uygulamanız açılıyor. Talebiniz, hazırlanan e-postayı gönderdiğinizde iletilir. Uygulama açılmazsa aliulu@ai-ulu.com adresine yazabilirsiniz.';
    window.location.href = link;
  });
})();
