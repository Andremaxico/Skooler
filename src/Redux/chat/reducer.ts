import { MessageDataType, MessagesDataType, ReceivedAccountDataType, UsersWhoReadMessageType } from './../../utils/types/index';
import { Item } from "firebase/analytics";
import type { PayloadAction } from '@reduxjs/toolkit';
import { createReducer, createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatchType } from '../store';
import chatAPI, { FetchingSubscriberType } from '../../api/chatApi';
import { usersAPI } from '../../api/usersApi';

export type ChatStateType = {
	messagesData: Array<MessageDataType> | null,
	isFetching: boolean,
	currMessageWhoReadList: null | ReceivedAccountDataType[],
}


//=========ACTIONS=========
export const messagesReceived = createAction<MessagesDataType>('chat/SET_MESSAGES');
export const fetchingStatusChanged = createAction<boolean>('chat/SET_IS_FETCHING');
export const currMessageWhoReadListReceived = createAction<ReceivedAccountDataType[]>('chat/WHO_READ_LIST_RECEIVE');
export const newMessageReceived = createAction<MessageDataType>('chat/NEW_MESSAGE_RECEIVED');

//===========================REDUCER========================
const initialState: ChatStateType = {
	messagesData: null,
	isFetching: false,
	currMessageWhoReadList: null,
}

const chatReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(messagesReceived, (state, action) => {
			state.messagesData = action.payload;
		})
		.addCase(fetchingStatusChanged, (state, action) => {
			state.isFetching = action.payload;
		})
		.addCase(currMessageWhoReadListReceived, (state, action) => {
			state.currMessageWhoReadList = action.payload
		})
		.addCase(newMessageReceived, (state, action) => {
			state.messagesData = state.messagesData ? [...state.messagesData, action.payload] : [action.payload];
		})
		.addDefaultCase((state, action) => {});
});

//==========================THUNKS====================

export const setCurrMessageWhoReadList = (uids: UsersWhoReadMessageType) => async (dispatch: AppDispatchType) => {
	const whoReadList: ReceivedAccountDataType[] = [];

	for (let i = 0; i < uids.length; i++) {
		const uid = uids[i];
		if(uid) {
			const userData = await usersAPI.getUserById(uid);
			if(userData) {
				whoReadList.push(userData);	
			}	
		}
	}

	dispatch(currMessageWhoReadListReceived(whoReadList));
}

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


//messages interaction
export const sendMessage = (data: MessageDataType) => async (dispatch: AppDispatchType) => {
	console.log('send message');
	dispatch(newMessageReceived(data));
	await chatAPI.sendMessage({...data, received: true});
}

export const markMessageAsRead = (messageId: string, uid: string) => async (dispatch: AppDispatchType) => {
	await chatAPI.readMessage(messageId, uid);
}

export const editMessage = (messageId: string, newText: string) => async (dispatch: AppDispatchType) => {
	console.log('edit message', messageId, newText);
	await chatAPI.updateMessage(messageId, newText);
} 

export const deleteMessage = (messageId: string) => async (dispatch: AppDispatchType) => {
	await chatAPI.deleteMessage(messageId);
}

export default chatReducer;