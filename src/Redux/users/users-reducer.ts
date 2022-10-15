import { ThunkAction } from 'redux-thunk';
import { AccountDataType, ReceivedAccountDataType } from './../../utils/types/index';
import { createReducer, createAction, AnyAction } from '@reduxjs/toolkit';
import { AppDispatchType } from '../store';
import { usersAPI } from '../../api/usersApi';
import { currUserAccountReceived } from '../account/account-reducer';



//=================ACTIONS==================
export const usersReceived = createAction<ReceivedAccountDataType[]>('users/USERS_RECEIVED');


//====================REDUCER=================
type UsersStateType = {
	usersData: ReceivedAccountDataType[] | null,
}

const initialState: UsersStateType = {
	usersData: null,
}

type _ThunkType = ThunkAction<void, UsersStateType, unknown, AnyAction>;

export const usersReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(usersReceived, (state, action) => {
			state.usersData = action.payload;
		});
});

//=====================THUNKS=================


//========================THUNKS============================
export const setUsers = () => async (dispatch: AppDispatchType) => {
	const data = await usersAPI.getUsers();
	dispatch(usersReceived(data));
}