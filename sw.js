CACHE = 'sparta-ios-v27';

const ASSETS = [
  './herb.jpg',
  './sponsorzy.jpg',
  './manifest.webmanifest',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  './kluby/krysztal_werbkowice.jpg',
  './kluby/pogon_96_laszczowka.jpg',
  './kluby/igros_krasnobrod.jpg',
  './kluby/lada_1945_bilgoraj.jpg',
  './kluby/graf_chodywance.png',
  './kluby/andoria_mircze.jpg',
  './kluby/huragan_hrubieszow.jpg',
  './kluby/gryf_gmina_zamosc.jpg',
  './kluby/bks_bodaczow.jpg',
  './kluby/korona_laszczow.jpg',
  './kluby/olimpiakos_tarnogrod.jpg',
  './kluby/tanew_majdan_stary.jpg',
  './kluby/huczwa_tyszowce.jpg',
  './kluby/sokol_zwierzyniec.jpg',
  './kluby/blekitni_obsza.jpg',
  './kluby/omega_stary_zamosc.jpg',
  './sponsorzy/14_stalovy.jpg',
  './sponsorzy/00_arkusz_wszystkich_sponsorow.jpg',
  './sponsorzy/24_dietum.jpg',
  './sponsorzy/10_m3_sport.jpg',
  './sponsorzy/08_petra_kominki.jpg',
  './sponsorzy/03_re_mat.jpg',
  './sponsorzy/16_delikatesy_sezam.jpg',
  './sponsorzy/18_auto_hobby.jpg',
  './sponsorzy/11_dpf_serwis.jpg',
  './sponsorzy/25_eco_fresh.jpg',
  './sponsorzy/04_klimaswiat.jpg',
  './sponsorzy/06_zlota_setka_spartan.jpg',
  './sponsorzy/02_entra.jpg',
  './sponsorzy/26_gtnet.jpg',
  './sponsorzy/23_bar_kuznia.jpg',
  './sponsorzy/01_herb_gminy_labunie.jpg',
  './sponsorzy/05_bor_dip.jpg',
  './sponsorzy/21_sok_tloczony_jablkowy_labunie.jpg',
  './sponsorzy/17_cymipro.jpg',
  './sponsorzy/22_miejsce_na_twoja_reklame.jpg',
  './sponsorzy/12_mdd_maszyny_do_drewna.jpg',
  './sponsorzy/27_greinplast.jpg',
  './sponsorzy/15_szef_bud.jpg',
  './sponsorzy/20_strefa_juniora.jpg',
  './sponsorzy/07_salon_fryzjerski_silmo.jpg',
  './sponsorzy/19_mateusz_lal.jpg',
  './sponsorzy/09_glass_zam.jpg',
  './sponsorzy/13_mdd_domy_z_drewna.jpg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  // Dla strony/aplikacji zawsze najpierw pobierz najnowszy index.html z GitHub Pages.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Pliki statyczne: cache, a jeĹli ich nie ma â sieÄ i zapis do cache.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (request.method === 'GET' && response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
