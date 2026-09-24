// Populate only after the corresponding ikas product, checkout and access delivery are verified.
window.ACADEMY_STORE_LINKS = Object.freeze({
  // Public storefront request currently redirects anonymous visitors to accounts.ikas.com.
  // Keep product links closed until storefront, checkout and course access are verified.
  storefront: 'https://senioracademy.myikas.com/',
  courses: Object.freeze({
    foundations: null,
    frontend: null,
    backend: null,
    devops: null,
    devsecops: null,
    'system-design': null
  }),
  bundles: Object.freeze({
    web: null,
    production: null,
    ai: null
  })
});
