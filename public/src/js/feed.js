const shareImageButton = document.querySelector('#share-image-button');
const createPostArea = document.querySelector('#create-post');
const closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
const sharedMomentsArea = document.querySelector('#shared-moments');

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

closeCreatePostModal = () => {
	createPostArea.style.display = 'none';
};

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

createCard = () => {
	const cardWrapper = document.createElement('div');
	const cardTitle = document.createElement('div');
	const cardTitleTextElement = document.createElement('h2');
	const cardSupportingText = document.createElement('div');

	cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';

	cardTitle.className = 'mdl-card__title';
	cardTitle.style.backgroundImage = 'url("/src/images/sf-boat.jpg")';
	cardTitle.style.backgroundSize = 'cover';
	cardTitle.style.height = '180px';
	cardWrapper.appendChild(cardTitle);

	cardTitleTextElement.className = 'mdl-card__title-text';
	cardTitleTextElement.textContent = 'San Francisco Trip';
	cardTitle.appendChild(cardTitleTextElement);

	cardSupportingText.className = 'mdl-card__supporting-text';
	cardSupportingText.textContent = 'In San Francisco';
	cardSupportingText.style.textAlign = 'center';
	cardWrapper.appendChild(cardSupportingText);

	componentHandler.upgradeElement(cardWrapper);
	sharedMomentsArea.appendChild(cardWrapper);
};

fetch('https://httpbin.org/get')
	.then(function(res) {
		return res.json();
	})
	.then(function(data) {
		createCard();
	});
