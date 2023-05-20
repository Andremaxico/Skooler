import { MessageDataType, MessagesDataType, ReceivedAccountDataType, UsersWhoReadMessageType, ChatDataType } from './../../utils/types/index';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createReducer, createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatchType, RootStateType } from '../store';
import chatAPI, { FetchingSubscriberType } from '../../api/chatApi';
import { usersAPI } from '../../api/usersApi';

export type ChatStateType = {
	messagesData: Array<MessageDataType> | null,
	isFetching: boolean,
	currMessageWhoReadList: null | ReceivedAccountDataType[],
	chatsData: ChatDataType[] | null,
	contactData: ReceivedAccountDataType | null,
}


//=========ACTIONS=========
export const messagesReceived = createAction<MessagesDataType | null>('chat/SET_MESSAGES');
export const fetchingStatusChanged = createAction<boolean>('chat/SET_IS_FETCHING');
export const currMessageWhoReadListReceived = createAction<ReceivedAccountDataType[]>('chat/WHO_READ_LIST_RECEIVE');
export const newMessageReceived = createAction<MessageDataType>('chat/NEW_MESSAGE_RECEIVED');
export const chatsDataReceived = createAction<ChatDataType[] | null>('chat/CHATS_DATA_RECEIVED');
export const contactDataReceived = createAction<ReceivedAccountDataType | null>('chat/CONTACT_DATA_RECEIVED');

//===========================REDUCER========================
const initialState: ChatStateType = {
	messagesData: [],
	isFetching: false,
	currMessageWhoReadList: null,
	chatsData: [],
	contactData: null,
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
		.addCase(chatsDataReceived, (state, action) => {
			state.chatsData = action.payload;
		})
		.addCase(contactDataReceived, (state, action) => {
			state.contactData = action.payload;
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

export const startMessaging = (uid2: string) => (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const subscriber = (data: MessagesDataType) => {
		//null = 'no messages', if no messages we set this to null for shoing an component with 'no messages     '
		dispatch(messagesReceived(data.length == 0 ? null : data));
		console.log('new messages received, reducer subscriber');
	}
	const uid1 = getState().account.myAccountData?.uid || '';

	chatAPI.subscribe(subscriber, uid1, uid2);
	chatAPI.fetchingSubscribe(fetchingSubscriberCreator(dispatch));
}

export const stopMessaging = () => (dispatch: AppDispatchType) => {
	dispatch(messagesReceived(null));
	chatAPI.unsubscribe();
}


//messages interaction
export const sendMessage = (data: MessageDataType, uid1: string, uid2: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	console.log('send message');
	const myUid = getState().account.myAccountData?.uid;
	if(myUid === uid1) dispatch(newMessageReceived(data));
	await chatAPI.sendMessage({...data, sent: true}, uid1, uid2);
}

export const markMessageAsRead = (messageId: string, uid: string, uid2: string) => async (dispatch: AppDispatchType) => {
	await chatAPI.readMessage(messageId, uid, uid2);
}

export const editMessage = (messageId: string, newText: string) => async (dispatch: AppDispatchType) => {
	console.log('edit message', messageId, newText);
	await chatAPI.updateMessage(messageId, newText);
} 

export const deleteMessage = (messageId: string) => async (dispatch: AppDispatchType) => {
	await chatAPI.deleteMessage(messageId);
}

export const subscribeOnChats = () => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const uid = getState().account.myAccountData?.uid;

	const chatsSubscriber = (data: ChatDataType[]) => {
		dispatch(chatsDataReceived(data));
	}

	if(uid) {
		chatAPI.subscribeOnChats(uid, chatsSubscriber);
	}
}
export const getChatsData = () => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const uid = getState().account.myAccountData?.uid;

	if(uid) {
		const data = await chatAPI.getChatsData(uid);
		console.log('data', data);
		dispatch(chatsDataReceived(data));
	}
}

export const setChatInfo = (data: ChatDataType, uid1: string, uid2: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const uid = getState().account.myAccountData?.uid;
	if(uid) {
		chatAPI.setChatInfo(data, uid1, uid2);
	}
}

export const setContactData = (uid: string) => async (dispatch: AppDispatchType) => {
	const data = await usersAPI.getUserById(uid);
	if(data) {
		dispatch(contactDataReceived(data));
	}
}

export const updateChatInfo = (data: ChatDataType, uid1: string, uid2: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const uid = getState().account.myAccountData?.uid;
	if(uid) {
		chatAPI.updateChatInfo(data, uid1, uid2);
	}
}
 
export default chatReducer;