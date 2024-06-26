import { streamReducer } from './stream/stream-reducer';
import thunk from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chat/reducer';
import accountReducer from './account/account-reducer';
import { usersReducer } from './users/users-reducer';
import { useDispatch } from 'react-redux';
import { appReducer } from './app/appReducer';
import { schoolReducer } from './mySchool/school-reducer';

export const store = configureStore({ 
	reducer: {
		app: appReducer,
		messages: chatReducer,
		account: accountReducer,
		users: usersReducer,
		mySchool: schoolReducer,
		stream: streamReducer,
	} ,
	devTools: process.env.NODE_ENV !== 'production',
	middleware: (getDefaultMiddleware) => 
		getDefaultMiddleware({
			serializableCheck: false,
		}).concat(thunk)
});

export type RootStateType = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatchType = typeof store.dispatch;

export const useAppDispatch: () => AppDispatchType = useDispatch // Export a hook that can be reused to resolve types