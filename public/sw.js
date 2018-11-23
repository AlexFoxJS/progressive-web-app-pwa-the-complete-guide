importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

const CACHE_STATIC_NAME = 'static-v18';
const CACHE_DYNAMIC_NAME = 'dynamic-v2';
const STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/src/js/app.js',
  '/src/js/feed.js',
  '/src/js/idb.js',
  '/src/js/promise.js',
  '/src/js/fetch.js',
  '/src/js/material.min.js',
  '/src/css/app.css',
  '/src/css/feed.css',
  '/src/images/main-image.jpg',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
];

// const trimCache = (cacheName, maxItems) => {
//   caches.open(cacheName)
//     .then(cache => cache.keys()
//       .then(keys => {
//         if (keys.length > maxItems) {
//           cache.delete(keys[0]).then(trimCache(cacheName, maxItems));
//         }
//       })
//     )
// };

self.addEventListener('install', event => {

	console.log('[Service Worker] Installing Service Worker ...', event);

	event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(cache => {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll(STATIC_FILES);
      })
  )

});

self.addEventListener('activate', event => {

	console.log('[Service Worker] Activating Service Worker ....', event);

	event.waitUntil(
    caches.keys()
      .then(keyList => Promise.all(keyList.map(key => {
        if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
          console.log('[Service Worker] Removing old cache.', key);
          return caches.delete(key);
        }
      })))
  );

  return self.clients.claim();
});

const isInArray = (string, array) => {
	let cachePath;

	if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
    console.log('matched ', string);
    cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
  } else cachePath = string; // store the full request (for CDNs)

	return array.indexOf(cachePath) > -1;
};

self.addEventListener('fetch', event => {
	const url = 'https://pwagram-c7974.firebaseio.com/posts';

  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(fetch(event.request)
      .then(res => {
	      const clonedRes = res.clone();

        clearAllData('posts')
          .then(() => clonedRes.json())
          .then(data => {
            for (let key in data) {
              writeData('posts', data[key]);
            }
          });

        return res;
      })
    );
  } else if (isInArray(event.request.url, STATIC_FILES)) {
    event.respondWith(
      caches.match(event.request)
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) return response;
          else return fetch(event.request)
            .then(res => caches.open(CACHE_DYNAMIC_NAME)
              .then(cache => {
                // trimCache(CACHE_DYNAMIC_NAME, 3);
                cache.put(event.request.url, res.clone());

                return res;
              })
            )
            .catch(err => caches.open(CACHE_STATIC_NAME)
              .then(cache => {
                if (event.request.headers.get('accept').includes('text/html')) {
                  return cache.match('/offline.html');
                }
              })
            )
        })
    );
  }
});

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         if (response) {
//           return response;
//         } else {
//           return fetch(event.request)
//             .then(function(res) {
//               return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//             })
//             .catch(function(err) {
//               return caches.open(CACHE_STATIC_NAME)
//                 .then(function(cache) {
//                   return cache.match('/offline.html');
//                 });
//             });
//         }
//       })
//   );
// });

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function(res) {
//         return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//       })
//       .catch(function(err) {
//         return caches.match(event.request);
//       })
//   );
// });

// Cache-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//   );
// });

// Network-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//   );
// });

self.addEventListener('sync', event => {
	console.log('[Service Worker] Background syncing', event);

	if (event.tag === 'sync-new-post') {
		console.log('[Service Worker] Syncing new Posts');

		event.waitUntil(
		  readAllData('sync-posts')
        .then(data => {
          for (let {id, title, location} of data) {
	          fetch('https://us-central1-pwagram-c7974.cloudfunctions.net/storePostData.json', {
		          method: 'POST',
		          headers: {
			          'Content-Type': 'application/json',
			          'Accept': 'application/json',
		          },
		          body: JSON.stringify({
			          id,
			          title,
			          location,
			          image: 'https://firebasestorage.googleapis.com/v0/b/pwagram-c7974.appspot.com/o/test_image.jpeg?alt=media&token=5215771c-be55-4e2c-9525-b63bd3bdec6d'
		          })
	          })
		          .then(res => {
			          console.log('Send date', res);

			          if (res.ok) {
			          	res.json().then(resData => {
					          deletePost('sync-posts', resData.id)
				          })
			          }
		          })
              .catch(error => console.log('Error wile sending data', error))
          }
        })
    )
  }

});