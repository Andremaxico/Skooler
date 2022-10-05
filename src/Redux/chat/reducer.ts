import { MessageDataType, MessagesDataType } from './../../utils/types/index';
import { Item } from "firebase/analytics";
import type { PayloadAction } from '@reduxjs/toolkit';
import { createReducer, createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatchType } from '../store';
import chatAPI, { FetchingSubscriberType } from '../../api/chatApi';

export type ChatStateType = {
	messagesData: Array<MessageDataType> | null,
	isFetching: boolean,
}


//=========ACTIONS=========
export const messagesReceived = createAction<MessagesDataType>('chat/SET_MESSAGES');

export const fetchingStatusChanged = createAction<boolean>('chat/SET_IS_FETCHING');

//===========================REDUCER========================
const initialState: ChatStateType = {
	messagesData: null,
	isFetching: false,
}

const chatReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(messagesReceived, (state, action) => {
			state.messagesData = action.payload;
		})
		.addCase(fetchingStatusChanged, (sttae, action) => {
			sttae.isFetching = action.payload;
		})
		.addDefaultCase((state, action) => {});
});

//==========================THUNKS====================

const fetchingSubscriberCreator = (dispatch: AppDispatchType): FetchingSubscriberType => (value: boolean) => {
	dispatch(fetchingStatusChanged(value));
} 

export const startMessaging = () => (dispatch: AppDispatchType) => {
	chatAPI.subscribe((data: MessagesDataType) => {
		dispatch(messagesReceived(data));
	});
	chatAPI.fetchingSubscribe(fetchingSubscriberCreator(dispatch));
}

export const stopMessaging = () => {
	chatAPI.unsubscribe();
}

export const sendMessage = (data: MessageDataType) => {
	console.log('send message');
	chatAPI.sendMessage(data);
}

export const markMessageAsRead = (messageId: string, uid: string) => async (dispatch: AppDispatchType) => {
	await chatAPI.readMessage(messageId, uid);
}

export const deleteMessage = (messageId: string) => async (dispatch: AppDispatchType) => {
	await chatAPI.deleteMessage(messageId);
}

export default chatReducer;