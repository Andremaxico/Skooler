import { RootStateType } from './../store';
import { createReducer, createAction } from '@reduxjs/toolkit';
import { streamAPI } from '../../api/streamApi';
import { CommentType, PostDataType, QuestionCategoriesType } from '../../utils/types';
import { AppDispatchType } from '../store';
import { userActionStatusChanged } from '../app/appReducer';

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
export const answerMarkedAsCorrect = createAction<string>('stream_ANSWER_MARKED_AS_CORRECT');
export const answerUnMarkedAsCorrect = createAction<string>('stream_ANSWER_UNMARKED_AS_CORRECT')
export const searchedPostsReceived = createAction<null | PostDataType[]>('stream/SEARCHED_POSTS_RECEIVED');
export const currStreamScrollValueChanged = createAction<number>('stream/CURR_STREAM_SCROLL_VALUE_CHANGED');
export const questionMarkedAsClosed = createAction<string>('stream/QUESTION_MARKED_AS_CLOSED');
export const questionUnMarkedAsClosed = createAction<string>('stream/QUESTION_UNMARKED_AS_CLOSED');
export const postRemoved = createAction<string>('stream/POST_REMOVED');
export const questionChanged = createAction<PostDataType>('stream/QUESTION_CHANGED');
export const answerChanged = createAction<CommentType>('stream/ANSWER_CHANGED');
export const lastVisiblePostChanged = createAction<PostDataType>('stream/LATEST_DOC_CHANGED');

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


type StateType = {
	posts: PostDataType[] | null,
	categories: QuestionCategoriesType,
	openPostData: PostDataType | null,
	isSearchShowing: boolean,
	currPostAnswers: null | CommentType[],
	searchedPosts: null | PostDataType[],
	currStreamScrollValue: number, 
	lastVisiblePost: null | PostDataType,
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
	lastVisiblePost: null,
};

export const streamReducer = createReducer(inititalState, (builder) => {
	builder 
		.addCase(nextPostsReceived, (state, action) => {
			if(state.posts === null) {
				state.posts = action.payload;  
			} else {
				state.posts.push(...action.payload);
			}
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
		.addCase(answerUnMarkedAsCorrect, (state, action) => {
			if(state.currPostAnswers) {
				const [markedAnswer] = state.currPostAnswers.filter(data => data.id === action.payload);
				if(markedAnswer) markedAnswer.isCorrect = false;
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
		.addCase(questionUnMarkedAsClosed, (state, action) => {
			if(state.posts) {
				const [markedPost] =	state.posts.filter(data => data.id === action.payload);
				markedPost.isClosed = false;
			}

			if(state.openPostData) {
				state.openPostData.isClosed = false;
			}
		})
		.addCase(postRemoved, (state, action) => {
			if(state.posts) {
				console.log('post removed redux');
				state.posts = state.posts.filter(data => data.id !== action.payload);
			}
		})
		.addCase(questionChanged, (state, action) => {
			const currOpenPostId = state.openPostData?.id;

			if(state.posts) {
				const [changedPost] = state.posts.filter(data => data.id === action.payload.id) || [];

				if(changedPost) {
					changedPost.text = action.payload.text;
				}
			}

			if(currOpenPostId === action.payload.id) {
				state.openPostData = action.payload;
			}
		})
		.addCase(answerChanged, (state, action) => {
			if(state.currPostAnswers) {
				const [changedAnswer] = state.currPostAnswers.filter(data => data.id === action.payload.id);
				if(changedAnswer) {
					changedAnswer.text = action.payload.text;
				}
			}
		})
		.addCase(lastVisiblePostChanged, (state, action) => {
			state.lastVisiblePost = action.payload;
		})
		.addDefaultCase(() => {})
});


//==========================THUNKS========================
export const getNextPosts = () => async (dispatch: AppDispatchType, getState: () => RootStateType ) => {
	const lastVisiblePostId = getState().stream.lastVisiblePost?.id || null;

	console.log(lastVisiblePostId);

	const nextPosts = await streamAPI.getPosts(lastVisiblePostId);

	console.log('nextPosts', nextPosts);

	if(nextPosts) {
		//set last post for triggering loading next posts if we see lastPost 
		const lastPost = nextPosts[nextPosts.length - 1];

		dispatch(lastVisiblePostChanged(lastPost));
		dispatch(nextPostsReceived(nextPosts));	
	}
}

export const sendNewPost = (data: PostDataType) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	dispatch(userActionStatusChanged({
		status: 'loading',
		target: 'post_adding'
	}));

	await streamAPI.addNewPost(data);

	const postChangedSubscriber = (updatedData: PostDataType) => {
		const posts = getState().stream.posts;
		console.log('subscriber', updatedData);

		if(updatedData.createdAt !== null && posts) {
			const isPostAdded = posts.filter(data => data.id === updatedData.id).length > 0;

			if(!isPostAdded) {
				dispatch(newPostReceived(updatedData));

			} else if (isPostAdded) {
				dispatch(questionChanged(updatedData));
			}
		}	
	}

	await streamAPI.subscribeOnPostChanges(data.id, postChangedSubscriber);

	dispatch(userActionStatusChanged({
		status: 'success',
		target: 'post_adding'  
	}));

	setTimeout(() => {
		dispatch(userActionStatusChanged(null));
	}, 1000);
}

export const deleteQuestion = (qId: string) => async (dispatch: AppDispatchType) => {
	//show loader to user
	dispatch(userActionStatusChanged({
		target: 'post_deleting',
		status: 'loading',
	}));
	await streamAPI.deleteQuestion(qId);

	//show success to user
	dispatch(userActionStatusChanged({
		target: 'post_deleting',
		status: 'success',
	}));

	//remove post from redux(local)
	dispatch(postRemoved(qId));

	setTimeout(() => {
		dispatch(userActionStatusChanged(null));
	}, 1000);
}

export const editQuestion = (qId: string, newText: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const [foundPostData] = getState().stream.posts?.filter(data => data.id === qId) || [];
	const openPostdata = getState().stream.openPostData;

	console.log('datas', foundPostData, openPostdata);

	if(foundPostData || openPostdata?.id === qId) {
		const data = foundPostData || openPostdata;

		//show loader
		dispatch(userActionStatusChanged({
			target: 'post_editing',
			status: 'loading',
		}));

		//send new text to server
		await streamAPI.editPost(data, newText);

		//hide loader
		dispatch(userActionStatusChanged(null));

		//update text data(local)
		dispatch(questionChanged({
			...data,
			text: newText,
			isEdited: true,
		}));
	}
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
	dispatch(userActionStatusChanged({
		status: 'loading',
		target: 'answer_adding'
	}));

	//+1 to number of comments in question doc
	streamAPI.increaceCommentsCount(questionId);


	//add doc to question>comments collection
	await streamAPI.addNewAnswer(questionId, data);

	const answerChangedSubscriber = (updatedData: CommentType) => {
		const currOpenPostAnswers = getState().stream.currPostAnswers;
		console.log('answer subscriber', updatedData);

		if(updatedData.createdAt !== null && currOpenPostAnswers) {
			//added -> change, not added -> add
			const isAnswerAdded = currOpenPostAnswers.filter(data => data.id === updatedData.id).length > 0;

			if(!isAnswerAdded) {
				//add new answer to state
				dispatch(newAnswerAdded(questionId, updatedData));

			} else if (isAnswerAdded) {
				//change ready answer
				dispatch(answerChanged(updatedData));
			}
		}	
	}

	//subscribe on changes on server
	await streamAPI.subscribeOnAnswerChanges(data.parentQId, data.id, answerChangedSubscriber);

	//show succes to user
	dispatch(userActionStatusChanged({
		status: 'success',
		target: 'answer_adding'
	}));

	//hide block with success text
	setTimeout(() => {
		dispatch(userActionStatusChanged(null));
	}, 1000)
} 

export const deleteAnswer = (qId: string, aId: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	dispatch(userActionStatusChanged({
		target: 'answer_deleting',
		status: 'loading',
	}));

	//-1 to number of comments in question doc
	streamAPI.decreaceCommentsCount(qId);

	//remove doc from question>comments collection
	await streamAPI.deleteAnswer(qId, aId);

	//set loader to success
	dispatch(userActionStatusChanged({
		target: 'answer_deleting',
		status: 'success',
	}));

	//remove answer from redux(local)
	dispatch(answerDeleted(qId, aId));

	setTimeout(() => {
		dispatch(userActionStatusChanged(null));
	}, 1000);

	//delete closed mark from question if answer was correct
	const questionAnotherCorrectAnswers = (await streamAPI.getPostAnswers(qId)).filter(ans => ans.id !== aId && ans.isCorrect);

	console.log('another correct answers', questionAnotherCorrectAnswers);

	if(questionAnotherCorrectAnswers.length < 1) dispatch(removeClosedQuestionMark(qId));

}

export const editAnswer = (aId: string, newText: string) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const data = getState().stream.currPostAnswers?.filter(data => data.id === aId);
	

	if(data && data[0]) {
		//loader instead of old text
		dispatch(userActionStatusChanged({
			status: 'loading',
			target: 'post_editing',
		}));

		console.log('set action status');

		//send new answer text to server
		const error = await streamAPI.editAnswer(data[0], newText);

		//show new text insted of loader 
		dispatch(userActionStatusChanged({
			status: error ? 'error' : 'success',
			target: 'post_editing',
		}));
		setTimeout(() => {
			dispatch(userActionStatusChanged(null));
		}, 1000);

		//change answer in redux(local)
		dispatch(answerChanged({
			...data[0],
			text: newText,
			isEdited: true,
		}));
	}
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

export const removeCorrentAnswerMark = (qId: string, aId: string) => (dispatch: AppDispatchType) => {
	dispatch(answerUnMarkedAsCorrect(aId));
	streamAPI.removeCorrentAnswerMark(qId, aId);
}

export const getPostAnswers = (postId: string) => async (dispatch: AppDispatchType) => {
	const answers = await streamAPI.getPostAnswers(postId);

	dispatch(currPostAnswersReceived(answers));
}

export const addClosedQuestionMark = (qId: string) => async (dispatch: AppDispatchType) => {
	dispatch(questionMarkedAsClosed(qId));

	await streamAPI.markQuestionAsClosed(qId);
}

export const removeClosedQuestionMark = (qId: string) => async (dispatch: AppDispatchType) => {
	dispatch(questionUnMarkedAsClosed(qId));

	await streamAPI.unmarkQuestionAsClosed(qId);
}