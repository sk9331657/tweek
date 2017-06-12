import idbKeyval from 'idb-keyval';
import { CACHE_NAME, notificationTypes, urls } from './constants';
import { refreshIndex } from './search';

let isLoggedIn = true;

export async function testLogin(request, shouldLoadCache = true) {
  const response = await fetch(request);

  const wasLoggedIn = isLoggedIn;
  isLoggedIn = response.status !== 403;

  if (!isLoggedIn) {
    if (Notification.permission === 'granted') {
      self.registration.showNotification('Login expired\nPlease log in again', {
        icon: '/tweek.png',
        requireInteraction: true,
        tag: notificationTypes.LOGIN,
      });
    }
  } else {
    const loginNotifications = await self.registration.getNotifications({
      tag: notificationTypes.LOGIN,
    });
    loginNotifications.forEach(notification => notification.close());
    if (!wasLoggedIn && shouldLoadCache) {
      refresh();
    }
  }

  return response;
}

async function clearCache(){
  const cache = await caches.open(CACHE_NAME);
  const cachedKeys = await cache.keys();
  const urlsToCacheSet = new Set(urls.CACHE);
  await Promise.all(
    urlsToCacheSet.map(key => (console.log('deleting from cache', key.url), cache.delete(key))),
  );
}

export async function refresh() {
  console.log('refreshing cache...');

  try {
    await clearCache();
     
    await refreshIndex();

    const manifests = await fetch(urls.MANIFESTS, {credentials: 'include'});
    if (manifests.ok) {
      const data = await manifests.json();
      idbKeyval.clear();
      await Promise.all(data.map(manifest => idbKeyval.set(manifest.key_path, manifest)));
    }
    console.log('cache refreshed');
  } catch (error) {
    console.warn('failed to refresh cache', error);
  }
}
