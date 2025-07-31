// service-worker.js

// Service Worker yüklendiğinde tetiklenir.
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  // Gerekli varlıkları önbelleğe almak için kullanılabilir.
  self.skipWaiting(); // Yeni service worker'ı hemen aktif et
});

// Service Worker aktif olduğunda tetiklenir.
self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
  // Eski önbellekleri temizlemek için kullanılabilir.
  event.waitUntil(clients.claim()); // Tüm istemcileri kontrol altına al
});

// Bir push bildirimi alındığında tetiklenir.
self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received.');
  
  // Gelen push verisini oku. Varsayılan olarak bir metin bekliyoruz.
  // Gerçek bir uygulamada bu JSON formatında olabilir.
  const notificationText = event.data ? event.data.text() : 'Yeni bir bildiriminiz var!';
  
  const title = 'AnimReminder';
  const options = {
    body: notificationText,
    icon: 'https://cdn-icons-png.flaticon.com/512/3031/3031113.png', // Genel bir bildirim ikonu
    badge: 'https://cdn-icons-png.flaticon.com/512/3031/3031113.png'
  };

  // Bildirimi göster.
  event.waitUntil(self.registration.showNotification(title, options));
});

// Bildirime tıklandığında ne olacağını belirle.
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  // İstemci pencerelerini kontrol et ve varsa odaklan, yoksa yeni bir tane aç.
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

