import { RootStateType, AppDispatchType } from './../store';


export const selectPosts = (state: RootStateType) => {
	return state.stream.posts;
}

export const selectQuesionsCategories = (state: RootStateType) => {
	return state.stream.categories;
}

export const selectOpenPostData = (state: RootStateType) => {
	return state.stream.openPostData;
}

export const selectIsSearchShowing = (state: RootStateType) => {
	return state.stream.isSearchShowing;
}

export const selectCurrPostAnswers = (state: RootStateType) => {
	return state.stream.currPostAnswers;
}

export const selectSearchedPosts = (state: RootStateType) => {
	return state.stream.searchedPosts;
}

export const selectCurrStreamScrollValue = (state: RootStateType) => {
	return state.stream.currStreamScrollValue;
}

export const selectPostAddingStatus = (state: RootStateType) => {
	return state.stream.postAddingStatus;
}

export const selectAnswerAddingStatus = (state: RootStateType) => {
	return state.stream.answerAddingStatus;
}