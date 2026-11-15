importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
self.addEventListener('push', function (e) {
  e.waitUntil((async function () {
    try {
      const c = await caches.open('pal-badge');
      const r = await c.match('/badge-count');
      let n = r ? (parseInt(await r.text(), 10) || 0) : 0;
      n++;
      await c.put('/badge-count', new Response(String(n)));
      if (self.navigator && self.navigator.setAppBadge) await self.navigator.setAppBadge(n);
    } catch (x) {}
  })());
});
