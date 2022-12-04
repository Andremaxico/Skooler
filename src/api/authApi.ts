import { setDoc, addDoc, collection, doc } from 'firebase/firestore';
import { UserType, AccountDataType, ReceivedAccountDataType } from './../utils/types/index';
import { getAuth } from 'firebase/auth';
import { firestore, storage } from '../firebase/firebaseApi';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const authAPI = {
	getAuthData(): UserType | null {
		console.log('api,getAuthData');
		return getAuth().currentUser;
	},

	async setMyAccountData(data: ReceivedAccountDataType | null, uid: string) {
		//send account data to database
		await setDoc(doc(firestore, 'users', uid), data);
	},

	sendAvatar(file: File | Blob, uid: string) {
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
	}

}