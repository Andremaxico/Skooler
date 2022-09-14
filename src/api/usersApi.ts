import { AccountDataType } from '../utils/types/index';
import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://real-time-chat-test-ece84-default-rtdb.europe-west1.firebasedatabase.app/',
})

export const usersAPI = {
	async getUsers() {
		const res = await instance.get<AccountDataType[]>('/users.json');
		return res.data;
	},

	async addUser(userData: AccountDataType) {
		const res = await instance.post('/users.json', {...userData});
		return res;
	}
}