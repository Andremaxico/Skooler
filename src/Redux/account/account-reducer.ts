import { accountAPI } from './../../api/accountApi';
import { AppDispatchType, RootStateType } from './../store';
import { ThunkAction } from 'redux-thunk';
import { AccountDataType, ReceivedAccountDataType, UserType, SchoolInfoType, UserRatingsType } from './../../utils/types/index';
import { createReducer, createAction, AnyAction } from '@reduxjs/toolkit';
import { schoolsAPI } from '../../api/schoolsApi';
import { usersAPI } from '../../api/usersApi';
import { User } from 'firebase/auth';
import { idText } from 'typescript';

export type AccountStateType = {
	myAccountData: ReceivedAccountDataType | null,
	myLoginData: User | null,
	currUserAccount: ReceivedAccountDataType | null | undefined,
	isFetching: boolean,
	currMyAvatarUrl: string | null,
	isAuthed: boolean,
}
type _ThunkType = ThunkAction<void, AccountStateType, unknown, AnyAction>;


//=========ACTIONS=========
export const myAccountDataReceived = createAction<ReceivedAccountDataType | null>('account/SET_MY_ACCOUNT_DATA');
export const loginDataReceived = createAction<User | null>('account/LOGIN_DATA_RECEIVED');
export const currUserAccountReceived = createAction<ReceivedAccountDataType | undefined>('account/CURR_USER_ACCOUNT_RECEIVED');
export const schoolInfoReceived = createAction<SchoolInfoType>('account/SCHOOL_INFO_RECEIVED');
export const isFetchingStatusChanged = createAction<boolean>('account/IS_FETCHING_STATUS_CHANGED');
export const avatarUrlReceived = createAction<string>('account/AVATAR_IMAGE_RECEIVED');
export const currMyAvatarUrlReceived = createAction<string>('auth/CURR_MY_AVATAR_URL_RECEIVED');
export const newQuestionLiked = createAction<string>('account/NEW_QUESTION_LIKED');
export const questionUnliked = createAction<string>('account/QESTION_UNLIKED');
export const authStatusChanged = createAction<boolean>('account/AUTH_STATUS_CHANGED');

const initialState: AccountStateType = {
	myAccountData: null,
	myLoginData: null,
	currUserAccount: null,
	isFetching: false,
	currMyAvatarUrl: null,
	isAuthed: false,
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
		.addCase(myAccountDataReceived, (state, action) => {
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
		.addCase(newQuestionLiked, (state, action) => {
			state.myAccountData?.liked.push(action.payload);
		})
		.addCase(questionUnliked, (state, action) => {
			if(state.myAccountData) {
				state.myAccountData = {
					...state.myAccountData, 
					liked: state.myAccountData?.liked.filter(id => (
						id !== action.payload
					))
				}
			}
		})
		.addCase(authStatusChanged, (state, action) => {
			state.isAuthed = action.payload;
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
		dispatch(myAccountDataReceived(data));
		dispatch(authStatusChanged(true));
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
		await accountAPI.sendAvatar(file, uid);

		//get avatar url 
		const url = await accountAPI.getAvatarUrl(uid);

		console.log('avatar url', url);

		dispatch(avatarUrlReceived(url));
	}

} 

export const sendMyAccountData = (data: AccountDataType | null) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	dispatch(isFetchingStatusChanged(true));
	const uid = getState().account.myLoginData?.uid;
	const loginData = getState().account.myLoginData;

	if(uid && data) {
		let accountData: ReceivedAccountDataType | null = null;
		const { avatar, ...restData } = data;

		//get large data about school
		const schoolData = data.schoolId ? await schoolsAPI.getSchoolInfo(data.schoolId) : null;

		//formatting birthdate
		const birthDate: BirthDateObject = Object.assign({}, restData?.birthDate?.toObject());

		//send avatar file to server
		if(avatar) {
			await accountAPI.sendAvatar(avatar, uid);
		}

		//get avatar url 
		const avatarUrl = await accountAPI.getAvatarUrl(uid);

		//set new account data
		if(schoolData && data) {
			accountData = {
				...restData, school: schoolData, birthDate: birthDate,
				avatarUrl: avatarUrl, uid: uid,
				rating: 'Ніхто',
				liked: [],
				correctAnswersCount: 0,
			}; 
		}

		//server send account data
		await accountAPI.setMyAccountData(accountData, uid);
		if(loginData) {
			//set data to state
			dispatch(setMyAccount(loginData));
		}

		//subscribe on changes
		//subscribe for next times...
		const accountSubscriber = (data: ReceivedAccountDataType)  => {
			console.log('subscriber work');
			dispatch(myAccountDataReceived(data));
		}

		accountAPI.subscribeOnChanges(uid, accountSubscriber);
	}

	dispatch(isFetchingStatusChanged(false));

}


export const sendMyCurrentAvatar = (file: File | Blob | undefined, uid: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	console.log('send avatar file', file);
	if(file) {
		await accountAPI.sendAvatar(file, uid);
		const avatarUrl = await accountAPI.getAvatarUrl(uid);
		dispatch(currMyAvatarUrlReceived(avatarUrl));
	}
}

export const addQuestionToLiked = (id: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	dispatch(newQuestionLiked(id));
	const uid = getState().account.myAccountData?.uid || '';
	const likedArr = getState().account.myAccountData?.liked || [];

	await accountAPI.addQuestionToLiked(id, uid, likedArr);

}

export const removeQuestionFromLiked = (id: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	dispatch(questionUnliked(id));

	const uid = getState().account.myAccountData?.uid || '';
	const likedArr = getState().account.myAccountData?.liked || [];

	await accountAPI.removeQuestionFromLiked(id, uid, likedArr);

}

export const userAnswerMarkedAsCorrect = (uid: string) => async (dispatch: AppDispatchType) => {
	const userData = await usersAPI.getUserById(uid);
	const userRating: UserRatingsType = userData ? userData.rating : 'Ніхто';
	const prevCorrAnswersCount = userData ? userData.correctAnswersCount : 0;

	await usersAPI.userAnswerMarkedAsCorrect(uid, prevCorrAnswersCount);

	//щоб змінювати рейинг залежно від кількості вірних відповідей
	if(userRating) {
		//insted of if else..if else
		const currCount = prevCorrAnswersCount + 1;
		//dependency by index
		const checkingCountArray: number[] = [0, 10, 30, 50, 75, 100, 150];
		const checkingRatingsArray: UserRatingsType[] = [
			'Новачок', 
			'Може підказати', 
			'Можна списати', 
			'Знає багато', 
			'Ботанік', 
			'Легенда', 
			'Сенсей'
		];

		//cycle
		for(let i = 0; i <= checkingCountArray.length; i++) {
			if(currCount > checkingCountArray[i] && userRating !== checkingRatingsArray[i]) {
				usersAPI.updateUserRating(uid, checkingRatingsArray[i]);
			}
		}
	}
}

export default accountReducer;