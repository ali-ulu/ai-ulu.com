// Liquid Glass navbar: thicken the pill once the page is scrolled.
(function () {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 24);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });
})();

// Progressive enhancement: the form works without JS only as a normal POST
// fallback; here we submit via fetch for an inline status message.
(function () {
  const form = document.getElementById("lead-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const submit = form.querySelector('button[type="submit"]');

  function setStatus(state, message) {
    status.dataset.state = state;
    status.textContent = message;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries());
    submit.disabled = true;
    setStatus("", "");
    status.removeAttribute("data-state");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        form.reset();
        setStatus("ok", "Teşekkürler! Mesajınız alındı, en kısa sürede dönüş yapacağız.");
      } else {
        setStatus("error", body.error || "Bir sorun oluştu. Lütfen tekrar deneyin veya e-posta gönderin.");
      }
    } catch {
      setStatus("error", "Bağlantı hatası. Lütfen tekrar deneyin veya e-posta gönderin.");
    } finally {
      submit.disabled = false;
    }
  });
})();
