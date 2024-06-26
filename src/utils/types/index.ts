import * as moment from 'moment';
import { PathRouteProps, LayoutRouteProps, IndexRouteProps } from 'react-router-dom';
import { User } from 'firebase/auth';
import { FieldValue} from 'firebase/firestore';

import { Value } from 'sass';
import { BirthDateObject } from '../../Redux/account/account-reducer';
import { AnyMxRecord } from 'dns';
import dayjs, { Dayjs } from 'dayjs';

export type ScrollBtnPositionType = {
	right: number,
	bottom: number,
}

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

export type PathsType = '/chat' | '/login' | '/account' | '/myschool' | '/' | '/new-post' | '/post' | '/chats';

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
	sent: boolean,
	isRead: boolean,   
}
export type MessagesDataType = MessageDataType[];


export type ChatDataType = {
	//intelocutor - співрозмовник
	contactId?: string,
	contactFullname?: string,
	contactAvatarUrl?: string,
	lastMessageData: MessageDataType,
	lastMessageTime: FieldValue,
	unreadCount?: number,
}
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
	isEdited: boolean,
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

export type SchoolInfoType = {
	id: number,
	label: string,
}

//comes to redux
export type AccountDataType = {
	class: number,
	schoolInfo: SchoolInfoType,
	status: 'teacher' | 'schoolboy',
	birthDate: Dayjs, 
	gender: 'male' | 'female',
	aboutMe: string | null,
	avatar: File | Blob | undefined,
	fullName: string,
}

//comes to server and from server
export type ReceivedAccountDataType = { 
	class: number,
	school: SchoolDataType,
	gender: 'male' | 'female',
	fullName: string,
	status: 'teacher' | 'schoolboy',
	rating: UserRatingsType,
	birthDate: {
		month: number,
		year: number, 
		date: number
	}, 
	aboutMe: string | null,
	avatarUrl: string | null,
	uid: string,
	email: string | null,
	liked: string[],
	correctAnswersCount: number,
}

export type UpdatedAccountDataType = {
	schoolInfo: SchoolInfoType,
	class: number,
	avatar: File | Blob | null, 
	aboutMe: string,
}

export type FinalUpdatedAccountDataType = {
	class: number,
	school: SchoolDataType,
	avatarUrl: string | null,
	aboutMe: string,
}

export type SchoolResultValueType = {
	disabled: boolean,
	key: string,
	label: string,
	value: string,
}

export type SchoolOptionType = {
	id: number,
	name: string,
};

export type SchoolDataType = {
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

//=====================USER ACTIONS============
export type UserStreamActionTargetType = 
	'post_adding' | 'post_deleting' | 'post_editing' |
	'answer_adding' | 'answer_deleting'
;

export type UserAccountActionTargetType = 
	'changing_info' | 'post_deleting' | 
	'answer_adding' | 'answer_deleting'
;

export type UserActionStatusType = 'loading' | 'success' | 'error';

export type UserActionTargetsType = 
	UserAccountActionTargetType |
	UserStreamActionTargetType

export type UserActionType = {
	target: 
		UserStreamActionTargetType | 
		UserAccountActionTargetType,
	status: UserActionStatusType,
}

//ERRORS====================================
export type AuthActionsTypesType = 
	'signin' | 'register' |
	'reset_password'
;


export type AuthErrorType = {
	message: string,
	type: AuthActionsTypesType,
}

//for many kinds of errors in one state object
export type AuthErrorsType = {
	[key in AuthActionsTypesType]?: AuthErrorType
}

export type AuthActionsType = {
	[key in AuthActionsTypesType]?: UserActionStatusType
}

