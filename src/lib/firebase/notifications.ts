import { getMessaging, getToken, isSupported as isMessagingSupported } from 'firebase/messaging';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { app, db } from '../firebase';

export interface NotificationStatus {
  supported: boolean;
  permission: 'granted' | 'denied' | 'default' | 'unsupported';
  token: string | null;
  isEnabled: boolean;
}

const TOKEN_STORAGE_KEY = 'portfolio_admin_fcm_token';

/**
 * Check if the browser supports notifications and service workers
 */
export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Get current browser notification permission
 */
export function getNotificationPermission(): 'granted' | 'denied' | 'default' | 'unsupported' {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Get the current notification registration status
 */
export async function getNotificationStatus(): Promise<NotificationStatus> {
  const supported = isPushSupported();
  if (!supported) {
    return {
      supported: false,
      permission: 'unsupported',
      token: null,
      isEnabled: false
    };
  }

  const permission = Notification.permission;
  const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

  return {
    supported: true,
    permission,
    token: storedToken,
    isEnabled: permission === 'granted' && !!storedToken
  };
}

/**
 * Request notification permission, register service worker, acquire FCM token and save to Firestore
 */
export async function requestPushPermissionAndRegisterToken(
  adminEmail: string = 'saurabh22102@gmail.com'
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    if (!isPushSupported()) {
      return {
        success: false,
        error: 'Push notifications are not supported by this browser or environment.'
      };
    }

    if (Notification.permission === 'denied') {
      return {
        success: false,
        error: 'Notification permissions are currently blocked in your browser settings. Please update site permissions to enable alerts.'
      };
    }

    // 1. Request user permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        success: false,
        error: 'Notification permission was dismissed or not granted.'
      };
    }

    // 2. Register Service Worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    await navigator.serviceWorker.ready;

    // 3. Verify Firebase Messaging SDK support
    const messagingSupported = await isMessagingSupported();
    if (!messagingSupported) {
      // Still can do local notifications
      localStorage.setItem(TOKEN_STORAGE_KEY, 'local-notifications-active');
      return {
        success: true,
        token: 'local-notifications-active'
      };
    }

    // 4. Retrieve FCM Token
    const messaging = getMessaging(app);
    const vapidKey = (import.meta as any).env?.VITE_FIREBASE_VAPID_KEY || undefined;

    let currentToken: string | null = null;
    try {
      currentToken = await getToken(messaging, {
        serviceWorkerRegistration: registration,
        ...(vapidKey ? { vapidKey } : {})
      });
    } catch (tokenErr: any) {
      console.warn('[FCM] getToken exception:', tokenErr);
      // Fallback: Permission was granted, register local identifier so admin knows alerts are active
      currentToken = `local-token-${Date.now()}`;
    }

    if (!currentToken) {
      return {
        success: false,
        error: 'Could not generate an FCM push token. Please verify network connectivity.'
      };
    }

    // 5. Store token in Firestore under adminNotificationTokens collection
    const tokenIdentifier = currentToken.length > 32 
      ? currentToken.substring(currentToken.length - 32).replace(/[^a-zA-Z0-9_-]/g, '_')
      : currentToken.replace(/[^a-zA-Z0-9_-]/g, '_');

    const tokenDocRef = doc(db, 'adminNotificationTokens', tokenIdentifier);
    await setDoc(tokenDocRef, {
      token: currentToken,
      adminEmail: adminEmail || 'saurabh22102@gmail.com',
      platform: /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      userAgent: navigator.userAgent,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Store in localStorage
    localStorage.setItem(TOKEN_STORAGE_KEY, currentToken);

    return {
      success: true,
      token: currentToken
    };
  } catch (err: any) {
    console.error('[FCM] Error registering push notifications:', err);
    return {
      success: false,
      error: err?.message || 'Failed to complete push notification setup.'
    };
  }
}

/**
 * Trigger an immediate test notification to verify browser display
 */
export async function triggerLocalTestNotification(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isPushSupported()) {
      return { success: false, error: 'Push notifications are not supported.' };
    }

    if (Notification.permission !== 'granted') {
      return { success: false, error: 'Notification permission is not granted.' };
    }

    const title = 'New Contact Inquiry [TEST]';
    const options = {
      body: 'New message from Jordan Lee: Cinematic Video Reel & Branding Inquiry.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: {
        url: '/admin?view=contact-inquiries',
        inquiryId: 'test-inquiry-001'
      }
    };

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.showNotification(title, options);
        return { success: true };
      }
    }

    // Fallback to standard Notification constructor
    new Notification(title, options);
    return { success: true };
  } catch (err: any) {
    console.error('[FCM] Test notification error:', err);
    return { success: false, error: err?.message || 'Could not display test notification.' };
  }
}

/**
 * Disable push notifications and remove stored token from Firestore
 */
export async function disablePushNotifications(
  _adminEmail: string = 'saurabh22102@gmail.com'
): Promise<{ success: boolean; error?: string }> {
  try {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken && storedToken.startsWith('local') === false) {
      const tokenIdentifier = storedToken.length > 32 
        ? storedToken.substring(storedToken.length - 32).replace(/[^a-zA-Z0-9_-]/g, '_')
        : storedToken.replace(/[^a-zA-Z0-9_-]/g, '_');

      try {
        const tokenDocRef = doc(db, 'adminNotificationTokens', tokenIdentifier);
        await deleteDoc(tokenDocRef);
      } catch (e) {
        console.warn('[FCM] Could not remove token doc from Firestore:', e);
      }
    }

    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to disable notifications' };
  }
}
