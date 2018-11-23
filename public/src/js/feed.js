const shareImageButton = document.querySelector('#share-image-button');
const createPostArea = document.querySelector('#create-post');
const closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
const sharedMomentsArea = document.querySelector('#shared-moments');
const form = document.querySelector('form');
const titleInput = document.querySelector('#title');
const locationInput = document.querySelector('#location');

const FIREBASE_TABLE_POSTS_URL = 'https://pwagram-c7974.firebaseio.com/posts.json';
let networkDataReceived = false;

const openCreatePostModal = () => {
  createPostArea.style.display = 'block';

  setTimeout(() => {
	  createPostArea.style.transform = 'translateY(0)';
  }, 1);

  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(choiceResult => {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') console.log('User cancelled installation');
      else console.log('User added to home screen');
    });

    deferredPrompt = null;
  }

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.getRegistrations()
  //     .then(function(registrations) {
  //       for (var i = 0; i < registrations.length; i++) {
  //         registrations[i].unregister();
  //       }
  //     })
  // }
};

const closeCreatePostModal = () => {
	createPostArea.style.transform = 'translateY(100vh)';
	setTimeout(() => {
		createPostArea.style.display = 'none';
	}, 300)
};

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// Currently not in use, allows to save assets in cache on demand otherwise
const onSaveButtonClicked = event => {
  console.log('clicked');

  if ('caches' in window) {
    caches.open('user-requested')
      .then(cache => {
        cache.add('https://httpbin.org/get');
        cache.add('/src/images/sf-boat.jpg');
      });
  }
};

const clearCards = () => {
  while(sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
};

const createCard = data => {
  const cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';

  const cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url(' + data.image + ')';
  cardWrapper.appendChild(cardTitle);

  const cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'white';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);

  const cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = data.location;
  cardSupportingText.style.textAlign = 'center';
	cardWrapper.appendChild(cardSupportingText);

  // const cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);

  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
};

const updateUI = data => {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
};

fetch(FIREBASE_TABLE_POSTS_URL)
  .then(res => {
    return res.json()
  })
  .then(data => {
    networkDataReceived = true;
    console.log('From web', data);
	  const dataArray = [];

    for (let key in data) {
      dataArray.push(data[key]);
    }

    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('posts')
    .then(data => {
      if (!networkDataReceived) {
        console.log('From cache', data);
        updateUI(data);
      }
    });
}

const sendData = () => {
  fetch(FIREBASE_TABLE_POSTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      id: new Date().toISOString(),
	    title: titleInput.value,
	    location: locationInput.value,
      image: 'https://firebasestorage.googleapis.com/v0/b/pwagram-c7974.appspot.com/o/test_image.jpeg?alt=media&token=5215771c-be55-4e2c-9525-b63bd3bdec6d'
    }),
  })
    .then(res => {
	    console.log('Send date', res);
      updateUI();
    })
};

form.addEventListener('submit', event => {
  event.preventDefault();

  if (titleInput.value.trim() === '' || locationInput.value.trim() === '') return;

  closeCreatePostModal();

  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready
      .then(sw => {
	      const newPostData = {
	        id: new Date().toISOString(),
          title: titleInput.value,
          location: locationInput.value,
		      image: 'https://firebasestorage.googleapis.com/v0/b/pwagram-c7974.appspot.com/o/test_image.jpeg?alt=media&token=5215771c-be55-4e2c-9525-b63bd3bdec6d',
        };

	      writeData('sync-posts', newPostData)
          .then(() => sw.sync.register('sync-new-post'))
          .then(() => {
            const snackbarContainer = document.querySelector('#confirmation-toast');
            const data = { message: 'Your post was saved in local sync data!' };
	          snackbarContainer.MaterialSnackbar.showSnackbar(data);
          })
          .catch(error => console.error('Save post to indexedDB.', error))

      });
  } else {
	  sendData();
  }


});
