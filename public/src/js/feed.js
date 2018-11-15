//
const CAHCE_USER_REQUESTED_NAME = 'user-requested';

//
const shareImageButton = document.querySelector('#share-image-button');
const createPostArea = document.querySelector('#create-post');
const closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
const sharedMomentsArea = document.querySelector('#shared-moments');

//
openCreatePostModal = () => {
	createPostArea.style.display = 'block';

	if (deferentPrompt) {

		deferentPrompt.prompt();

		deferentPrompt.userChoice.then(choiceResult => {
			console.log(choiceResult.outcome);

			if (choiceResult.outcome === 'dismissed') {
				console.log('User canceled instalation');
			} else {
				console.log('User added to home screen');
			}

		});

		deferentPrompt = null;
	}

};
shareImageButton.addEventListener('click', openCreatePostModal);

//
closeCreatePostModal = () => {
	createPostArea.style.display = 'none';
};
closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// Currently not in use, allows to save a assets in cache on demand otherwise
onSaveButtonClicked = event => {
	console.log('onSaveButtonClicked', event);

	caches.open(CAHCE_USER_REQUESTED_NAME)
		.then(cache => {
			cache.add('https://httpbin.org/get');
			cache.add('/src/images/sf-boat.jpg')
		})
};

//
createCard = () => {
	const cardWrapper = document.createElement('div');
	const cardTitle = document.createElement('div');
	const cardTitleTextElement = document.createElement('h2');
	const cardSupportingText = document.createElement('div');
	const cardSaveButton = document.createElement('button');

	cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp mdl-cell';

	cardTitle.className = 'mdl-card__title';
	cardTitle.style.backgroundImage = 'url("/src/images/sf-boat.jpg")';
	cardTitle.style.backgroundSize = 'cover';
	cardTitle.style.height = '180px';
	cardWrapper.appendChild(cardTitle);

	cardTitleTextElement.className = 'mdl-card__title-text';
	cardTitleTextElement.textContent = 'San Francisco Trip';
	cardTitleTextElement.style.color = 'white';
	cardTitle.appendChild(cardTitleTextElement);

	cardSupportingText.className = 'mdl-card__supporting-text';
	cardSupportingText.textContent = 'In San Francisco';
	cardSupportingText.style.textAlign = 'center';

	// 68 Offering Cache on Demand
	// cardSaveButton.className = 'mdl-button mdl-js-button mdl-button--primary';
	// cardSaveButton.textContent = 'Save';
	// cardSaveButton.addEventListener('click', onSaveButtonClicked);
	// cardSupportingText.appendChild(cardSaveButton);

	cardWrapper.appendChild(cardSupportingText);

	componentHandler.upgradeElement(cardWrapper);
	sharedMomentsArea.appendChild(cardWrapper);
};

//
fetch('https://httpbin.org/get')
	.then(res => res.json())
	.then(data => {
		createCard();
	});
