import { collection, Firestore } from 'firebase/firestore';
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
		const res = await instance.get<AccountDataType[]>('/users.json');
		return res.data;
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