import { RootStateType } from './../store';
import { createReducer, createAction } from '@reduxjs/toolkit';
import { streamAPI } from '../../api/streamApi';
import { CommentType, PostDataType, QuestionCategoriesType } from '../../utils/types';
import { AppDispatchType } from '../store';

//=================ACTIONS========================
export const newPostsReceived = createAction<PostDataType[]>('stream/NEW_POSTS_RECEIVED');
export const nextPostsReceived = createAction<PostDataType[]>('stream/NEXT_POSTS_RECEIVED');
export const newPostReceived = createAction<PostDataType>('stream/NEW_POST_RECEIVED');
export const openPostDataReceived = createAction<PostDataType>('stream/OPEN_POST_DATA_RECEIVED');
export const newPostLiked = createAction<string>('stream/NEW_POST_LIKED');
export const postUnliked = createAction<string>('stream/POST_UNLIKED');
export const searchShowingStatusChanged = createAction<boolean>('stream/SEARCH_SHOWING_STATUS_CHANGED');
export const currPostAnswersReceived = createAction<CommentType[] | null>('stream/CURR_POST_ANSWERS_RECEIVED');
export const newCurrPostAnswerReceived = createAction<CommentType>('stream/NEW_CURR_POSST_ANSWER_RECEIVED');
export const answerMarkedAsCorrect = createAction<string>('stream_ANSWER_MARKED_AS_CORRECT')
export const searchedPostsReceived = createAction<null | PostDataType[]>('stream/SEARCHED_POSTS_RECEIVED');
export const currStreamScrollValueChanged = createAction<number>('stream/CURR_STREAM_SCROLL_VALUE_CHANGED');
export const questionMarkedAsClosed = createAction<string>('stream/QUESTION_MARKED_AS_CLOSED');
export const postAddingStatusChanged = createAction<PostAddingStatusType>('stream/POST_ADDING_STATUS_CHANGED');
export const answerAddingStatusChanged = createAction<PostAddingStatusType>('stream/ANSWER_ADDING_STATUS_CHANGED');
export const postChanged = createAction<PostDataType>('stream/POST_CHANGED');  
export const postRemoved = createAction<string>('stream/POST_REMOVED');

export const newAnswerAdded = createAction('stream/NEW_ANSWER_ADDED', (questionId: string, data: CommentType) => ({
	payload: {
		questionId,
		data,
	}
}))
export const answerDeleted = createAction('stream/ANSWER_DELETED', (qId: string, aId: string) => ({
	payload: {
		qId,
		aId,
	}
}));

export type PostAddingStatusType = 'loading' | 'success' | 'error' | null;

type StateType = {
	posts: PostDataType[] | null,
	categories: QuestionCategoriesType,
	openPostData: PostDataType | null,
	isSearchShowing: boolean,
	currPostAnswers: null | CommentType[],
	searchedPosts: null | PostDataType[],
	currStreamScrollValue: number,
	postAddingStatus: PostAddingStatusType,
	answerAddingStatus: PostAddingStatusType,
};
const inititalState: StateType = {
	posts: null,
	categories: [
		'Математика',
		'Історія',
		'Хімія',
		'Фізика',
		'Географія',
		'Біологія',
		'Інформатика',
		'Українська мова/література',
		'Англійська мова',
		'Німецька мова',
		'Французька мова',
		'Зарубіжна література',
		'Інше',
	],
	openPostData: null,
	isSearchShowing: false,
	currPostAnswers: null,
	searchedPosts: null,
	currStreamScrollValue: 0,
	postAddingStatus: null,
	answerAddingStatus: null,
};

export const streamReducer = createReducer(inititalState, (builder) => {
	builder 
		.addCase(nextPostsReceived, (state, action) => {
			state.posts =  action.payload;  
		})
		.addCase(newPostReceived, (state, action) => {
			state.posts?.unshift(action.payload);
		})
		.addCase(openPostDataReceived, (state, action) => {
			state.openPostData = action.payload;
		})
		.addCase(newPostLiked, (state, action) => {
			const [likedPost] = state.posts?.filter((post) => post.id === action.payload) || [null];

			if(likedPost) {
				likedPost.stars = likedPost.stars + 1;
			}
			if(state.openPostData) {
				state.openPostData.stars++;
			}
		})
		.addCase(postUnliked, (state, action) => {
			const [likedPost] = state.posts?.filter((post) => post.id === action.payload) || [];

			if(likedPost) {
				likedPost.stars--;
			}
			if(state.openPostData) {
				state.openPostData.stars--
			}
		})
		.addCase(newAnswerAdded, (state, action) => {
			//increase comments count
			const [answeredPost] = state.posts?.filter(data => data.id === action.payload.questionId) || [];
			if(answeredPost) {
				answeredPost.commentsCount++;
			}

			if(state.openPostData) {
				state.openPostData.commentsCount++;
			}

			//add answer to state
			if(state.currPostAnswers) {
				state.currPostAnswers.unshift(action.payload.data);
			}
		})
		.addCase(answerDeleted, (state, action) => {
			//downcreace comments count
			const [answeredPost] = state.posts?.filter(data => data.id === action.payload.qId) || [];
			if(answeredPost) {
				answeredPost.commentsCount--;
			}

			if(state.openPostData) {
				state.openPostData.commentsCount--;
			}

			//remove answer from state
			if(state.currPostAnswers) {
				state.currPostAnswers = state.currPostAnswers.filter(data => data.id !== action.payload.aId);
			}
		})
		.addCase(newPostsReceived, (state, action) => {
			state.posts = action.payload;
		})
		.addCase(searchShowingStatusChanged, (state, action) => {
			state.isSearchShowing = action.payload;
		})
		.addCase(currPostAnswersReceived, (state, action) => {
			state.currPostAnswers = action.payload;
		})
		.addCase(newCurrPostAnswerReceived, (state, action) => {
			state.currPostAnswers?.unshift(action.payload);
		})
		.addCase(answerMarkedAsCorrect, (state, action) => {

			if(state.currPostAnswers) {
				const [markedAnswer] = state.currPostAnswers.filter(data => data.id === action.payload);
				if(markedAnswer) markedAnswer.isCorrect = true;
			}
		})
		.addCase(searchedPostsReceived, (state, action) => {
			state.searchedPosts = action.payload;
		})
		.addCase(currStreamScrollValueChanged, (state, action) => {
			state.currStreamScrollValue = action.payload;
		})
		.addCase(questionMarkedAsClosed, (state, action) => {
			if(state.posts) {
				const [markedPost] =	state.posts.filter(data => data.id === action.payload);
				markedPost.isClosed = true;
			}

			if(state.openPostData) {
				state.openPostData.isClosed = true;
			}
		})
		.addCase(postAddingStatusChanged, (state, action) => {
			state.postAddingStatus = action.payload;
		})
		.addCase(answerAddingStatusChanged, (state, action) => {
			state.answerAddingStatus = action.payload;
		})
		.addCase(postChanged, (state, action) => {
			if(state.posts) {
				const changedPost = state.posts.filter(data => data.id === action.payload.id);
				console.log('changed post', changedPost);
				if(changedPost) changedPost[0] = action.payload;
			}
		})
		.addCase(postRemoved, (state, action) => {
			if(state.posts) {
				state.posts = state.posts.filter(data => data.id !== action.payload);
			}
		})
		.addDefaultCase(() => {})
});


//==========================THUNKS========================
export const getNextPosts = (pageNum: number) => async (dispatch: AppDispatchType ) => {
	const nextPosts = await streamAPI.getPosts(pageNum);
	dispatch(nextPostsReceived(nextPosts));	
}


export const sendNewPost = (data: PostDataType) => async (dispatch: AppDispatchType) => {
	dispatch(postAddingStatusChanged('loading'));
	await streamAPI.addNewPost(data);
	dispatch(postAddingStatusChanged('success'));

	setTimeout(() => {
		dispatch(postAddingStatusChanged(null));
	}, 1000);

	//subscribe on post changes
	const postSubscriber = (data: PostDataType) => {
		console.log('subscriber', data);
		dispatch(postChanged(data));
	}

	streamAPI.subscribeOnChanges(data.id, postSubscriber);
}

export const deleteQuestion = (qId: string) => async (dispatch: AppDispatchType) => {
	await streamAPI.deleteQuestion(qId);
	dispatch(postRemoved(qId));
}

export const addStarToQuestion = (id: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	dispatch(newPostLiked(id));
	await streamAPI.addStarToQuestion(id);
} 


export const removeStarFromQuestion = (id: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	dispatch(postUnliked(id));
	await streamAPI.removeStarFromQuestion(id);
} 

export const addNewAnswer = (questionId: string, data: CommentType) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	dispatch(answerAddingStatusChanged('loading'));
	await streamAPI.addNewAnswer(questionId, data);
	dispatch(newAnswerAdded(questionId, data));
	dispatch(answerAddingStatusChanged('success'));

	//hide block with success text
	setTimeout(() => {
		dispatch(answerAddingStatusChanged(null));
	}, 1000)
} 

export const deleteAnswer = (qId: string, aId: string) => async (dispatch: AppDispatchType) => {
	await streamAPI.deleteAnswer(qId, aId);
	dispatch(answerDeleted(qId, aId));
}

export const getOpenPostData = (postId: string) => async(dispatch: AppDispatchType) => {
	const postData = await streamAPI.getPostById(postId);

	dispatch(openPostDataReceived(postData));
}

export const getPostsByQuery = (query: string, category: QuestionCategoriesType) => async (dispatch: AppDispatchType) => {
	const posts = await streamAPI.getPostsByQuery(query, category);

	dispatch(searchedPostsReceived(posts));
}

export const addCorrentAnswerMark = (qId: string, aId: string) => (dispatch: AppDispatchType) => {
	dispatch(answerMarkedAsCorrect(aId));
	streamAPI.addCorrentAnswerMark(qId, aId);
}

export const getPostAnswers = (postId: string) => async (dispatch: AppDispatchType) => {
	const answers = await streamAPI.getPostAnswers(postId);

	dispatch(currPostAnswersReceived(answers));
}

export const addClosedQuestionMark = (qId: string) => async (dispatch: AppDispatchType) => {
	dispatch(questionMarkedAsClosed(qId));

	await streamAPI.markQuestionAsClosed(qId);
}
