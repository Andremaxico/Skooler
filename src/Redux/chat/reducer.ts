import { MessageDataType, MessagesDataType, ReceivedAccountDataType, UsersWhoReadMessageType, ChatDataType } from './../../utils/types/index';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createReducer, createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatchType, RootStateType } from '../store';
import chatAPI, { FetchingSubscriberType } from '../../api/chatApi';
import { usersAPI } from '../../api/usersApi';
import { globalErrorStateChanged } from '../app/appReducer';
import { GENERAL_CHAT_ID } from '../../utils/constants';

export type ChatStateType = {
	messagesData: Array<MessageDataType> | null,
	isFetching: boolean,
	currMessageWhoReadList: null | ReceivedAccountDataType[],
	chatsData: ChatDataType[] | null,
	contactData: ReceivedAccountDataType | null,
	currChatData: ChatDataType | null,
	generalChatData: ChatDataType | null,
	errorsWithSendingMessages: string[], //ids of messages
}


//=========ACTIONS=========
export const messagesReceived = createAction<MessagesDataType | null>('chat/SET_MESSAGES');
export const fetchingStatusChanged = createAction<boolean>('chat/SET_IS_FETCHING');
export const currMessageWhoReadListReceived = createAction<ReceivedAccountDataType[]>('chat/WHO_READ_LIST_RECEIVE');
export const newMessageReceived = createAction<MessageDataType>('chat/NEW_MESSAGE_RECEIVED');
export const chatsDataReceived = createAction<ChatDataType[] | null>('chat/CHATS_DATA_RECEIVED');
export const contactDataReceived = createAction<ReceivedAccountDataType | null>('chat/CONTACT_DATA_RECEIVED');
export const currChatDataReceived = createAction<ChatDataType | null>('chat/CURR_CHAT_DATA_RECEIVED');
export const generalChatDataReceived = createAction<ChatDataType | null>('chat/GENERAL_CHAT_DATA_RRECEIVED');
export const errorWithSendingMessageAppeared = createAction<string>('chat/ERROR_WITH_SENDING_MESSAGE_APPEARED');
export const errorWithSendingMessagesDisappeared = createAction<string>('chat/ERROR_WITH_SENDING_MESSAGE_DISAPPEARED');

//===========================REDUCER========================
const initialState: ChatStateType = {
	messagesData: [],
	isFetching: false,
	currMessageWhoReadList: null,
	chatsData: [],
	contactData: null,
	currChatData: null,
	generalChatData: null,
	errorsWithSendingMessages: [],
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
		.addCase(currChatDataReceived, (state, action) => {
			state.currChatData = action.payload;
		})
		.addCase(generalChatDataReceived, (state, action) => {
			state.generalChatData = action.payload;
		})
		.addCase(errorWithSendingMessageAppeared, (state, action) => {
			state.errorsWithSendingMessages.push(action.payload);
		})
		.addCase(errorWithSendingMessagesDisappeared, (state, action) => {
			state.errorsWithSendingMessages = state.errorsWithSendingMessages.filter(id => id !== action.payload);
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

export const startMessaging = (contactUid: string) => (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const subscriber = (data: MessagesDataType) => {
		//null = 'no messages', if no messages we set this to null for shoing an component with 'no messages     '
		dispatch(messagesReceived(data.length == 0 ? null : data));
		console.log('new messages received, reducer subscriber');
	}
	const uid1 = getState().account.myAccountData?.uid || getState().account.myLoginData?.uid;

	if(uid1) {
		chatAPI.subscribe(subscriber, uid1, contactUid);
		chatAPI.fetchingSubscribe(fetchingSubscriberCreator(dispatch));
	}
}

export const stopMessaging = () => (dispatch: AppDispatchType) => {
	try {
		dispatch(messagesReceived(null));
		chatAPI.unsubscribe();
	} catch(e) {
		dispatch(globalErrorStateChanged(true));
	}
}

export const subscribeOnChat = (uid1: string, contactUid: string) => async (dispatch: AppDispatchType) => {
	const subscriber = (data: ChatDataType) => {
		dispatch(currChatDataReceived(data));
	}

	chatAPI.subscribeOnChatInfo(uid1, contactUid, subscriber);
}

export const unsubscribeFromChat = () => async (dispatch: AppDispatchType) => {
	dispatch(currChatDataReceived(null));
	chatAPI.unsubscribeFromChatInfo();
}


//messages interaction
export const sendMessage = (data: MessageDataType, uid1: string, contactUid: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const myUid = getState().account.myAccountData?.uid;
	if(myUid === uid1) dispatch(newMessageReceived(data));
	try {
		await chatAPI.sendMessage({...data, sent: true}, uid1, contactUid);
		await chatAPI.sendMessage({...data, sent: true}, contactUid, uid1);
		dispatch(errorWithSendingMessagesDisappeared(data.id));
	} catch(e) {
		dispatch(errorWithSendingMessageAppeared(data.id));
	}
}

export const markMessageAsRead = (messageId: string, uid1: string, contactUid: string) => async (dispatch: AppDispatchType) => {
	try {
		await chatAPI.readMessage(messageId, uid1, contactUid);
		await chatAPI.decreaceUnreadCount(uid1, contactUid);

		await chatAPI.readMessage(messageId, contactUid, uid1);
		await chatAPI.decreaceUnreadCount(contactUid, uid1);
	} catch(e) {
		dispatch(globalErrorStateChanged(true));
	}
}

export const editMessage = (messageId: string, newText: string, uid1: string, contactUid: string) => async (dispatch: AppDispatchType) => {
	console.log('edit message', messageId, newText);
	try {
		await chatAPI.updateMessage(messageId, newText, uid1, contactUid);
		await chatAPI.updateMessage(messageId, newText, contactUid, uid1);
	} catch(e) {
		dispatch(globalErrorStateChanged(true));
	}
} 

export const deleteMessage = (uid: string, contactId: string, messageId: string) => async (dispatch: AppDispatchType) => {
	try {
		await chatAPI.deleteMessage(uid, contactId, messageId);
		await chatAPI.deleteMessage(contactId, uid, messageId);
	} catch(e) {
		dispatch(globalErrorStateChanged(true));
	}
}

export const subscribeOnChats = () => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const uid = getState().account.myAccountData?.uid;

	try {
		const chatsSubscriber = (data: ChatDataType[]) => {
			dispatch(chatsDataReceived(data));
		}
		const generalChatSubscriber = (data: ChatDataType) => {
			dispatch(generalChatDataReceived(data));
		}

		if(uid) {  
			chatAPI.subscribeOnChats(uid, chatsSubscriber, generalChatSubscriber);
		}
	} catch(e) {
		console.log(e);
		dispatch(globalErrorStateChanged(true));
	}
}

export const unsubscribeFromChats = () => async (dispatch: AppDispatchType) => {
	try {
		unsubscribeFromChats();
		dispatch(chatsDataReceived(null));
	} catch(e) {
		dispatch(globalErrorStateChanged(true));
	}

}

export const subscribeOnGeneralChat = () => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	try {
		const messagesSubscriber = (data: MessagesDataType) => {
			console.log('messages data', data);
			dispatch(messagesReceived(data));
		}

		await chatAPI.subscribeOnGeneralChatMessages(messagesSubscriber);

		console.log('subscribe on general chat');
	} catch(e) {
		console.log('error', e);
		dispatch(globalErrorStateChanged(true));
	}
}

export const getChatsData = () => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const uid = getState().account.myAccountData?.uid;

	if(uid) {
		try {
			const data = await chatAPI.getChatsData(uid);
			console.log('data', data);
			dispatch(chatsDataReceived(data));
		} catch(e) {
			dispatch(globalErrorStateChanged(true));
		}
	}
}

export const setChatInfo = (data: ChatDataType, uid1: string, contactUid: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const uid = getState().account.myAccountData?.uid;
	if(uid) {
		try {
			await chatAPI.setChatInfo(data, uid1, contactUid);
		} catch(e) {
			dispatch(globalErrorStateChanged(true));
		}
	}
}

export const setContactData = (uid: string) => async (dispatch: AppDispatchType) => {
	try {
		const data = await usersAPI.getUserById(uid);
		if(data) {
			console.log('contact data', data);
			dispatch(contactDataReceived(data));
		}
	} catch(e) {
		dispatch(globalErrorStateChanged(true));
	}
}

export const updateChatInfo = (data: ChatDataType, uid1: string, contactUid: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	if(uid1) {
		try {
			console.log('update chat info');
			chatAPI.increaceUnreadCount(uid1, contactUid);
			chatAPI.updateChatInfo(data, uid1, contactUid);
			chatAPI.updateChatInfo(data, contactUid, uid1);
		} catch(e) {
			dispatch(globalErrorStateChanged(true));
		}
	}
}
 
export default chatReducer;