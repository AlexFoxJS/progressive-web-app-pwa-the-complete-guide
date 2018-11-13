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

// TESTS API - START
// FETCH
fetch('http://httpbin.org/ip')
	.then(response => {
		console.log(response);
		return response.json();
	})
	.then(data => {
		console.log(data);
	})
	.catch(err => {
		console.log(err);
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
		console.log(response);
		return response.json();
	})
	.then(data => {
		console.log(data);
	})
	.catch(err => {
		console.log(err);
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
