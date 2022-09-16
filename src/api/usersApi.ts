import { collection, Firestore, getDoc, getDocs, query, where } from 'firebase/firestore';
import { AccountDataType } from './../utils/types/index';
import axios from 'axios';
import { addDoc, doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase/firebaseApi';

export type BirthDateObject = {
	date: number,
	hours?: number,
	miliseconds?: number,
	minutes?: number,
	months: number,
	seconds?: number,
	years: number,

}

const instance = axios.create({
	baseURL: 'https://real-time-chat-test-ece84-default-rtdb.europe-west1.firebasedatabase.app/',
})

let uid: string = '';

auth.onAuthStateChanged((user) => {
	if(user) {
		uid = user.uid;
	}
});

export const usersAPI = {
	async getUsers() {
		let users: AccountDataType[] = [];

		const collRef = collection(firestore, 'users');

		const querySnapshot = await getDocs(collection(firestore, 'users'));
		querySnapshot.forEach((doc) => {
			users.push(doc.data());
			console.log(doc.id, " => ", doc.data());
		});

		return users;
	},

	async getUserById(uid: string) {
		//let user: AccountDataType | null = null;

		const docSnap = await getDoc(doc(firestore, 'users', uid));

		if(docSnap.exists()) {
			return docSnap.data();
		} else {
			console.error('Такого користувача не існує!');
		}
	},

	async addUser(userData: AccountDataType) {
		const res = await instance.post('/users.json', {...userData});
		return res;
	},

	async setMyAccountData(data: AccountDataType) {
		if(data) {
			const birthDate: BirthDateObject = Object.assign({}, data.birthDate.toObject());
			const accountData = {...data, birthDate}
			await setDoc(doc(firestore as Firestore, 'users', uid), accountData);
		}
	}
}