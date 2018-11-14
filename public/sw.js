// https://developer.mozilla.org/en-US/docs/Web/API/InstallEvent
self.addEventListener('install', event => {
	console.log('[Service Worker] Install Service Worker ...', event)
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
