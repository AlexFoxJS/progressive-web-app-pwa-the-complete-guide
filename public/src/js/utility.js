const dbPromise = idb.open('posts-store', 1, db => {

	if (!db.objectStoreNames.contains('posts')) {
		db.createObjectStore('posts', {keyPath: 'id'});
	}

	if (!db.objectStoreNames.contains('new-post')) {
		db.createObjectStore('new-post', {keyPath: 'id'});
	}

});

const writeData = (st, data) => dbPromise
	.then(db => {
		const tx = db.transaction(st, 'readwrite');
		const store = tx.objectStore(st);

		store.put(data);

		return tx.complete;
	});

const readAllData = st => dbPromise
.then(db => {
	const tx = db.transaction(st, 'readonly');
	const store = tx.objectStore(st);

	return store.getAll();
});

const clearAllData = st => dbPromise
.then(function(db) {
	const tx = db.transaction(st, 'readwrite');
	const store = tx.objectStore(st);

	store.clear();

	return tx.complete;
});

const deletePost = (st, id) => dbPromise
	.then(db => {
		const tx = db.transaction(st, 'readwrite');
		const store = tx.objectStore(st);

		store.delete(id);

		return tx.complete;
	})
	.then(() => {
		console.log('Post was deleted!');
	});