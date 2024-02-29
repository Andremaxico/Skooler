import { FinalUpdatedAccountDataType, UpdatedAccountDataType } from './../utils/types/index';
import { checkEmailForExisting, sendEmailVerificationLink } from './../Redux/account/account-reducer';
import { setDoc, addDoc, collection, doc, updateDoc, Unsubscribe, onSnapshot, deleteDoc } from 'firebase/firestore';
import { UserType, AccountDataType, ReceivedAccountDataType } from '../utils/types/index';
import { FacebookAuthProvider, User, createUserWithEmailAndPassword, deleteUser, fetchSignInMethodsForEmail, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
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
		try {
			await setDoc(doc(firestore, 'users', uid), data);
		} catch(e)	{
			return e;
		}
	},

	async updateMyAccountData(data: FinalUpdatedAccountDataType, uid: string,) {
		const ref = doc(firestore, 'users', uid);
		try {
			await updateDoc(ref, {
				...data,
			});
		} catch(e) {
			return e;
		}
	},

	async logOut() {
		try {
			await signOut(auth);
		} catch(e) {
			return e;
		}
	},	

	async  sendAvatar(file: File | Blob, uid: string) {
		console.log('send avatar (api)', file);
		//get storage reference
		const storageRef = ref(storage, `images/${uid}-avatar.png`);

		try {
			//send avatar to storage
			const res = await uploadBytes(storageRef, file);
			const url = await getDownloadURL(res.ref);
			return url;
		} catch(e) {
			return e;
		}
	},

	async deleteAvatar(uid: string) {
		const objRef = ref(storage, `images/${uid}-avatar.png`);

		try {
			await deleteObject(objRef);
		} catch (e) {
			return e;
		}
	},

	async getAvatarUrl(uid: string) {
		//get storage reference
		const storageRef = ref(storage, `images/${uid}-avatar.png`);

		try {
			//get avatar url
			const url = await getDownloadURL(storageRef);

			console.log('url');

			return url;
		} catch(e) {
			return e;
		}
	},

	async addQuestionToLiked(questionId: string, uid: string, likedArr: string[]) {
		const accountDoc = doc(firestore, 'users', uid);

		try {
			await updateDoc(accountDoc, {
				liked: [...likedArr, questionId],
			})
		} catch(e) {
			return e;
		}
	},

	async removeQuestionFromLiked(questionId: string, uid: string, likedArr: string[]) {
		const accountDoc = doc(firestore, 'users', uid);

		try {
			await updateDoc(accountDoc, {
				liked: likedArr.filter(id => id !== questionId) ,
			})
		} catch(e) {
			return e;
		}
	},
	
	async subscribeOnChanges(uid: string, subscriber: (data: ReceivedAccountDataType) => void) {
		const accountRef = doc(firestore, 'users', uid);

		try {
			unsubscribeFromMyAccountChanges = onSnapshot(accountRef, 
				(querySnap) => {
					let updatedAccountData: null | ReceivedAccountDataType = null;
					if(querySnap.exists()) {
						updatedAccountData = querySnap.data() as ReceivedAccountDataType;
	
						subscriber(updatedAccountData);
					}
				}
			)
		} catch(e) {
			return e;
		}
	},
	
	async createAccountByEmail(email: string, password: string) {
		try {
			const {user} = await createUserWithEmailAndPassword(auth, email, password);
			return user;
		} catch(e) {
			return e;
		}
	},

	async sendEmailVerificationLink(email: string, code: number) {
		// axios.post('http://localhost:5000/send_email', email)
		// 	.then(() => console.log('email sent'))
		// 	.catch(error => console.log('error', error));

		try {
			await axios({
				method: 'post',
				url: 'http://localhost:5000/send_email',
				data: {
					email, 
					code: code.toString(),
				},
				//it must be here for working
				validateStatus: (status) => {
					return true; // I'm always returning true, you may want to do it depending on the status received
				},
			});
		} catch(e) {
			return e;
		}

		//axios.get('http://localhost:5000').then(res => console.log('res', res));
	},

	async checkEmailForExisting(email: string) {
		try {
			const methods = await fetchSignInMethodsForEmail(auth, email);
			return methods.length > 0;
		} catch(e) {
			return e;
		}
	},

	async deleteUser(user: User) {
		try {
			await deleteUser(user);
		} catch(e) {
			return e;
		}
	},

	async deleteUserData(uid: string) {
		try {
			await deleteDoc(doc(firestore, "users", uid));
		} catch(e) {
			return e;
		}
	},

	async signInWithEmail(email: string, password: string) {
		try {
			const {user} = await signInWithEmailAndPassword(auth, email, password);
			return user;
		} catch(e) {
			return e;
		}
	},

	async loginWithFacebook() {
		try {
			const provider = new FacebookAuthProvider();

			const result = await signInWithPopup(auth, provider);
	
			const credential = FacebookAuthProvider.credentialFromResult(result);
			const accessToken = credential?.accessToken;
	
			return result.user;
		} catch(e) {
			return e;
		}
	},

	async sendPasswordResetEmail(email: string) {
		try {
			await sendPasswordResetEmail(auth, email);
		} catch(e) {
			return e;
		}
	},
}