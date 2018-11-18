//
const CACHE_USER_REQUESTED_NAME = 'user-requested';

//
const MOCK_URL_GET = 'https://httpbin.org/get';
const MOCK_URL_POST = 'https://httpbin.org/post';

// Real API Url's
const API_POST_FETCH = "https://pwagram-c7974.firebaseio.com/posts.json";
const API_POST_FETCH_CACHE = "/posts.json";

//
const shareImageButton = document.querySelector('#share-image-button');
const createPostArea = document.querySelector('#create-post');
const closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
const sharedMomentsArea = document.querySelector('#shared-moments');

//
let networkDataRecived = false;

//
const keysList = data => {
	let objectKeys = [];

	for (let key in data) {
		objectKeys.push(data[key])
	}

	return objectKeys;
};

//
openCreatePostModal = () => {
	createPostArea.style.display = 'block';

	if (deferentPrompt) {

		deferentPrompt.prompt();

		deferentPrompt.userChoice.then(choiceResult => {
			console.log(choiceResult.outcome);

			if (choiceResult.outcome === 'dismissed') console.log('User canceled instalation');
			else console.log('User added to home screen');
		});

		deferentPrompt = null;
	}

	if ('serviceWorker' in window) {
		navigator.serviceWorker.getRegistrations()
			.then(registrations => {
				for (let i = 0; i < registrations.length; i++) {
					registrations[i].unregister();
				}
			})
	}
};
shareImageButton.addEventListener('click', openCreatePostModal);

//
closeCreatePostModal = () => {
	createPostArea.style.display = 'none';
};
closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// // Currently not in use, allows to save a assets in cache on demand otherwise
// const onSaveButtonClicked = event => {
// 	console.log('onSaveButtonClicked', event);
//
// 	if ('caches' in window) {
// 		caches.open(CACHE_USER_REQUESTED_NAME)
// 			.then(cache => {
// 				cache.add(MOCK_URL_GET);
// 				cache.add('/src/images/sf-boat.jpg');
// 			})
// 	}
// };

//
const clearCards = () => {
	while (sharedMomentsArea.hasChildNodes()) {
		sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
	}
};

//
const createCard = ({image, title, location}) => {
	const cardWrapper = document.createElement('div');
	const cardTitle = document.createElement('div');
	const cardTitleTextElement = document.createElement('h2');
	const cardSupportingText = document.createElement('div');

	cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp mdl-cell';

	cardTitle.className = 'mdl-card__title';
	cardTitle.style.backgroundImage = `url(${image})`;
	cardTitle.style.backgroundSize = 'cover';
	cardTitle.style.height = '180px';
	cardWrapper.appendChild(cardTitle);

	cardTitleTextElement.className = 'mdl-card__title-text';
	cardTitleTextElement.textContent = title;
	cardTitleTextElement.style.color = 'white';
	cardTitle.appendChild(cardTitleTextElement);

	cardSupportingText.className = 'mdl-card__supporting-text';
	cardSupportingText.textContent = location;
	cardSupportingText.style.textAlign = 'center';

	// 68 Offering Cache on Demand
	// const cardSaveButton = document.createElement('button');
	// cardSaveButton.className = 'mdl-button mdl-js-button mdl-button--primary';
	// cardSaveButton.textContent = 'Save';
	// cardSaveButton.addEventListener('click', onSaveButtonClicked);
	// cardSupportingText.appendChild(cardSaveButton);

	cardWrapper.appendChild(cardSupportingText);

	componentHandler.upgradeElement(cardWrapper);
	sharedMomentsArea.appendChild(cardWrapper);
};

//
const updateUI = data => {
	clearCards();

	for (let i = 0; i < data.length; i++) {
		createCard(data[i]);
	}
};

//
fetch(API_POST_FETCH)
	.then(res => res.json())
	.then(data => {
		console.log('From web (feed.js - 1):', data);
		networkDataRecived = true;
		updateUI(keysList(data));
	})

	.catch(error => {
		console.log('FETCH ERROR (feed.js - 1):', error);
	});

//
if ('indexedDB' in window) {

	readAllData('posts')
		.then(data => {
			if (!networkDataRecived && data) {
				console.log('From cache (feed.js - 4):', data);
				updateUI(data);
			}
		});

	// //
	// caches.match(MOCK_URL_GET)
	// 	.then(res => {
	// 		if (res) return res.json()
	// 	})
	// 	.then(data => {
	// 		if (!networkDataRecived && data) {
	// 			console.log('From cache (feed.js - 1):', data);
	// 			updateUI(keysList(data));
	// 		}
	// 	});
	//
	// //
	// caches.match(API_POST_FETCH)
	// 	.then(res => {
	// 		if (res) return res.json()
	// 	})
	// 	.then(data => {
	// 		if (!networkDataRecived && data) {
	// 			console.log('From cache (feed.js - 2):', data);
	// 			updateUI(keysList(data));
	// 		}
	// 	});
	//
	// //
	// caches.match(API_POST_FETCH_CACHE)
	// 	.then(res => {
	// 		if (res) return res.json()
	// 	})
	// 	.then(data => {
	// 		if (!networkDataRecived && data) {
	// 			console.log('From cache (feed.js - 3):', data);
	// 			updateUI(keysList(data));
	// 		}
	// 	});

}
