import { ThunkAction } from 'redux-thunk';
import { AppDispatch } from './../../../../samurai-way/src/Redux/redux-store';
import { AccountDataType } from './../../utils/types/index';
import { createReducer, createAction, AnyAction } from '@reduxjs/toolkit';
import { schoolsAPI } from '../../api/schoolsApi';
import { usersAPI } from '../../api/usersApi';

export type AccountStateType = {
	myAccountData: AccountDataType | null,
}
type _ThunkType = ThunkAction<void, AccountStateType, unknown, AnyAction>;


//=========ACTIONS=========
export const accountDataGetted = createAction('account/SET_MY_ACCOUNT_DATA');


const initialState: AccountStateType = {
	myAccountData: null,
}


const accountReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(accountDataGetted, (state, action) => {
			state.myAccountData = null;
		})
		.addDefaultCase((state, action) => {});
});

export const searchSchool = async (value: string) => {
	const data = await schoolsAPI.getSchoolsByName(value);
	return data;
}

//========================THUNKS============================
export const setUsersData = (): _ThunkType => async (dispatch: AppDispatch) => {
	const data = await usersAPI.getUsers();
	console.log('users data', data);
}

export const sendUserData = (userData: AccountDataType) => async (dispatch: AppDispatch) => {
	const res = await usersAPI.addUser(userData);
}

export default accountReducer;