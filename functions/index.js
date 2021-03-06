const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
const serviceAccount = require('./pwagram-fb-key.json');

admin.initializeApp({
	databaseURL: 'https://pwagram-c7974.firebaseio.com/',
	credential: admin.credential.cert(serviceAccount)
});

exports.storePostData = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		admin.database().ref('posts').push({
			id: request.body.id,
			title: request.body.title,
			location: request.body.location,
			image: request.body.image
		})
			.then(() => response.status(201).json({message: 'Data stored', id}))
			.catch(error => response.status(500).json({error}))
	})
});
