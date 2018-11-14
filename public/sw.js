// https://developer.mozilla.org/en-US/docs/Web/API/InstallEvent
self.addEventListener('install', event => {
	console.log('[Service Worker] Install Service Worker ...', event);

	event.waitUntil(
		caches.open('precache')
			.then(cache => {
				console.log('[Service Worker] Precaching App Shell');
				cache.add('/src/js/app.js')
			})
			.catch(e => {
				console.error(e)
			})
	);
});

// https://developer.mozilla.org/en-US/docs/Web/Events/activate
self.addEventListener('activate', event => {
	console.log('[Service Worker] Activating Service Worker ...', event);
	return self.clients.claim()
});

// https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
self.addEventListener('fetch', event => {
	// console.log('[Service Worker] Fetching something ...', event);
	event.respondWith(fetch(event.request));
});
