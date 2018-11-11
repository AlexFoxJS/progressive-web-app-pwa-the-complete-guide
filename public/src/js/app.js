//
if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/sw.js')
		.then(() => {
			console.log('Service Worker registered!')
		})
}

//
var deferentPrompt;
window.addEventListener('beforeinstallprompt', event => {
	console.log('beforeinstallprompt fired');
	event.preventDefault();
	deferentPrompt = event;
	return false;
});

// Promise
var promice = new Promise((resolve, reject) => {
	setTimeout(() => {
		// resolve('This is executed once the timer is done!');
		reject({
			code: 500,
			message: 'An error occurred!'
		})
	}, 3000)
});

// promice
// 	.then(
// 		text => text,
// 		error => {
// 			console.log(error.code, error.message);
// 		}
// 	)
// 	.then(newText => {
// 		console.log('newText', newText)
// 	});


promice
	.then(text => text)
	.then(newText => {console.log(newText)})
	.catch(err => {console.log(err.code, err.message)});

console.log('This is executed right after setTimeout()');
