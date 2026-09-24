(() => {
  const form = document.getElementById('practice-form');
  if (!form) return;

  const storageKey = 'senior-academy:system-design-sample:v1';
  const fields = [...form.querySelectorAll('textarea[name]')];
  const status = document.getElementById('practice-status');
  const rubric = document.getElementById('practice-rubric');

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    for (const field of fields) {
      if (typeof saved[field.name] === 'string') field.value = saved[field.name];
    }
    status.textContent = fields.some(field => field.value) ? 'Bu tarayıcıdaki önceki yanıtların yüklendi.' : 'Yazdıkların otomatik olarak yalnız bu tarayıcıda saklanır.';
  } catch {
    status.textContent = 'Bu tarayıcıda otomatik kayıt kullanılamıyor. Yanıtlarını istersen kendin kopyalayabilirsin.';
  }

  form.addEventListener('input', () => {
    try {
      const answers = Object.fromEntries(fields.map(field => [field.name, field.value]));
      localStorage.setItem(storageKey, JSON.stringify(answers));
      status.textContent = 'Yanıtların yalnız bu tarayıcıya kaydedildi; siteye gönderilmedi.';
    } catch {
      status.textContent = 'Otomatik kayıt başarısız. Sayfayı kapatmadan önce yanıtlarını kopyala.';
    }
  });

  document.getElementById('practice-review').addEventListener('click', () => {
    rubric.hidden = false;
    status.textContent = 'Kontrol noktalarını açtın. Bu, otomatik puanlama veya öğretmen incelemesi değildir.';
  });

  document.getElementById('practice-clear').addEventListener('click', () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // The fields can still be cleared when browser storage is unavailable.
    }
    for (const field of fields) field.value = '';
    rubric.hidden = true;
    status.textContent = 'Bu cihazdaki alıştırma yanıtları silindi.';
  });
})();
