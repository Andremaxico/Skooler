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