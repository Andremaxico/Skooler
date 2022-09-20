import { authAPI } from './../../api/authApi';
import { AppDispatchType, RootStateType } from './../store';
import { ThunkAction } from 'redux-thunk';
import { AppDispatch } from './../../../../samurai-way/src/Redux/redux-store';
import { AccountDataType, UserType } from './../../utils/types/index';
import { createReducer, createAction, AnyAction } from '@reduxjs/toolkit';
import { schoolsAPI } from '../../api/schoolsApi';
import { usersAPI } from '../../api/usersApi';
import { User } from 'firebase/auth';

export type AccountStateType = {
	myAccountData: AccountDataType | null,
	myLoginData: User | null,
	currUserAccount: AccountDataType | null,
}
type _ThunkType = ThunkAction<void, AccountStateType, unknown, AnyAction>;


//=========ACTIONS=========
export const accountDataReceived = createAction<AccountDataType | null>('account/SET_MY_ACCOUNT_DATA');
export const loginDataReceived = createAction<User | null>('account/LOGIN_DATA_RECEIVED');
export const currUserAccountReceived = createAction<AccountDataType>('account/CURR_USER_ACCOUNT_RECEIVED');

const initialState: AccountStateType = {
	myAccountData: null,
	myLoginData: null,
	currUserAccount: null,
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
		.addDefaultCase((state, action) => {});
});

export const searchSchool = async (value: string) => {
	const data = await schoolsAPI.getSchoolsByName(value);
	return data;
}

export const setMyAccount = (authData: UserType) => async (dispatch: AppDispatchType) => {
	console.log('set my account auth data', authData);
	const data: AccountDataType | undefined = await usersAPI.getUserById(authData.uid as string);
	console.log('set my ccount data', data);
	if(data) {
		dispatch(accountDataReceived(data));
	}
}

export const sendMyAccountData = (data: AccountDataType | null) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const uid = getState().account.myLoginData?.uid;

	if(uid) {
		authAPI.setMyAccountData(data, uid);
	}
}

export default accountReducer;