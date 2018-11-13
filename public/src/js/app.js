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

// Promise
const promice = new Promise((resolve, reject) => {
	setTimeout(() => {
		// resolve('This is executed once the timer is done!');
		reject({
			code: 500,
			message: 'An error occurred!'
		})
	}, 3000)
});

// TESTS API - START
// FETCH (AJAX)
const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://httpbin.org/ip');
xhr.responseType = 'json';

xhr.onload = () => {
	console.log('AJAX_1_0', xhr.response)
};
xhr.onerror = () => {
	console.log('AJAX_1_1', 'error!')
};

xhr.send();

// FETCH
fetch('http://httpbin.org/ip')
	.then(response => {
		console.log('FETCH_1_0', response);
		return response.json();
	})
	.then(data => {
		console.log('FETCH_1_1', data);
	})
	.catch(err => {
		console.log('FETCH_1_2', err);
	});

// POST
fetch(
	'http://httpbin.org/post',
	{
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		mode: "cors",
		body: JSON.stringify({
			message: "Does it work?"
		})
	}
)
	.then(response => {
		console.log('POST_1_0', response);
		return response.json();
	})
	.then(data => {
		console.log('POST_1_1', data);
	})
	.catch(err => {
		console.log('POST_1_2', err);
	});
// TESTS API - END


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
	.then(newText => {
		console.log(newText)
	})
	.catch(err => {
		console.log(err.code, err.message)
	});

console.log('This is executed right after setTimeout()');
