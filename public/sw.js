importScripts('/src/js/polifills/serviceworker-cache-polyfill.js');

const CACHE_STATIC_NAME = 'static-v2';
const CACHE_DYNAMIC_NAME = 'dynamic-v2';
const CACHE_STATIC_FILES_LIST = [
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
];

// https://developer.mozilla.org/en-US/docs/Web/API/InstallEvent
self.addEventListener('install', event => {
	console.log('[Service Worker] Install Service Worker ...', event);

	event.waitUntil(
		caches.open(CACHE_STATIC_NAME)
			.then(cache => {
				console.log('[Service Worker] Precaching App Shell');
				cache.addAll(CACHE_STATIC_FILES_LIST);
			})
			.catch(e => {
				console.error(e)
			})
	);
});

// https://developer.mozilla.org/en-US/docs/Web/Events/activate
self.addEventListener('activate', event => {
	console.log('[Service Worker] Activating Service Worker ...', event);

	event.waitUntil(
		caches.keys()
			.then(keyList => Promise.all(keyList.map(key => {
				if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
					console.log('[Service Worker] Remove old cache ...', key);
					return caches.delete(key);
				}
			})))
	);

	return self.clients.claim()
});

// https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request)
			.then(res_1 => res_1 ? res_1 : fetch(event.request)
				.then(res_2 => caches.open(CACHE_DYNAMIC_NAME)
					.then(cache => {
						cache.put(event.request.url, res_2.clone());
						return res_2;
					})
				)
				.catch(err => {
					console.error(err);
				})
			)
	)
});
