import thunk from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chat/reducer';
import accountReducer from './account/account-reducer';
import { usersReducer } from './users/users-reducer';
import { useDispatch } from 'react-redux';

export const store = configureStore({ 
	reducer: {
		messages: chatReducer,
		account: accountReducer,
		users: usersReducer,
	} ,
	devTools: process.env.NODE_ENV !== 'production',
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootStateType = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatchType = typeof store.dispatch;

export const useAppDispatch: () => AppDispatchType = useDispatch // Export a hook that can be reused to resolve types