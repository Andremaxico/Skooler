import * as moment from 'moment';
import { PathRouteProps, LayoutRouteProps, IndexRouteProps } from 'react-router-dom';
import { User } from 'firebase/auth';
import { FieldValue } from 'firebase/firestore';
import { DatePickRef } from 'antd/lib/date-picker/generatePicker/interface';

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
	class?: number,
	school?: SchoolResultValueType,
	name?: string,
	surname?: string,
	status?: 'teacher' | 'schoolboy',
	birthDate?: moment.Moment | null | any, 
	aboutMe?: string | null,
}

export type SchoolResultValueType = {
	disabled: boolean,
	key: string,
	label: string,
	value: string,
}

//================SCHOOLS=============
export type SchoolSearchItemType = {
	id: number,
	name: string,
}

export type UserType = User;


