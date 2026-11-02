// Registra clics de contacto en Umami (los avisos de visitas los hace el script de Umami).
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href]');
  if (!a || !window.umami) return;
  var h = a.href, name = '';
  if (h.indexOf('wa.me') > -1) name = 'click-whatsapp';
  else if (h.indexOf('mailto:') === 0) name = 'click-email';
  else if (h.indexOf('upwork.com') > -1) name = 'click-upwork';
  else if (h.indexOf('linkedin.com') > -1) name = 'click-linkedin';
  else if (h.indexOf('instagram.com') > -1) name = 'click-instagram';
  if (name) window.umami.track(name, { page: location.pathname });
});
