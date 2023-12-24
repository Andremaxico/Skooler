import { ThunkAction } from 'redux-thunk';
import { AccountDataType, ReceivedAccountDataType } from './../../utils/types/index';
import { createReducer, createAction, AnyAction } from '@reduxjs/toolkit';
import { AppDispatchType } from '../store';
import { usersAPI } from '../../api/usersApi';
import { currUserAccountReceived } from '../account/account-reducer';



//=================ACTIONS==================
export const usersReceived = createAction<ReceivedAccountDataType[]>('users/USERS_RECEIVED');
export const usersFound = createAction<ReceivedAccountDataType[]>('users/USERS_FOUND');

//====================REDUCER=================
type UsersStateType = {
	usersData: ReceivedAccountDataType[] | null,
	foundUsers: ReceivedAccountDataType[] | null,
}

const initialState: UsersStateType = {
	usersData: null,
	foundUsers: null,
}

type _ThunkType = ThunkAction<void, UsersStateType, unknown, AnyAction>;

export const usersReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(usersReceived, (state, action) => {
			state.usersData = action.payload;
		})
		.addCase(usersFound, (state, action) => {
			state.foundUsers = action.payload
		})
		
});

//=====================THUNKS=================


//========================THUNKS============================
export const setUsers = () => async (dispatch: AppDispatchType) => {
	const data = await usersAPI.getUsers();
	dispatch(usersReceived(data));
}

export const searchUsersByFullname = (fullName: string) => async (dispatch: AppDispatchType) => {
	const users = await usersAPI.getUsersByQuery(fullName);


}