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


export const selectPrevPages = (state: RootStateType) => {
	return state.app.prevPages;
}

export const selectLastPrevPage = (state: RootStateType) => {
	return state.app.prevPages[state.app.prevPages.length - 1];
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