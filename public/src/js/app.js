//
if (!window.Promise) {
	window.Promise = Promise
}

//
if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/sw.js')
		.then(() => {
			console.log('Service Worker registered!')
		})
		.catch(err => {
			console.log(err)
		})
}

//
let deferentPrompt;
window.addEventListener('beforeinstallprompt', event => {
	console.log('beforeinstallprompt fired');

	event.preventDefault();
	deferentPrompt = event;

	return false;
});
