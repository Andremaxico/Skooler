import { CommentType, QuestionCategoriesType } from './../utils/types/index';
import { addDoc, collection, deleteDoc, doc, DocumentData, endAt, getDoc, getDocs, getFirestore, limit, onSnapshot, orderBy, Query, query, QuerySnapshot, setDoc, startAfter, startAt, updateDoc, where } from "firebase/firestore"
import { firestore } from "../firebase/firebaseApi"
import { PostDataType } from "../utils/types";
import { once } from 'lodash';
import { orderByChild } from 'firebase/database';
import { lime } from '@mui/material/colors';
import { POSTS_QUERY_LIMIT } from '../utils/constants';
import ErrorList from 'antd/es/form/ErrorList';

let unsubscribeFromQChanges: {[key: string]: Function} = {};
let unsubscribeFromAnChanges: {[key: string]: Function} = {};

let documentSnapshots: QuerySnapshot<DocumentData> | null = null;

export const streamAPI =  {
	async getPosts(lastVisiblePostId: string | null) {
		const postsRef = collection(firestore, 'questions');
		const postsLimit = POSTS_QUERY_LIMIT;
		let nextPosts: DocumentData[] = [];

		// Query the first page of docs
		const first = query(postsRef, orderBy("createdAt", 'desc'), limit(postsLimit));
		documentSnapshots = await getDocs(first);

		// Get the last visible document
		// const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
		// console.log("last", lastVisible);

		// Construct a new query starting at this document,
		// get the next 25 cities.
		if(lastVisiblePostId) {
			const lastVisiblePostQ = query(postsRef, where('id', '==', lastVisiblePostId));
			const lastVisiblePostSnaps = await getDocs(lastVisiblePostQ);
			let lastVisiblePostSnap = null;
			lastVisiblePostSnaps.forEach(snap => {
				if(snap.exists()) {
					lastVisiblePostSnap = snap;
				}
			})
			if(lastVisiblePostSnap) {
				const next = query(postsRef,
					orderBy("createdAt", 'desc'),
					startAfter(lastVisiblePostSnap),
					limit(postsLimit)
				);
				documentSnapshots = await getDocs(next);  
			}
		}
   
		if(documentSnapshots) {
			documentSnapshots.forEach(doc => {
				if(doc.exists()) {
					nextPosts.push(doc.data());
				}
			});

			console.log('next posts api', nextPosts);

			return nextPosts as PostDataType[];
		}
	},

	async getUserQuestions(uid: string) {
		try {
			const questionRef = collection(firestore, 'questions');
			const docs = query(questionRef, where('authorId', '==', uid));

			const snapshots = await getDocs(docs);

			const questions: PostDataType[] = [];

			snapshots.forEach(snap => {
				if(snap.exists()) questions.push(snap.data() as PostDataType);
			});

			return questions;
		} catch (e) {
			return e;
		}
	},

	async editPost(data: PostDataType, newText: string) {
		try {
			const changingPost = doc(firestore, 'questions', data.id);

			await updateDoc(changingPost, {
				...data,
				text: newText,
				isEdited: true,
			})
		} catch (e) {
			return e
		}
	},

	async addNewPost(data: PostDataType) {
		if(data) {
			try {
				await setDoc(doc(firestore, 'questions', data.id), {
					...data
				});
			} catch(e) {

			}
		}
	},

	//no in use
	async getPostById(id: string) {
		try {
			const docRef = doc(firestore, 'questions', id);
			const docSnap = await getDoc(docRef);

			let postData;

			if(docSnap.exists()) {
				postData = docSnap.data();
			}

			return postData as PostDataType;
		} catch (e) {
			return e;
		}
	},

	async addStarToQuestion(id: string) {
		const questionDocref = doc(firestore, 'questions', id);
		const docRef = await getDoc(questionDocref);

		try {
			await updateDoc(questionDocref,{
				stars: docRef.data()?.stars + 1,
			});
		} catch (e) {

		}
	},

	async removeStarFromQuestion(id: string) {
		const questionDocref = doc(firestore, 'questions', id);
		const docRef = await getDoc(questionDocref);

		try {
			await updateDoc(questionDocref,{
				stars: docRef.data()?.stars - 1,
			});
		} catch(e) {
			return e;
		} 
	},

	async increaceCommentsCount(qId: string) {
		//increase comments count
		const questionRef = doc(firestore, 'questions', qId);
		const questionDoc = await getDoc(questionRef);

		try {
			if(questionDoc.exists()) {
				const prevCommentsCount = questionDoc.data().commentsCount;

				await updateDoc(questionRef, {
					commentsCount: prevCommentsCount + 1,
				})
			}
		} catch(e) {
			return e;
		}
	},

	async addNewAnswer(questionId: string, data: CommentType) {
		//add answer to collection
		const newAnswerRef = doc(firestore, 'questions', questionId, 'comments', data.id);
		try {
			await setDoc(newAnswerRef, data);
		} catch(e) {
			return e;
		}
	},

	async editAnswer(data: CommentType, newText: string) {
		const changingAnswer = doc(firestore, 'questions', data.parentQId, 'comments', data.id);

		try {
			await updateDoc(changingAnswer, {
				...data,
				text: newText,
				isEdited: true,
			})
		} catch (error) {
			return error;
		}
	},

	async getPostsByQuery(queryStr: string, category: QuestionCategoriesType) {
		const postsRef = collection(firestore, 'questions');
		const postsQ = query(postsRef, where('category', '==', category));
		const docs = await getDocs(postsQ);

		try {
			let posts: DocumentData[] = [];
			docs.forEach(doc => {
				if(doc.exists()) {
					if(doc.data().text.includes(queryStr)) posts.push(doc.data());
				}
			});

			return posts as PostDataType[];
		} catch(e) {
			return e;
		}
	},

	async getPostAnswers(postId: string) {
		const answerRef = collection(firestore, 'questions', postId, 'comments');
		const answersQ = query(answerRef);
		const docs = await getDocs(answersQ);


		try {
			let answers: DocumentData[] = [];
			docs.forEach(doc => {
				if(doc.exists()) {
					answers.push(doc.data());
				}
			});

			return answers as CommentType[];
		} catch(e) {
			return e;
		}
	},

	async addCorrentAnswerMark(qId: string, aId: string) {
		console.log('api ids', qId, aId);
		const answerRef = doc(firestore, 'questions', qId, 'comments', aId);

		try {
			await updateDoc(answerRef, {
				isCorrect: true,
			})
		} catch(e) {
			return e;
		}
	},

	async removeCorrentAnswerMark(qId: string, aId: string) {
		const answerRef = doc(firestore, 'questions', qId, 'comments', aId);

		try {
			await updateDoc(answerRef, {
				isCorrect: false,
			})
		} catch(e) {
			return e;
		}
	},

	async markQuestionAsClosed(qId: string) {
		const questionRef = doc(firestore, 'questions', qId);

		try {
			await updateDoc(questionRef, {
				isClosed: true,
			})
		} catch(e) {
			return e
		}
	},

	async unmarkQuestionAsClosed(qId: string) {
		const questionRef = doc(firestore, 'questions', qId);

		try {
			await updateDoc(questionRef, {
				isClosed: false,
			})
		} catch(e) {
			return e;
		}
	},

	async subscribeOnPostChanges(qId: string, subscriber: (data: PostDataType) => void) {
		const questionRef = doc(firestore, 'questions', qId);

		try {
			unsubscribeFromQChanges[qId] = onSnapshot(questionRef, 
				(querySnap) => {
					let updatedPost: PostDataType | null = null;

					if(querySnap.exists()) updatedPost = querySnap.data() as PostDataType; 

					if(updatedPost) subscriber(updatedPost);
				}
			);
		} catch(e) {
			return e;
		}
	},

	async subscribeOnAnswerChanges(qId: string, aId: string, subscriber: (data: CommentType) => void) {
		const answerRef = doc(firestore, 'questions', qId, 'comments', aId);

		try {
			unsubscribeFromAnChanges[qId] = onSnapshot(answerRef, 
				(querySnap) => {
					let updatedAnswer: CommentType | null = null;

					if(querySnap.exists()) updatedAnswer = querySnap.data() as CommentType; 

					console.log('updated answer', updatedAnswer);

					if(updatedAnswer) subscriber(updatedAnswer);
				}
			);
		} catch(e) {
			return e;
		}
	},

	async unsubscribeFromPostChanges() {

	},

	async deleteQuestion(qId: string) {
		const questionRef = doc(firestore, 'questions', qId);
		try {
			await deleteDoc(questionRef);
		} catch(e) {
			return e;
		}
	},

	async deleteAnswer(qId: string, aId: string) {
		const answerRef = doc(firestore, 'questions', qId, 'comments', aId);

		try {

		} catch(e) {
			await deleteDoc(answerRef);
		}
	},

	async decreaceCommentsCount(qId: string) {
		//decrease comments count
		const questionRef = doc(firestore, 'questions', qId);
		const questionDoc = await getDoc(questionRef);

		try {
			if(questionDoc.exists()) {
				const prevCommentsCount = questionDoc.data().commentsCount;

				await updateDoc(questionRef, {
					commentsCount: prevCommentsCount - 1,
				})
			}
		} catch (e) {
			return e;
		}
	}
}