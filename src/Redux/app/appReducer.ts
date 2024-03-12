import { createReducer, createAction } from '@reduxjs/toolkit';
import { UserActionType } from '../../utils/types';

//=================ACTIONS=====================
export const networkErrorStatusChanged = createAction<string | null>('app/NETWORK_ERROR_CHANGED');
export const isLoadingStatusChanged = createAction<boolean>('app/LOADING_STATUS_CHANGED');
export const footerHeightReceived = createAction<number>('app/FOOTER_HEIGHT_RECEIVED');
export const headerHeightReceived = createAction<number>('app/HEADER_HEIGHT_RECEIVED');
export const prevPageChanged = createAction<string>('app/PREV_PAGE_CHANGED');
export const returnBtnShowStatusChanged = createAction<boolean>('app/RETURN_BTN_SHOW_STATUS_CHANGED');
export const userActionStatusChanged = createAction<UserActionType | null>('app/USER_ACTION_STATUS_CHANGED');
export const globalErrorStateChanged = createAction<boolean>('app/GLOBAL_ERROR_STATE_CHANGED');

//==================	REDUCER===================
type AppStateType = {
	networkError: string | null,
	isLoading: boolean,
	footerHeight: number | null,
	headerHeight: number | null,
	prevPage: string | null,
	isReturnBtnShow: boolean, 
	userAction: UserActionType | null,
	globalError: boolean,
};

const initialState: AppStateType = {
	networkError: null,
	isLoading: false,
	footerHeight: null,
	headerHeight: null,
	prevPage: null,
	isReturnBtnShow: false,
	userAction: null,
	globalError: false,
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
		.addCase(prevPageChanged, (state, action) => {
			state.prevPage = action.payload;
		})
		.addCase(returnBtnShowStatusChanged, (state, action) => {
			state.isReturnBtnShow = action.payload;
		})
		.addCase(userActionStatusChanged, (state, action) => {
			state.userAction = action.payload;
		})
		.addCase(globalErrorStateChanged, (state, action) => {
			state.globalError = action.payload;
		})
		.addDefaultCase((state, action) => {})
});