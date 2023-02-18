import { RootStateType } from './../store';

export const selectMyAccountData = (state: RootStateType) => {
	return state.account.myAccountData;
}

export const selectCurrUserAccountData = (state: RootStateType) => {
	return state.account.currUserAccount;
}

export const selectMyLoginData = (state: RootStateType) => {
	return state.account.myLoginData;
}

export const selectAccountIsFetching = (state: RootStateType) => {
	return state.account.isFetching;
}

export const selectMyUid = (state: RootStateType) => {
	return state.account.myAccountData?.uid;
}

export const selectCurrAvatarUrl = (state: RootStateType) => {
	return state.account.currMyAvatarUrl;
}

export const selectAuthedStatus = (state: RootStateType) => {
	return state.account.isAuthed;
}