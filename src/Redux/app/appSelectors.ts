import { RootStateType } from "../store";

export const selectNetworkError = (state: RootStateType) => {
	return state.app.networkError;
}

export const selectFooterHeight = (state: RootStateType) => {
	return state.app.footerHeight;
}

export const selectHeaderHeight = (state: RootStateType) => {
	return state.app.headerHeight;
}


export const selectPrevPage = (state: RootStateType) => {
	return state.app.prevPage;
}

export const selectReturnBtnShowStatus = (state: RootStateType) => {
	return state.app.isReturnBtnShow;
}


export const selectUserAction = (state: RootStateType) => {
	return state.app.userAction;
}

export const selectGlobalErrorState = (state: RootStateType) => {
	return state.app.globalError;
}