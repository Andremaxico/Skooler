import { FinalUpdatedAccountDataType, UpdatedAccountDataType } from './../utils/types/index';
import { checkEmailForExisting, sendEmailVerificationLink } from './../Redux/account/account-reducer';
import { setDoc, addDoc, collection, doc, updateDoc, Unsubscribe, onSnapshot, deleteDoc } from 'firebase/firestore';
import { UserType, AccountDataType, ReceivedAccountDataType } from '../utils/types/index';
import { ActionCodeSettings, FacebookAuthProvider, User, createUserWithEmailAndPassword, deleteUser, fetchSignInMethodsForEmail, getAuth, sendEmailVerification, sendPasswordResetEmail, sendSignInLinkToEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, firestore, storage } from '../firebase/firebaseApi';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import axios from 'axios';

let unsubscribeFromMyAccountChanges: Unsubscribe | null = null;

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

	async updateMyAccountData(data: FinalUpdatedAccountDataType, uid: string,) {
		const ref = doc(firestore, 'users', uid);
		await updateDoc(ref, {
			...data,
		});
	},

	async logOut() {
		await signOut(auth);
	},	

	async  sendAvatar(file: File | Blob, uid: string) {
		console.log('send avatar (api)', file);
		//get storage reference
		const storageRef = ref(storage, `images/${uid}-avatar.png`);

		//send avatar to storage
		const res = await uploadBytes(storageRef, file);
		const url = await getDownloadURL(res.ref);
		return url;
	},

	async deleteAvatar(uid: string) {
		const objRef = ref(storage, `images/${uid}-avatar.png`);
		await deleteObject(objRef);
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
		unsubscribeFromMyAccountChanges = onSnapshot(accountRef, 
			(querySnap) => {
				let updatedAccountData: null | ReceivedAccountDataType = null;
				if(querySnap.exists()) {
					updatedAccountData = querySnap.data() as ReceivedAccountDataType;

					subscriber(updatedAccountData);
				}
			}
		)
	},
	
	async createAccountByEmail(email: string, password: string) {
		const {user} = await createUserWithEmailAndPassword(auth, email, password);
		return user;
	},

	async sendEmailVerificationLink(email: string) {
		const url = document.location.origin;
		console.log('url', url);
		console.log('email', email);
		const actionCodeSettings: ActionCodeSettings = {
			// URL you want to redirect back to. The domain (www.example.com) for this
			// URL must be in the authorized domains list in the Firebase Console.
			url: url,
			// This must be true.
			handleCodeInApp: true,
		};

		await sendSignInLinkToEmail(auth, email, actionCodeSettings)
		// The link was successfully sent -> Informing the user in UI
		// Save the email locally so you don't need to ask the user for it again
		// if they open the link on the same device.
		window.localStorage.setItem('emailForSignIn', email);
	},

	async checkEmailForExisting(email: string) {
		console.log('email for checking', email);
		const methods = await fetchSignInMethodsForEmail(auth, email);
		return methods.length > 0;
	},

	async deleteUser(user: User) {
		await deleteUser(user);
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