import { GENERAL_CHAT_ID } from '../../utils/constants';
import { RootStateType } from './../store';

export const selectMessages = (state: RootStateType) => {
	return state.messages.messagesData;
}

export const selectIsMessagesFetching = (state: RootStateType) => {
	return state.messages.isFetching;
}

export const selectCurrMessageWhoReadList = (state: RootStateType) => {
	return state.messages.currMessageWhoReadList;
}

export const selectChatsData = (state: RootStateType) => {
	return state.messages.chatsData;
}

export const selectContactData = (state: RootStateType) => {
	return state.messages.contactData;
}

export const selectCurrChatData = (state: RootStateType) => {
	return state.messages.currChatData;
}

export const selectGeneralChatData = (state: RootStateType) => {
	return state.messages.generalChatData;
}