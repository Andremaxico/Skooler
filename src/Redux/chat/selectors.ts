import { RootStateType } from './../store';

export const selectMessages = (state: RootStateType) => {
	return state.messages.messagesData;
}