importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_STATIC_FILES_LIST = [
	'/',
	'/index.html',
	'/offline.html',
	'/src/js/app.js',
	'/src/js/feed.js',
	'/src/js/idb.js',
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
const API_POSTS_FETCH = 'https://pwagram-c7974.firebaseio.com/posts.json';


const trimCache = (cacheName, maxItems) => {
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

const isInArray = (string, array) => {
	let cachePath;

	if (string.indexOf(self.origin) === 0) cachePath = string.substring(self.origin.length);
	else cachePath = string;

	return array.indexOf(cachePath) > -1;
};

self.addEventListener('install', event => {
	console.log('[Service Worker] Install Service Worker ...', event);

	event.waitUntil(
		caches.open(CACHE_STATIC_NAME)
			.then(cache => {
				console.log('[Service Worker] Precaching App Shell');
				cache.addAll(CACHE_STATIC_FILES_LIST);
			})
			.catch(error => {
				console.warn('FETCH ERROR (sw.js - 1):', error);
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

self.addEventListener('fetch', event => {
	if (event.request.url.indexOf(API_POSTS_FETCH) > -1) {

		event.respondWith(fetch(event.request)
			.then(res => {
				const cloneRes = res.clone();

				cloneRes.json()
					.then(data => {

						for (let key in data) {
							writeData('posts', data[key]);
						}

					});

				return res;
			})
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
							cache.put(event.request.url, res_2.clone());
							return res_2;
						})
					)
					.catch(error => {
						console.warn('FETCH ERROR (sw.js - 3):', error);

						caches.open(CACHE_STATIC_NAME)
							.then(cache => {
								if (event.request.headers.get('accept').includes('text/html')) {
									return cache.match('/offline.html');
								}
							})

					})
				)
		);
	}
})
;
// Different's CACHE strategy END