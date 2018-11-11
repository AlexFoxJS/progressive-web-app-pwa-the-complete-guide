var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

function openCreatePostModal() {
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

}

function closeCreatePostModal() {
	createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
