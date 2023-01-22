import * as moment from 'moment';
import { PathRouteProps, LayoutRouteProps, IndexRouteProps } from 'react-router-dom';
import { User } from 'firebase/auth';
import { FieldValue} from 'firebase/firestore';
import { DatePickRef } from 'antd/lib/date-picker/generatePicker/interface';

import { Value } from 'sass';
import { BirthDateObject } from '../../Redux/account/account-reducer';
import { AnyMxRecord } from 'dns';

export type LinkDataType = {
	path: PathsType,
	text: string,
	id: number;
}

export type RouteDataType = {
	to: PathRouteProps | LayoutRouteProps | IndexRouteProps,
	element: JSX.Element,
}

export type ControllerFieldType = {
	field: {
		onChange: any,
		value: any,
	}
}

export type PathsType = '/chat' | '/login' | '/account' | '/myschool' | '/' | '/new-post' | '/post';

export type UsersWhoReadMessageType = Array<string | null>;

export type MessageDataType = {
	uid: string,
	displayName: string | null,
	photoUrl?: string | null,
	text: string,
	createdAt: FieldValue,
	id: string,
	usersWhoRead: UsersWhoReadMessageType,
	edited: boolean,
	received: boolean,
}
export type MessagesDataType = MessageDataType[];

//==============STREAM======================
export type QuestionCategoriesType = Array<
	'Математика' |
	'Історія' |
	'Хімія' |
	'Фізика' |
	'Географія'|
	'Біологія'|
	'Інформатика'|
	'Українська мова/література'|
	'Англійська мова'|
	'Німецька мова'|
	'Французька мова' |
	'Зарубіжна література' |
	'Інше'
>;

export type PostBaseType = {
	authorAvatarUrl: string | null,
	authorFullname: string,
	authorId: string,
	authorRating: UserRatingsType,
	text: string,
	id: string,
	stars: number,	
}

export type PostDataType = PostBaseType & {
	commentsCount: number,
	category: QuestionCategoriesType,
	isClosed: boolean,
	createdAt: FieldValue,
}

export type CommentType = PostBaseType & {
	isCorrect: boolean,
	createdAt: FieldValue,
	parentQId: string, 							
};

//ACCOUNT==============================
export type UserRatingsType = 
	'Ніхто' | //0
	'Новачок' | //>1
	'Може підказати' | //>10
	'Можна списати' | //>30
	'Знає багато' | //>50
	'Ботанік' | //>75
	'Легенда' | //>100
	'Сенсей' 	//>150

export type AccountDataType = {
	class: string,
	schoolId: number,
	name: string,
	surname: string,
	status: 'teacher' | 'schoolboy',
	birthDate: moment.Moment | null, 
	aboutMe: string | null,
	avatar?: File,
	email: string,
	password: string,
}

export type ReceivedAccountDataType = { 
	class: string,
	school: SchoolInfoType,
	name: string,
	surname: string,
	status: 'teacher' | 'schoolboy',
	rating: UserRatingsType,
	birthDate: BirthDateObject, 
	aboutMe: string | null,
	avatarUrl?: string,
	uid: string,
	email: string,
	password: string,
	liked: string[],
	correctAnswersCount: number,
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


