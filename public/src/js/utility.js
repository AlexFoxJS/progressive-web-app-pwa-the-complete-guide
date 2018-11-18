const dbPromise = idb.open('posts-store', 1, db => {
	if (!db.objectStoreNames.contains('posts')) {
		db.createObjectStore('posts', {keyPath: 'id'});
	}
});

const writeData = (store, data) => dbPromise
	.then(db => {
		const tx = db.transaction(store, 'readwrite');
		const store = tx.objectStore(store);

		store.put(data);

		return tx.complete;
	});