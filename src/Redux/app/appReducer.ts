import { createReducer, createAction } from '@reduxjs/toolkit';



//=================ACTIONS=====================
export const networkErrorStatusChanged = createAction<string | null>('app/NETWORK_ERROR_CHANGED');
export const isLoadingStatusChanged = createAction<boolean>('app/LOADING_STATUS_CHANGED');

//==================	REDUCER===================
type AppStateType = {
	networkError: string | null,
	isLoading: boolean,
};

const initialState: AppStateType = {
	networkError: null,
	isLoading: false,
};

export const appReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(networkErrorStatusChanged, (state, action) => {
			state.networkError = action.payload
		})
		.addCase(isLoadingStatusChanged, (state, action) => {
			state.isLoading = action.payload
		})
		.addDefaultCase((state, action) => {})
});