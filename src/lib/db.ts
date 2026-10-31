const DATABASE_NAME = 'margenko';
const DATABASE_VERSION = 1;

export const STORES = {
	calculations: 'calculations',
	drafts: 'drafts'
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

let databasePromise: Promise<IDBDatabase> | undefined;

function upgradeDatabase(database: IDBDatabase) {
	if (!database.objectStoreNames.contains(STORES.calculations)) {
		const calculations = database.createObjectStore(STORES.calculations, { keyPath: 'id' });
		calculations.createIndex('updatedAt', 'updatedAt');
	}
	if (!database.objectStoreNames.contains(STORES.drafts)) {
		database.createObjectStore(STORES.drafts, { keyPath: 'id' });
	}
}

function openDatabase() {
	databasePromise ??= new Promise<IDBDatabase>((resolve, reject) => {
		const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
		request.onupgradeneeded = () => upgradeDatabase(request.result);
		request.onsuccess = () => {
			const database = request.result;
			database.onversionchange = () => database.close();
			resolve(database);
		};
		request.onerror = () => reject(request.error);
		request.onblocked = () => reject(new Error('La base de datos está en uso en otra pestaña.'));
	}).catch((error: unknown) => {
		databasePromise = undefined;
		throw error;
	});
	return databasePromise;
}

function requestResult<T>(request: IDBRequest<T>) {
	return new Promise<T>((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

function transactionCompleted(transaction: IDBTransaction) {
	return new Promise<void>((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onerror = () => reject(transaction.error);
		transaction.onabort = () => reject(transaction.error);
	});
}

export async function readRecord<T>(storeName: StoreName, key: IDBValidKey) {
	const database = await openDatabase();
	const store = database.transaction(storeName).objectStore(storeName);
	return requestResult<T | undefined>(store.get(key));
}

export async function readAllRecords<T>(
	storeName: StoreName,
	indexName: string,
	direction: IDBCursorDirection = 'next'
) {
	const database = await openDatabase();
	const index = database.transaction(storeName).objectStore(storeName).index(indexName);
	const cursorRequest = index.openCursor(null, direction);
	const records: T[] = [];

	return new Promise<T[]>((resolve, reject) => {
		cursorRequest.onsuccess = () => {
			const cursor = cursorRequest.result;
			if (!cursor) {
				resolve(records);
				return;
			}
			records.push(cursor.value as T);
			cursor.continue();
		};
		cursorRequest.onerror = () => reject(cursorRequest.error);
	});
}

export async function writeRecord<T>(storeName: StoreName, record: T) {
	const database = await openDatabase();
	const transaction = database.transaction(storeName, 'readwrite');
	transaction.objectStore(storeName).put(record);
	await transactionCompleted(transaction);
}

export async function updateRecord<T>(
	storeName: StoreName,
	key: IDBValidKey,
	update: (current: T | undefined) => T
) {
	const database = await openDatabase();
	const transaction = database.transaction(storeName, 'readwrite');
	const store = transaction.objectStore(storeName);
	const nextRecord = update(await requestResult<T | undefined>(store.get(key)));
	store.put(nextRecord);
	await transactionCompleted(transaction);
	return nextRecord;
}

export async function deleteRecord(storeName: StoreName, key: IDBValidKey) {
	const database = await openDatabase();
	const transaction = database.transaction(storeName, 'readwrite');
	transaction.objectStore(storeName).delete(key);
	await transactionCompleted(transaction);
}

export async function clearStore(storeName: StoreName) {
	const database = await openDatabase();
	const transaction = database.transaction(storeName, 'readwrite');
	transaction.objectStore(storeName).clear();
	await transactionCompleted(transaction);
}
