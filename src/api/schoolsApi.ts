import axios from 'axios';
import { SchoolInfoType, SchoolSearchItemType } from '../utils/types';

const instance = axios.create({
	baseURL: 'https://registry.edbo.gov.ua/api',
 });

export const schoolsAPI = {
	async getSchoolsByName(name: string) {
		console.log('get schools by name', name);

		const res = await instance.get<SchoolSearchItemType[]>(`school-search/?ut=3&lc=&ns=${name || ''}`);
		return res.data;
	},
 
	async getSchoolInfo(id: number) {
		const res = await instance.get<SchoolInfoType>(`institution/?id=${id}&exp=json`);
		console.log('school res', res)
		return res.data;
	}
}

