import { CommentType, QuestionCategoriesType } from './../utils/types/index';
import { addDoc, collection, deleteDoc, doc, DocumentData, endAt, getDoc, getDocs, getFirestore, limit, onSnapshot, orderBy, Query, query, QuerySnapshot, setDoc, startAfter, startAt, updateDoc, where } from "firebase/firestore"
import { firestore } from "../firebase/firebaseApi"
import { PostDataType } from "../utils/types";
import { once } from 'lodash';
import { orderByChild } from 'firebase/database';
import { lime } from '@mui/material/colors';

let unsubscribeFromQChanges: {[key: string]: Function} = {};
let unsubscribeFromAnChanges: {[key: string]: Function} = {};

let documentSnapshots: QuerySnapshot<DocumentData> | null = null;

export const streamAPI =  {
	async getPosts(lastVisiblePost: PostDataType | null) {
		const postsRef = collection(firestore, 'questions');
		const postsLimit = 10;
		let nextPosts: DocumentData[] = [];

		console.log('get posts--------------');

		// Query the first page of docs
		const first = query(collection(firestore, "questions"), orderBy("createdAt"), limit(25));
		documentSnapshots = await getDocs(first);

		// Get the last visible document
		const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
		console.log("last", lastVisible);

		// Construct a new query starting at this document,
		// get the next 25 cities.
		if(lastVisiblePost) {
			console.log('last visible post isnot null');
			const next = query(collection(firestore, "questions"),
				orderBy("createdAt", 'desc'),
				startAfter(lastVisible),
				limit(10));
			documentSnapshots = await getDocs(next);  

		} else {
			// Query the first page of docs
			const first = query(collection(firestore, "questions"), orderBy("createdAt", 'desc'), limit(10));
			documentSnapshots = await getDocs(first);
		}
   
		if(documentSnapshots) {
			documentSnapshots.forEach(doc => {
				console.log('foreach posts');
				if(doc.exists()) {
					nextPosts.push(doc.data());
				}
			});

			console.log('next posts', nextPosts);

			return nextPosts as PostDataType[];
		}
	},

	async editPost(data: PostDataType, newText: string) {
		const changingPost = doc(firestore, 'questions', data.id);

		await updateDoc(changingPost, {
			...data,
			text: newText,
			isEdited: true,
		})
	},

	async addNewPost(data: PostDataType) {
		if(data) {
			await setDoc(doc(firestore, 'questions', data.id), {
				...data
			});
		}
	},

	//no in use
	async getPostById(id: string) {
		const docRef = doc(firestore, 'questions', id);
		const docSnap = await getDoc(docRef);

		let postData;

		if(docSnap.exists()) {
			postData = docSnap.data();
		}

		return postData as PostDataType;
	},

	async addStarToQuestion(id: string) {
		const questionDocref = doc(firestore, 'questions', id);
		const docRef = await getDoc(questionDocref);

		await updateDoc(questionDocref,{
			stars: docRef.data()?.stars + 1,
		});
	},

	async removeStarFromQuestion(id: string) {
		const questionDocref = doc(firestore, 'questions', id);
		const docRef = await getDoc(questionDocref);

		await updateDoc(questionDocref,{
			stars: docRef.data()?.stars - 1,
		});
	},

	async increaceCommentsCount(qId: string) {
		//increase comments count
		const questionRef = doc(firestore, 'questions', qId);
		const questionDoc = await getDoc(questionRef);
		if(questionDoc.exists()) {
			const prevCommentsCount = questionDoc.data().commentsCount;

			await updateDoc(questionRef, {
				commentsCount: prevCommentsCount + 1,
			})
		}
	},

	async addNewAnswer(questionId: string, data: CommentType) {
		//add answer to collection
		const newAnswerRef = doc(firestore, 'questions', questionId, 'comments', data.id);
		await setDoc(newAnswerRef, data);
	},

	async editAnswer(data: CommentType, newText: string) {
		const changingAnswer = doc(firestore, 'questions', data.parentQId, 'comments', data.id);

		await updateDoc(changingAnswer, {
			...data,
			text: newText,
			isEdited: true,
		})
	},

	async getPostsByQuery(queryStr: string, category: QuestionCategoriesType) {
		const postsRef = collection(firestore, 'questions');
		const postsQ = query(postsRef, where('category', '==', category));
		const docs = await getDocs(postsQ);

		let posts: DocumentData[] = [];
		docs.forEach(doc => {
			if(doc.exists()) {
				if(doc.data().text.includes(queryStr)) posts.push(doc.data());
			}
		});

		return posts as PostDataType[];
	},

	async getPostAnswers(postId: string) {
		const answerRef = collection(firestore, 'questions', postId, 'comments');
		const answersQ = query(answerRef);
		const docs = await getDocs(answersQ);

		let answers: DocumentData[] = [];
		docs.forEach(doc => {
			if(doc.exists()) {
				answers.push(doc.data());
			}
		});

		return answers as CommentType[];
	},

	async addCorrentAnswerMark(qId: string, aId: string) {
		console.log('api ids', qId, aId);
		const answerRef = doc(firestore, 'questions', qId, 'comments', aId);

		await updateDoc(answerRef, {
			isCorrect: true,
		})
	},

	async removeCorrentAnswerMark(qId: string, aId: string) {
		const answerRef = doc(firestore, 'questions', qId, 'comments', aId);

		await updateDoc(answerRef, {
			isCorrect: false,
		})
	},

	async markQuestionAsClosed(qId: string) {
		const questionRef = doc(firestore, 'questions', qId);

		await updateDoc(questionRef, {
			isClosed: true,
		})
	},

	async unmarkQuestionAsClosed(qId: string) {
		const questionRef = doc(firestore, 'questions', qId);

		await updateDoc(questionRef, {
			isClosed: false,
		})
	},

	async subscribeOnPostChanges(qId: string, subscriber: (data: PostDataType) => void) {
		const questionRef = doc(firestore, 'questions', qId);

		unsubscribeFromQChanges[qId] = onSnapshot(questionRef, 
			(querySnap) => {
				let updatedPost: PostDataType | null = null;

				if(querySnap.exists()) updatedPost = querySnap.data() as PostDataType; 

				if(updatedPost) subscriber(updatedPost);
			}
		);
	},

	async subscribeOnAnswerChanges(qId: string, aId: string, subscriber: (data: CommentType) => void) {
		const answerRef = doc(firestore, 'questions', qId, 'comments', aId);

		unsubscribeFromAnChanges[qId] = onSnapshot(answerRef, 
			(querySnap) => {
				let updatedAnswer: CommentType | null = null;

				if(querySnap.exists()) updatedAnswer = querySnap.data() as CommentType; 

				console.log('updated answer', updatedAnswer);

				if(updatedAnswer) subscriber(updatedAnswer);
			}
		);
	},

	async unsubscribeFromPostChanges() {

	},

	async deleteQuestion(qId: string) {
		const questionRef = doc(firestore, 'questions', qId);
		await deleteDoc(questionRef);
	},

	async deleteAnswer(qId: string, aId: string) {
		const answerRef = doc(firestore, 'questions', qId, 'comments', aId);

		await deleteDoc(answerRef);
	},

	async decreaceCommentsCount(qId: string) {
		//decrease comments count
		const questionRef = doc(firestore, 'questions', qId);
		const questionDoc = await getDoc(questionRef);
		if(questionDoc.exists()) {
			const prevCommentsCount = questionDoc.data().commentsCount;

			await updateDoc(questionRef, {
				commentsCount: prevCommentsCount - 1,
			})
		}
	}
}