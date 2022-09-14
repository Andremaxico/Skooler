import { MessageDataType, MessagesDataType } from './../../utils/types/index';
import { Item } from "firebase/analytics";
import type { PayloadAction } from '@reduxjs/toolkit';
import { createReducer, createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatchType } from '../store';
import chatAPI from '../../api/chatApi';

export type ChatStateType = {
	messagesData: Array<MessageDataType> | null,
}


//=========ACTIONS=========
export const messagesReceived = createAction('chat/SET_MESSAGES', (data: Array<MessageDataType> | null) => {
	return {
		payload: {
			messagesData: data,
		}
	}
})

//===========================REDUCER========================
const initialState: ChatStateType = {
	messagesData: null,
}

const chatReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(messagesReceived, (state, action) => {
			state.messagesData = action.payload.messagesData
		})
		.addDefaultCase((state, action) => {});
});

//==========================THUNKS====================

export const startMessaging = () => (dispatch: AppDispatchType) => {
	chatAPI.subscribe((data: MessagesDataType) => {
		dispatch(messagesReceived(data));
	})
}

export const stopMessaging = () => {
	chatAPI.unsubscribe();
}

export const sendMessage = (data: MessageDataType) => {
	console.log('send message');
	chatAPI.sendMessage(data);
}

export default chatReducer;