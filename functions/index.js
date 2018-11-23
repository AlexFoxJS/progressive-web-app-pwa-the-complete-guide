const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.storePostData = functions.https.onRequest((request, response) => {
	cors(({body: {id, title, location, image}}, response) => {
		admin.database().ref('posts').push({id, title, location, image})
			.then(() => {
				return response.status(201).json({ message: 'Data stored', id })
			})
			.catch(error => {
				return response.status(500).json({ error })
			})
	})
});
