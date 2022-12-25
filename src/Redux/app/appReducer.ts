import { createReducer, createAction } from '@reduxjs/toolkit';



//=================ACTIONS=====================
export const networkErrorStatusChanged = createAction<string | null>('app/NETWORK_ERROR_CHANGED');
export const isLoadingStatusChanged = createAction<boolean>('app/LOADING_STATUS_CHANGED');
export const footerHeightReceived = createAction<number>('app/FOOTER_HEIGHT_RECEIVED');
export const headerHeightReceived = createAction<number>('app/HEADER_HEIGHT_RECEIVED');
//==================	REDUCER===================
type AppStateType = {
	networkError: string | null,
	isLoading: boolean,
	footerHeight: number | null,
	headerHeight: number | null,
};

const initialState: AppStateType = {
	networkError: null,
	isLoading: false,
	footerHeight: null,
	headerHeight: null,
};

export const appReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(networkErrorStatusChanged, (state, action) => {
			state.networkError = action.payload
		})
		.addCase(isLoadingStatusChanged, (state, action) => {
			state.isLoading = action.payload
		})
		.addCase(footerHeightReceived, (state, action) => {
			state.footerHeight = action.payload;
		})
		.addCase(headerHeightReceived, (state, action) => {
			state.headerHeight = action.payload;
		})
		.addDefaultCase((state, action) => {})
});