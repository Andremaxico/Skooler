import { setDoc, addDoc, collection, doc, updateDoc, Unsubscribe, onSnapshot } from 'firebase/firestore';
import { UserType, AccountDataType, ReceivedAccountDataType } from '../utils/types/index';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { firestore, storage } from '../firebase/firebaseApi';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const accountAPI = {
	getAuthData(): UserType | null {
		console.log('api,getAuthData');
		return getAuth().currentUser;
	},

	async setMyAccountDataData(data: ReceivedAccountDataType | null, uid: string) {
		//send account data to database
		await setDoc(doc(firestore, 'users', uid), data);
	},

	async sendAvatar(file: File | Blob, uid: string) {
		console.log('send avatar (api)');
		//get storage reference
		const storageRef = ref(storage, `images/${uid}-avatar.png`);

		//send avatar to storage
		uploadBytes(storageRef, file).then((snapshot) => {
			console.log('Uploaded a blob or file!');
		 });
	},

	async getAvatarUrl(uid: string) {
		//get storage reference
		const storageRef = ref(storage, `images/${uid}-avatar.png`);

		//get avatar url
		const url = await getDownloadURL(storageRef);

		return url;
	},

	async addQuestionToLiked(questionId: string, uid: string, likedArr: string[]) {
		const accountDoc = doc(firestore, 'users', uid);

		await updateDoc(accountDoc, {
			liked: [...likedArr, questionId],
		})
	},

	async removeQuestionFromLiked(questionId: string, uid: string, likedArr: string[]) {
		const accountDoc = doc(firestore, 'users', uid);

		await updateDoc(accountDoc, {
			liked: likedArr.filter(id => id !== questionId) ,
		})
	},
	
	async subscribeOnChanges(uid: string, subscriber: (data: ReceivedAccountDataType) => void) {
		const accountRef = doc(firestore, 'users', uid);

		const unsubscribeFromMyAccountChanges = onSnapshot(accountRef, 
			(querySnap) => {
				let updatedAccountData: null | ReceivedAccountDataType = null;
				if(querySnap.exists()) {
					updatedAccountData = querySnap.data() as ReceivedAccountDataType;

					subscriber(updatedAccountData);
				}
			})
	},
	
	async createAccountByEmail(email: string, password: string) {
		const auth = getAuth();
		try {
			const {user} = await createUserWithEmailAndPassword(auth, email, password);

			return user;
		} catch(error: any) {
			//TODO:
			//use errors messages

			const errorCode = error.code;
			const errorMessage = error.message;

			console.log('create account error', error);
			// ..
		}
	} 
}