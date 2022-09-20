import { AppDispatchType, RootStateType } from './../store';
import { ThunkAction } from 'redux-thunk';
import { AppDispatch } from './../../../../samurai-way/src/Redux/redux-store';
import { AccountDataType } from './../../utils/types/index';
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
export const accountDataReceived = createAction<AccountDataType>('account/SET_MY_ACCOUNT_DATA');
export const loginDataReceived = createAction<User>('account/LOGIN_DATA_RECEIVED');
export const currUserAccountReceiver = createAction<AccountDataType>('account/CURR_USER_ACCOUNT_RECEIVED');

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
		.addCase(currUserAccountReceiver, (state, action) => {
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

export const getMyAccount = () => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	if(getState() && getState()?.account.myLoginData?.uid) {
		const data: AccountDataType | undefined = await usersAPI.getUserById(getState().account.myLoginData?.uid as string);
		if(data) {
			dispatch(accountDataReceived(data));
		}
	} else {
		console.error('no login data');
	}
}

export default accountReducer;