import { ThunkAction } from 'redux-thunk';
import { AccountDataType, ReceivedAccountDataType } from './../../utils/types/index';
import { createReducer, createAction, AnyAction } from '@reduxjs/toolkit';
import { AppDispatchType } from '../store';
import { usersAPI } from '../../api/usersApi';
import { currUserAccountReceived } from '../account/account-reducer';
import { globalErrorStateChanged } from '../app/appReducer';



//=================ACTIONS==================
export const usersReceived = createAction<ReceivedAccountDataType[] | null>('users/USERS_RECEIVED');
export const usersFound = createAction<ReceivedAccountDataType[] | null>('users/USERS_FOUND');

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


//we cant set try/catch for whole reducer, because disable to export 
//========================THUNKS============================
export const setUsers = () => async (dispatch: AppDispatchType) => {
	try {
		const data = await usersAPI.getUsers();
		dispatch(usersReceived(data));
	} catch(e) {
		dispatch(globalErrorStateChanged(true));
	}
}

export const searchUsersByFullname = (fullName: string) => async (dispatch: AppDispatchType) => {
	try {
		const users = await usersAPI.getUsersByQuery(fullName);
		if(users) {
			dispatch(usersFound(users));
		}
	} catch(e) {
		dispatch(globalErrorStateChanged(true));
	}
}