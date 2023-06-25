import { setDoc, addDoc, collection, doc, updateDoc, Unsubscribe, onSnapshot, deleteDoc } from 'firebase/firestore';
import { UserType, AccountDataType, ReceivedAccountDataType } from '../utils/types/index';
import { FacebookAuthProvider, User, createUserWithEmailAndPassword, deleteUser, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, firestore, storage } from '../firebase/firebaseApi';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const accountAPI = {
	getAuthData(): UserType | null {
		console.log('api,getAuthData');
		return getAuth().currentUser;
	},

	async setMyAccountData(data: ReceivedAccountDataType | null, uid: string) {
		console.log('send my account data', data);
		//send account data to database
		await setDoc(doc(firestore, 'users', uid), data);
	},

	async  sendAvatar(file: File | Blob, uid: string) {
		console.log('send avatar (api)', file);
		//get storage reference
		const storageRef = ref(storage, `images/${uid}-avatar.png`);

		//send avatar to storage
		await uploadBytes(storageRef, file);
		console.log('uploaded avatar');
	},

	async getAvatarUrl(uid: string) {
		//get storage reference
		const storageRef = ref(storage, `images/${uid}-avatar.png`);

		//get avatar url
		const url = await getDownloadURL(storageRef);

		console.log('url');

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
		const {user} = await createUserWithEmailAndPassword(auth, email, password);

		return user;
	},

	async deleteUser(user: User) {
		await deleteUser(user)
	},

	async deleteUserData(uid: string) {
		await deleteDoc(doc(firestore, "users", uid));
	},

	async signInWithEmail(email: string, password: string) {
		const {user} = await signInWithEmailAndPassword(auth, email, password);

		return user;
	},

	async loginWithFacebook() {
		const provider = new FacebookAuthProvider();

		const result = await signInWithPopup(auth, provider);

		const credential = FacebookAuthProvider.credentialFromResult(result);
		const accessToken = credential?.accessToken;

		return result.user;
	},

	async sendPasswordResetEmail(email: string) {
		await sendPasswordResetEmail(auth, email);
	},
}