import { streamAPI } from './../../api/streamApi';
import { accountAPI } from './../../api/accountApi';
import { AppDispatchType, RootStateType } from './../store';
import { ThunkAction } from 'redux-thunk';
import { AccountDataType, ReceivedAccountDataType, UserType, SchoolDataType, UserRatingsType, PostDataType, AuthErrorsType, AuthErrorType, AuthActionsTypesType, AuthActionsType, UpdatedAccountDataType, FinalUpdatedAccountDataType, UserActionStatusType } from './../../utils/types/index';
import { createReducer, createAction, AnyAction } from '@reduxjs/toolkit';
import { schoolsAPI } from '../../api/schoolsApi';
import { usersAPI } from '../../api/usersApi';
import { User, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { NonNullChain, idText } from 'typescript';
import { errorToText } from '../../firebase/firebaseErrorsConverter';
import { getRandomSixDigitCode } from '../../utils/helpers/getRandomSixDigitCode';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebaseApi';

export type AccountStateType = {
	myAccountData: ReceivedAccountDataType | null,
	myLoginData: User | null,
	currUserAccount: ReceivedAccountDataType | null | undefined,
	currUserQuestions: PostDataType[] | null,
	isFetching: boolean,
	currMyAvatarUrl: string | null,
	isAuthed: boolean,
	authErrors: AuthErrorsType,
	authActionsStatuses: AuthActionsType,
	activeRegistrationCode: number | null,
}
type _ThunkType = ThunkAction<void, AccountStateType, unknown, AnyAction>;


//=========ACTIONS=========
export const myAccountDataReceived = createAction<ReceivedAccountDataType | null>('account/SET_MY_ACCOUNT_DATA');
export const myAccountDataUpdated = createAction<FinalUpdatedAccountDataType>('account/MY_ACCOUNT_DATA_UPDATED');
export const loginDataReceived = createAction<User | null>('account/LOGIN_DATA_RECEIVED');
export const currUserAccountReceived = createAction<ReceivedAccountDataType | undefined>('account/CURR_USER_ACCOUNT_RECEIVED');
export const schoolInfoReceived = createAction<SchoolDataType>('account/SCHOOL_INFO_RECEIVED');
export const isFetchingStatusChanged = createAction<boolean>('account/IS_FETCHING_STATUS_CHANGED');
export const avatarUrlReceived = createAction<string>('account/AVATAR_IMAGE_RECEIVED');
export const currMyAvatarUrlReceived = createAction<string>('auth/CURR_MY_AVATAR_URL_RECEIVED');
export const newQuestionLiked = createAction<string>('account/NEW_QUESTION_LIKED');
export const questionUnliked = createAction<string>('account/QESTION_UNLIKED');
export const authStatusChanged = createAction<boolean>('account/AUTH_STATUS_CHANGED');
export const currUserQuestionsReceived = createAction<PostDataType[] | null>('account/CURR_USER_QUESTIONS_RECEIVED');
export const activeRegistrationCodeReceived = createAction<number | null>('auth/ACTIVE_REGISTRATION_CODE_RECEIVED')

export const authErrorReceived = createAction('auth/AUTH_ERROR_RECEIVED', (type: AuthActionsTypesType, message: string) => {
	return {
		payload: {
			type,
			message
		}
	}	
});
export const authErrorRemoved = createAction<AuthActionsTypesType>('auth/AUTH_ERROR_REMOVED');

export const authActionStatusUpdated = createAction('auth/AUTH_ACTION_STATUS_UPDATED', (type: AuthActionsTypesType, status: UserActionStatusType) => {
	return {
		payload: {
			type, 
			status,
		}
	}
});
export const authActionStatusRemoved = createAction<AuthActionsTypesType>('auth/AUTH_ACTION_STATUS_REMOVED');


const initialState: AccountStateType = {
	myAccountData: null,
	myLoginData: null,
	currUserQuestions: null,
	currUserAccount: null,
	isFetching: false,
	currMyAvatarUrl: null,
	isAuthed: false,
	authErrors: {},
	authActionsStatuses: {},
	activeRegistrationCode: null,
}

//using in ReceivedAccountDataType
export type BirthDateObject = {
	date: number,
	hours?: number,
	miliseconds?: number,
	minutes?: number,
	months?: number,
	seconds?: number,
	years?: number,
}


const accountReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(myAccountDataReceived, (state, action) => {
			state.myAccountData = action.payload;
		})
		.addCase(myAccountDataUpdated, (state, action) => {  
			if(state.myAccountData) {
				state.myAccountData = {...state.myAccountData, ...action.payload}
			}
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
		.addCase(currUserQuestionsReceived, (state, action) => {
			state.currUserQuestions = action.payload;
		})
		.addCase(authErrorReceived, (state, action) => {
			const errorMessage = errorToText(action.payload.message);

			state.authErrors[action.payload.type] = {
				...action.payload, 
				message: errorMessage
			};
		})
		.addCase(authErrorRemoved, (state, action) => {
			delete state.authErrors[action.payload];
		})
		.addCase(authActionStatusUpdated, (state, action) => {
			state.authActionsStatuses[action.payload.type] = action.payload.status;
		})
		.addCase(authActionStatusRemoved, (state, action) => {
			delete state.authActionsStatuses[action.payload];
		})
		.addCase(activeRegistrationCodeReceived, (state, action) => {
			state.activeRegistrationCode = action.payload;
		})
		.addDefaultCase((state, action) => {});
});

export const searchSchool = async (value: string) => {
	const data = await schoolsAPI.getSchoolsByName(value);
	return data;
}

export const setMyAccountData = (authData: UserType) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	dispatch(isFetchingStatusChanged(true));
	const data: ReceivedAccountDataType | undefined | Error = await usersAPI.getUserById(authData.uid as string);

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

export const sendMyAccountData = (data: AccountDataType) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	dispatch(isFetchingStatusChanged(true));
	const loginData = getState().account.myLoginData;
	const uid = loginData?.uid;

	console.log('uid', uid, data.avatar );

	if(uid) {
		let accountData: ReceivedAccountDataType | null = null;
		const { avatar, birthDate, ...restData } = data;

		//get large data about school
		const schoolData = data.schoolInfo?.id ? await schoolsAPI.getSchoolInfo(data.schoolInfo.id) : null;

		console.log('data', restData);

		//formatting birthdate
		const formattedBirthDate = {
			month: birthDate.month() + 1,
			year: birthDate.year(),
			date: birthDate.date(),
		};

		console.log('birth date', birthDate);

		//send avatar file to server
		//user can dont set avatar
		if(avatar) {
			await accountAPI.sendAvatar(avatar, uid);
		}

		//get avatar url 
		const avatarUrl = avatar ? await accountAPI.getAvatarUrl(uid) : null;

		//set new account data
		if(schoolData  ) {
			accountData = {
				...restData,
				school: schoolData, 
				birthDate: formattedBirthDate,
				avatarUrl: avatarUrl, uid: uid,
				rating: 'Ніхто',
				liked: [],
				correctAnswersCount: 0,
				email: loginData.email,
			}; 
		}

		//server send account data
		await accountAPI.setMyAccountData(accountData, uid);

		if(loginData) {
			//set data to state
			dispatch(setMyAccountData(loginData));
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

export const updateMyAccountData = (data: UpdatedAccountDataType) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const uid = getState().account.myLoginData?.uid;
	const currData = getState().account.myAccountData;
	const { aboutMe, avatar, class: classNum, schoolInfo } = data;
	console.log('data', data);

	if(uid) {
		//if user didn't change avatar, without getting it we setting it to null
		let avatarUrl: string | null = getState().account.myAccountData?.avatarUrl || null; 
		if(avatar) {
			avatarUrl = await accountAPI.sendAvatar(avatar, uid);
			if(avatarUrl === undefined) avatarUrl = null;
		}

		//get large data about school
		const schoolData = await schoolsAPI.getSchoolInfo(schoolInfo.id);


		const finalData: FinalUpdatedAccountDataType = {
			class: classNum,
			school: schoolData,
			avatarUrl,
			aboutMe
		}
		await accountAPI.updateMyAccountData(finalData, uid);
		
		if(currData) {
			dispatch(myAccountDataReceived({...currData, ...finalData}));
		} 
	}
}
export const logOut = () => async (dispatch: AppDispatchType) => {
	try {
		await accountAPI.logOut();

		dispatch(loginDataReceived(null));
		dispatch(myAccountDataReceived(null));
		dispatch(authStatusChanged(false));
	} catch(error: any) {
		console.log('error', error.code);
	}
}

export const createAccountByEmail = (email: string, password: string) => async (dispatch: AppDispatchType) => {
	try {
		dispatch(authActionStatusUpdated('register', 'loading'));
		const user = await accountAPI.createAccountByEmail(email, password);	
		dispatch(authActionStatusUpdated('register', 'success'));
		dispatch(authErrorRemoved('register'));

		if(user) {
			console.log('we got user', user);
			dispatch(loginDataReceived(user));
			dispatch(authStatusChanged(true));
		}
	} catch(error: any) {
		console.log('error', error.code);
		dispatch(authErrorReceived('register', error.code));
		dispatch(authActionStatusUpdated('register', 'error'));
	}

}

export const checkEmailForExisting = (email: string) => async (dispatch: AppDispatchType) => {
	console.log('check email for existing', email);
	try {
		dispatch(authActionStatusUpdated('register', 'loading'));
		const isExisting = await accountAPI.checkEmailForExisting(email);

		if(isExisting) {
			dispatch(authErrorReceived('register', 'auth/email-already-exists'));
			dispatch(authActionStatusUpdated('register', 'error'));
		} else {
			dispatch(authActionStatusUpdated('register', 'success'));
		}
	} catch(error: any) {
		dispatch(authErrorReceived('register', error.code));
		dispatch(authActionStatusUpdated('register', 'error'));

		console.log('error', error.code);
	}
} 

export const sendEmailVerificationLink = (email: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const code = getRandomSixDigitCode();

	dispatch(activeRegistrationCodeReceived(code));
	dispatch(authActionStatusUpdated('register', 'loading'));

	try {
		console.log('send email verify link', email);
		await accountAPI.sendEmailVerificationLink(email, code);	
		dispatch(authActionStatusUpdated('register', 'success'));
		dispatch(authErrorRemoved('register'))
	} catch(error: any) {
		dispatch(authErrorReceived('register', error.message));
		dispatch(authActionStatusUpdated('register', 'error'));
	}
}

export const removeAccount = () => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const user = getState().account.myLoginData;

	if(user) {
		await accountAPI.deleteUser(user);
		await accountAPI.deleteUserData(user.uid);
		
		dispatch(loginDataReceived(null));
		dispatch(myAccountDataReceived(null));
	}
}

export const signInByEmail = (email: string, password: string) => async (dispatch: AppDispatchType) => {
	try {
		const user = await accountAPI.signInWithEmail(email, password);
		
		if(user) {
			dispatch(loginDataReceived(user));
			dispatch(authErrorRemoved('signin'));
		}
	} catch(error: any) {
		//catching auth error
		//in api it harder to realize
		console.log('sign in error', error.code);

		dispatch(authErrorReceived('signin', error.code));
	}

	// if(user) {
	// 	console.log('sign in', user);
	// 	dispatch(loginDataReceived);
	// }
}

export const loginWithFacebook = () => async (dispatch: AppDispatchType) => {
	try {
		const user = await accountAPI.loginWithFacebook();

		if(user) {
			dispatch(loginDataReceived(user));
		}
	} catch(error: any) {
		//TODO
		//create new errors state
		dispatch(authErrorReceived('signin', error.code));
	}
}

export const sendPasswordResetEmail = (email: string) => async (dispatch: AppDispatchType) => {
	try {
		dispatch(authActionStatusUpdated('reset_password', 'loading'));
		await accountAPI.sendPasswordResetEmail(email);
		dispatch(authActionStatusUpdated('reset_password', 'success'));
	} catch(error: any) {
		dispatch(authErrorReceived('reset_password', error.code));
		dispatch(authActionStatusUpdated('reset_password', 'error'))
	}
}



export const sendMyCurrentAvatar = (file: File | Blob | undefined, uid: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	console.log('send avatar file', file);
	if(file) {
		console.log('send avatar(redux)')
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


export const setUserQuestions = (uid: string) => async (dispatch: AppDispatchType) => {
	const questions = await streamAPI.getUserQuestions(uid);

	dispatch(currUserQuestionsReceived(questions));
}

export default accountReducer;