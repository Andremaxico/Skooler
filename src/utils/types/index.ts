import * as moment from 'moment';
import { PathRouteProps, LayoutRouteProps, IndexRouteProps } from 'react-router-dom';
import { User } from 'firebase/auth';
import { FieldValue } from 'firebase/firestore';
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

export type PathsType = '/chat' | '/login' | '/account' 

export type MessageDataType = {
	uid?: string,
	displayName?: string | null,
	photoUrl?: string | null,
	text: string,
	createdAt?: FieldValue,
	id?: string,
}
export type MessagesDataType = MessageDataType[];



//ACCOUNT==============================
export type AccountDataType = {
	class: number,
	school: SchoolSearchItemType,
	name: string,
	surname: string,
	status: 'teacher' | 'schoolboy',
	birthDate: moment.Moment | null, 
	aboutMe: string | null,
	avatar?: File,
}

export type ReceivedAccountDataType = { 
	class: number,
	school: SchoolInfoType,
	name: string,
	surname: string,
	status: 'teacher' | 'schoolboy',
	birthDate: BirthDateObject, 
	aboutMe: string | null,
	avatarUrl?: string,
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

export type UserType = User;


