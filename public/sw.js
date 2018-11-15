const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_STATIC_FILES_LIST = [
	'/',
	'/index.html',
	'/offline.html',
	'/src/js/app.js',
	'/src/js/feed.js',
	'/src/js/polyfill/promise.js',
	'/src/js/polyfill/fetch.js',
	'/src/js/material.min.js',
	'/src/css/app.css',
	'/src/css/feed.css',
	'/src/images/main-image.jpg',
	'https://fonts.googleapis.com/css?family=Roboto:400,700',
	'https://fonts.googleapis.com/icon?family=Material+Icons',
	'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
];


//
trimCache = (cacheName, maxItems) => {
	caches.open(cacheName)
		.then(cache => {
			return cache.keys()
				.then(keys => {
					if (keys.length > maxItems) {
						cache.delete(keys[0])
							.then(trimCache(cacheName, maxItems));
					}
				});
		})
};

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

	return self.clients.claim();
});

// Different's CACHE strategy START
// 70 Strategy Cache with Network Fallback
// self.addEventListener('fetch', event => {
// 	event.respondWith(
// 		caches.match(event.request)
// 			.then(res_1 => res_1 ? res_1 : fetch(event.request)
// 				.then(res_2 => caches.open(CACHE_DYNAMIC_NAME)
// 					.then(cache => {
// 						cache.put(event.request.url, res_2.clone());
// 						return res_2;
// 					})
// 				)
// 				.catch(err => caches.open(CACHE_STATIC_NAME)
// 					.then(cache => cache.match('/offline.html'))
// 				)
// 			)
// 	)
// });

// 71 Strategy Cache Only
// self.addEventListener('fetch', event => {
// 	event.respondWith(
// 		caches.match(event.request)
// 	)
// });

// 72 Strategy Network Only
// self.addEventListener('fetch', event => {
// 	event.respondWith(
// 		fetch(event.request)
// 	)
// });

// 73 Strategy Network with Cache Fallback
// self.addEventListener('fetch', event => {
// 	event.respondWith(
// 		fetch(event.request)
// 			.then(res => caches.open(CACHE_DYNAMIC_NAME)
// 				.then(cache => {
// 					cache.put(event.request.url, res.clone());
// 					return res;
// 				}))
// 			.catch(err => caches.match(event.request))
// 	)
// });


isInArray = (string, array) => {
	let cachePath;

	if (string.indexOf(self.origin) === 0) {
		console.log('matched ', string);
		cachePath = string.substring(self.origin.length);
	} else {
		cachePath = string;
	}

	return array.indexOf(cachePath) > -1;
};

// 75 Cache then Network  Dynamic Caching
self.addEventListener('fetch', event => {
	const MOCK_URL_GET_HTTPBIN = 'https://httpbin.org/get';

	// TODO: Разобраться почему не работает
	// START
	// if (event.request.url.indexOf(MOCK_URL_GET_HTTPBIN) > -1) {
	// 	event.respondWith(
	// 		caches.open(CACHE_DYNAMIC_NAME)
	// 			.then(cache => fetch(event.request)
	// 				.then(res => {
	// 					cache.put(event.request, res.clone());
	// 					return res
	// 				})
	// 			)
	// 	)
	// } else if (new RegExp('\\b' + CACHE_STATIC_FILES_LIST.join('\\b|\\b') + '\\b').test(event.request.url)) {
	// 	event.respondWith(
	// 		caches.match(event.request)
	// 	)
	// } else {
	// 	event.respondWith(
	// 		caches.match(event.request)
	// 			.then(res_1 => res_1 ? res_1 : fetch(event.request)
	// 				.then(res_2 => caches.open(CACHE_DYNAMIC_NAME)
	// 					.then(cache => {
	// 						cache.put(event.request.url, res_2.clone());
	// 						return res_2;
	// 					})
	// 				)
	// 				.catch(err => caches.open(CACHE_STATIC_NAME)
	// 					.then(cache => event.request.url.indexOf('/help') && cache.match('/offline.html'))
	// 				)
	// 			)
	// 	)
	// }
	// END

	if (event.request.url.indexOf(MOCK_URL_GET_HTTPBIN) > -1) {
		event.respondWith(
			caches.open(CACHE_DYNAMIC_NAME)
				.then(cache => fetch(event.request)
					.then(res => {
						// trimCache(CACHE_DYNAMIC_NAME, 3);
						cache.put(event.request, res.clone());
						return res;
					})
				)
		);
	} else if (isInArray(event.request.url, CACHE_STATIC_FILES_LIST)) {
		event.respondWith(
			caches.match(event.request)
		);
	} else {
		event.respondWith(
			caches.match(event.request)
				.then(res_1 => res_1 ? res_1 : fetch(event.request)
					.then(res_2 => caches.open(CACHE_DYNAMIC_NAME)
						.then(cache => {
							// trimCache(CACHE_DYNAMIC_NAME, 3);
							cache.put(event.request.url, res_2.clone());
							return res_2;
						})
					)
					.catch(err => caches.open(CACHE_STATIC_NAME)
						.then(cache => {
							if (event.request.headers.get('accept').includes('text/html')) {
								return cache.match('/offline.html');
							}
						})
					)
				)
		);
	}
});
// Different's CACHE strategy END