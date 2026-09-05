// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize Firebase inside the Service Worker
const firebaseConfig = {
  apiKey: "AIzaSyAl2w2Nj_CCtA4iyho7-eAE8e4fSdyb-qQ",
  authDomain: "saurabhprotfolio.firebaseapp.com",
  projectId: "saurabhprotfolio",
  storageBucket: "saurabhprotfolio.firebasestorage.app",
  messagingSenderId: "245851571441",
  appId: "1:245851571441:web:a5d46b0407fbcafce6d550",
  measurementId: "G-9MRDDRN8B5"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw] Received background message:', payload);
  
  const title = payload.notification?.title || payload.data?.title || 'New Contact Inquiry';
  const body = payload.notification?.body || payload.data?.body || 'New message received from visitor.';
  const inquiryId = payload.data?.inquiryId || '';
  const url = payload.data?.url || '/admin?view=contact-inquiries';

  const notificationOptions = {
    body: body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: inquiryId || 'contact-inquiry',
    data: {
      url: url,
      inquiryId: inquiryId
    }
  };

  return self.registration.showNotification(title, notificationOptions);
});

// Click event handler - opens or focuses Admin Inquiries dashboard
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/admin?view=contact-inquiries';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already an admin window open
      for (const client of windowClients) {
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window to the target URL
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
