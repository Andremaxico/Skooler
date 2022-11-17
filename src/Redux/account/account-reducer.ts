import { authAPI } from './../../api/authApi';
import { AppDispatchType, RootStateType } from './../store';
import { ThunkAction } from 'redux-thunk';
import { AccountDataType, ReceivedAccountDataType, UserType, SchoolInfoType } from './../../utils/types/index';
import { createReducer, createAction, AnyAction } from '@reduxjs/toolkit';
import { schoolsAPI } from '../../api/schoolsApi';
import { usersAPI } from '../../api/usersApi';
import { User } from 'firebase/auth';

export type AccountStateType = {
	myAccountData: ReceivedAccountDataType | null,
	myLoginData: User | null,
	currUserAccount: ReceivedAccountDataType | null | undefined,
	isFetching: boolean,
	currMyAvatarUrl: string | null,
}
type _ThunkType = ThunkAction<void, AccountStateType, unknown, AnyAction>;


//=========ACTIONS=========
export const accountDataReceived = createAction<ReceivedAccountDataType | null>('account/SET_MY_ACCOUNT_DATA');
export const loginDataReceived = createAction<User | null>('account/LOGIN_DATA_RECEIVED');
export const currUserAccountReceived = createAction<ReceivedAccountDataType | undefined>('account/CURR_USER_ACCOUNT_RECEIVED');
export const schoolInfoReceived = createAction<SchoolInfoType>('account/SCHOOL_INFO_RECEIVED');
export const isFetchingStatusChanged = createAction<boolean>('account/IS_FETCHING_STATUS_CHANGED');
export const avatarUrlReceived = createAction<string>('account/AVATAR_IMAGE_RECEIVED');
export const currMyAvatarUrlReceived = createAction<string>('auth/CURR_MY_AVATAR_URL_RECEIVED');

const initialState: AccountStateType = {
	myAccountData: null,
	myLoginData: null,
	currUserAccount: null,
	isFetching: false,
	currMyAvatarUrl: null,
}

//uses in ReceivedAccountDataType
export type BirthDateObject = {
	date: number,
	hours?: number,
	miliseconds?: number,
	minutes?: number,
	months: number,
	seconds?: number,
	years: number,
}


const accountReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(accountDataReceived, (state, action) => {
			state.myAccountData = action.payload;
		})
		.addCase(currUserAccountReceived, (state, action) => {
			state.currUserAccount = action.payload;
		})
		.addCase(loginDataReceived, (state, action) => {
			state.myLoginData = action.payload
		})
		.addCase(schoolInfoReceived, (state, action) => {
			if(state.myAccountData) {
				state.myAccountData.school = action.payload;
			}
		})
		.addCase(avatarUrlReceived, (state, action) => {
			if(state.myAccountData) {
				state.myAccountData.avatarUrl = action.payload;
			}
		})
		.addCase(currMyAvatarUrlReceived, (state, action) => {
			state.currMyAvatarUrl = action.payload;
		})
		.addDefaultCase((state, action) => {});
});

export const searchSchool = async (value: string) => {
	const data = await schoolsAPI.getSchoolsByName(value);
	return data;
}

export const setMyAccount = (authData: UserType) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	dispatch(isFetchingStatusChanged(true));
	const data: ReceivedAccountDataType | undefined = await usersAPI.getUserById(authData.uid as string);

	if(data) {
		dispatch(accountDataReceived(data));
	}
	//dispatch(isFetchingStatusChanged(false));
}

export const setAnotherUserAccount = (uid: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	dispatch(isFetchingStatusChanged(true));
	const data: ReceivedAccountDataType | undefined = await usersAPI.getUserById(uid);
	dispatch(currUserAccountReceived(data));
	dispatch(isFetchingStatusChanged(false));
}

export const setMyAvatarUrl = (file: File | Blob) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const uid = getState().account.myLoginData?.uid;

	if(uid) {
		//send file to server
		await authAPI.sendAvatar(file, uid);

		//get avatar url 
		const url = await authAPI.getAvatarUrl(uid);

		console.log('avatar url', url);

		dispatch(avatarUrlReceived(url));
	}

} 

export const sendMyAccountData = (data: AccountDataType | null) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	dispatch(isFetchingStatusChanged(true));
	const uid = getState().account.myLoginData?.uid;
	const loginData = getState().account.myLoginData;

	console.log('send my account data');

	if(uid && data) {
		let accountData: ReceivedAccountDataType | null = null;
		const { avatar, ...restData } = data;

		//get large data about school
		const schoolData = data.schoolId ? await schoolsAPI.getSchoolInfo(data.schoolId) : null;

		//formatting birthdate
		const birthDate: BirthDateObject = Object.assign({}, restData?.birthDate?.toObject());

		//send avatar file to server
		if(avatar) {
			await authAPI.sendAvatar(avatar, uid);
		}

		//get avatar url 
		const avatarUrl = await authAPI.getAvatarUrl(uid);

		//set new account data
		if(schoolData && data) {
			accountData = {
				...restData, school: schoolData, birthDate: birthDate,
				avatarUrl: avatarUrl, uid: uid
			}; 
		}

		//server send account data
		await authAPI.setMyAccountData(accountData, uid);
		if(loginData) {
			//set data to state
			dispatch(setMyAccount(loginData));
		}
	}

	dispatch(isFetchingStatusChanged(false));
}


export const sendMyCurrentAvatar = (file: File | undefined, uid: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	console.log('send avatar file', file);
	if(file) {
		await authAPI.sendAvatar(file, uid);
		const avatarUrl = await authAPI.getAvatarUrl(uid);
		dispatch(currMyAvatarUrlReceived(avatarUrl));
	}
}

export default accountReducer;