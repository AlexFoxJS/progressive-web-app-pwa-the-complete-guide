//
self.addEventListener('install', event => {
	console.log('[Service Worker] Install Service Worker ...', event)
});
//
self.addEventListener('activate', event => {
	console.log('[Service Worker] Activating Service Worker ...', event)
	return self.clients.claim()
});
