import * as moment from 'moment';
import { PathRouteProps, LayoutRouteProps, IndexRouteProps } from 'react-router-dom';
import { User } from 'firebase/auth';
import { FieldValue, Timestamp } from 'firebase/firestore';
import { DatePickRef } from 'antd/lib/date-picker/generatePicker/interface';

import { Value } from 'sass';
import { BirthDateObject } from '../../Redux/account/account-reducer';

export type LinkDataType = {
	path: PathsType,
	text: string,
	id: number;
}

export type RouteDataType = {
	to: PathRouteProps | LayoutRouteProps | IndexRouteProps,
	element: JSX.Element,
}

export type PathsType = '/chat' | '/login' | '/account' | '/myschool';

export type MessageDataType = {
	uid?: string,
	displayName: string | null,
	photoUrl?: string | null,
	text: string,
	createdAt: FieldValue,
	id: string,
	usersWhoRead: Array<string | null>,
}
export type MessagesDataType = MessageDataType[];



//ACCOUNT==============================
export type AccountDataType = {
	class: string,
	school: SchoolSearchItemType,
	name: string,
	surname: string,
	status: 'teacher' | 'schoolboy',
	birthDate: moment.Moment | null, 
	aboutMe: string | null,
	avatar?: File,
}

export type ReceivedAccountDataType = { 
	class: string,
	school: SchoolInfoType,
	name: string,
	surname: string,
	status: 'teacher' | 'schoolboy',
	birthDate: BirthDateObject, 
	aboutMe: string | null,
	avatarUrl?: string,
	uid: string,
}

export type SchoolResultValueType = {
	disabled: boolean,
	key: string,
	label: string,
	value: string,
}

export type SchoolInfoType = {
	website: string,
	region_name: string,
	email: string,
	institution_name: string,
	institution_id: string,
}

//================SCHOOLS=============
export type SchoolSearchItemType = {
	id: number,
	name: string,
	key: string,
	value: string,
}

//=============================MY SCHOOL=========================
//EVENTS
export type EventDataType = {
	title: string,
	leading: string,
	date: {seconds: number, nanoseconds?: number} | Date,
	about: string,
	id: string,
	isPast?: boolean,
}

export type UserType = User;


