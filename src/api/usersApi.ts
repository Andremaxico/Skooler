import { orderByChild } from 'firebase/database';
import { collection, Firestore, getDoc, getDocs, query, where, updateDoc, startAt, endAt, orderBy } from 'firebase/firestore';
import { AccountDataType, ReceivedAccountDataType, UserRatingsType } from './../utils/types/index';
import axios from 'axios';
import { addDoc, doc, setDoc} from 'firebase/firestore';
import { auth, firestore } from '../firebase/firebaseApi';
import Typesense from 'typesense';
import functions from 'firebase-functions';
import { SearchParametersWithQueryBy } from 'typesense-instantsearch-adapter';
import { SearchParams } from 'typesense/lib/Typesense/Documents';


//in [try/catch] should be added console.log 

const instance = axios.create({
	baseURL: 'https://real-time-chat-test-ece84-default-rtdb.europe-west1.firebasedatabase.app/',
});

//typesense
const API_KEY = process.env.TYPESENSE_ADMIN_API_KEY || '';
const TYPESENSE_ADMIN_API_KEY = 'yLGOX226ejvixlyNpOW6OUFVso7Grm06';
const TYPESENSE_SEARCH_API_KEY = 'ty2doqyEt64bYOB2XFCGMJgYcBUNoW65';

const client = new Typesense.Client({
	'nodes': [{
	  'host': 'bi6ahwsnqv91ey52p-1.a1.typesense.net', // where xxx is the ClusterID of your Typesense Cloud cluster
	  'port': 443,
	  'protocol': 'https'
	}],
	'apiKey': TYPESENSE_ADMIN_API_KEY,
	'connectionTimeoutSeconds': 2
});

async function createTypesenseCollections() {
	// Every 'collection' in Typesense needs a schema. A collection only
	// needs to be created one time before you index your first document.
	//
	// Alternatively, use auto schema detection:
	// https://typesense.org/docs/latest/api/collections.html#with-auto-schema-detection
	const notesCollection = {
		'name': 'notes',
		'fields': [],
	};

	await client.collections().create(notesCollection);
}

// Update the search index every time a blog post is written.
// exports.onNoteWritten = functions.firestore.document('users/{uid}').onWrite(async (snap, context) => {
// 	// Use the 'nodeId' path segment as the identifier for Typesense
// 	const id = context.params.uid;

// 	// If the note is deleted, delete the note from the Typesense index
// 	if (!snap.after.exists) {
// 	await client.collections('notes').documents(id).delete();
// 	return;
// 	}

// 	// Otherwise, create/update the note in the the Typesense index
// 	const note = snap.after.data();
// 	await client.collections('users').documents().upsert({
// 		id,
// 		owner: note?.owner,
// 		text: note?.text
// 	});
// });


export const usersAPI = {
	async getUsers() {
		let users: ReceivedAccountDataType[] = [];

		const querySnapshot = await getDocs(collection(firestore, 'users'));
		querySnapshot.forEach((doc) => {
			users.push(doc.data() as ReceivedAccountDataType);
			console.log(doc.id, " => ", doc.data());
		});
		return users;
	},

	async getUsersByQuery(queryStr: string) {
		const usersRef = collection(firestore, 'users');

		console.log('get users by query', queryStr);

		// Search for notes with matching text
		// const searchParameters: SearchParams = {
		// 	q: queryStr,
		// 	query_by: 'text'
		// };
		// const searchResults = await client.collections('notes')
		// 	.documents()
		// 	.search(searchParameters);

		// console.log('searchResults', searchResults);
		try {
			if(queryStr) {
				//fullname замість name, тому що починається з ім'я і пошук по name - зайвий
				const surnamesQuery = query(usersRef, 	
					orderBy('surname'), 
					startAt(queryStr), 
					endAt(queryStr+"\uf8ff")
				);
				const fullnamesQuery = query(usersRef, 	
					orderBy('fullName'), 
					startAt(queryStr), 
					endAt(queryStr+"\uf8ff")
				);
				const surnamesSnaps = await getDocs(surnamesQuery);
				const fullnamesSnaps = await getDocs(fullnamesQuery);
	
				const usersSet: Set<ReceivedAccountDataType> = new Set();
	
				surnamesSnaps.forEach(snap => {
					if(snap.exists()) usersSet.add(snap.data() as ReceivedAccountDataType);
				});
	
				fullnamesSnaps.forEach(snap => {
					if(snap.exists()) usersSet.add(snap.data() as ReceivedAccountDataType);
				});
	
				console.log('users set', usersSet);
	
				const users: ReceivedAccountDataType[] = [];
	
				for(let value of usersSet) users.push(value);
	
				return users;
			}
		} catch(e) {

		}
	},

	async getUserById(uid: string) {
		//let user: AccountDataType | null = null;
		console.log('get user by id', uid);

		const docSnap = await getDoc(doc(firestore, 'users', uid));

		try {
			if(docSnap.exists()) {
				return docSnap.data() as ReceivedAccountDataType;
			} else {
				return undefined;
			}
		} catch(e) {

		}
	},

	async userAnswerMarkedAsCorrect(uid: string, prevCount: number) {
		const userRef = doc(firestore, 'users', uid);

		try {
			await updateDoc(userRef, {
				correctAnswersCount: prevCount + 1
			});
		} catch(e) {

		}
	},

	async updateUserRating(uid: string, newRating: UserRatingsType) {
		const userRef = doc(firestore, 'users', uid);


		try {
			await updateDoc(userRef, {
				rating: newRating,
			});
		} catch(e) {

		}
	}
	
}