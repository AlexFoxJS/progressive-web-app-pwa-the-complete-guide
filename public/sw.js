importScripts('/src/js/polifills/serviceworker-cache-polyfill.js');

// https://developer.mozilla.org/en-US/docs/Web/API/InstallEvent
self.addEventListener('install', event => {
	console.log('[Service Worker] Install Service Worker ...', event);

	event.waitUntil(
		caches.open('precache')
			.then(cache => {
				console.log('[Service Worker] Precaching App Shell');
				cache.addAll([
					'/',
					'/index.html',

					'/src/js/app.js',
					'/src/js/feed.js',
					'/src/js/polifills/promise.js',
					'/src/js/polifills/fetch.js',
					'/src/js/polifills/serviceworker-cache-polyfill.js',
					'/src/js/material.min.js',

					'/src/css/app.css',
					'/src/css/feed.css',

					'/src/images/main-image.jpg',

					'https://fonts.googleapis.com/css?family=Roboto:400,700',
					'https://fonts.googleapis.com/icon?family=Material+Icons',
					'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
				]);
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
	event.respondWith(
		caches.match(event.request)
			.then(response => response ? response : fetch(event.request))
	);
});
