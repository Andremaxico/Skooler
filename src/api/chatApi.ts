import { getApp } from 'firebase/app';
import { sendMessage } from './../../../samurai-way/src/Redux/messages-reducer';
import { MessageDataType, MessagesDataType } from './../utils/types/index';
import { query, collection, Firestore, orderBy, onSnapshot, DocumentData, addDoc, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebaseApi";
import { ref, onValue, getDatabase } from 'firebase/database';

export type MessageSubscriberType = (messages: MessagesDataType) => void;
export type FetchingSubscriberType = (value: boolean) => void;

type SubscribersObjType = {}

const subscribers = {
	'messages-subs': [] as MessageSubscriberType[],
	'fetching-sub': [] as FetchingSubscriberType[],
}

const notifyMessagesSubscribers = (data: MessagesDataType) => {
	subscribers['messages-subs'].forEach(sub => sub(data));
}

const notifyFetchingSubscribers = (value: boolean) => {
	subscribers['fetching-sub'].forEach(sub => sub(value));
}

//get query 
const q = query(collection(firestore as Firestore, 'messages'), orderBy('createdAt'));

const unsubscribeFromMessages = onSnapshot(q, 
	(querySnapshot) => {
		let messages: DocumentData = [];

		querySnapshot.forEach((doc) => {
			messages.push({...doc.data(), id: doc.id});
		});

		console.log('end');
		notifyMessagesSubscribers(messages as MessagesDataType);
	},
	(error) => {
		console.log('error' ,error.message);
	}
);


const chatAPI = {
	async subscribe(subscriber: MessageSubscriberType) {
		notifyFetchingSubscribers(true);

		const querySnapshot = await getDocs(q);

		let messages: DocumentData = [];
		querySnapshot.forEach((doc) => {
			messages.push({...doc.data(), id: doc.id})
		});

		console.log('messages data', messages);

		subscribers['messages-subs'].push(subscriber);

		notifyMessagesSubscribers( messages as MessagesDataType );
		notifyFetchingSubscribers(false);

	},

	async fetchingSubscribe(subscriber: FetchingSubscriberType) {
		subscribers['fetching-sub'].push(subscriber);
	},
	
	sendMessage(messageData: MessageDataType)  {
		try {
			addDoc(collection(firestore as Firestore, 'messages'), messageData); 
			
		} catch(e) {
			console.log(e);
		}
	},

	unsubscribe() {
		console.log('unsubscribe');
		unsubscribeFromMessages();
	}
}

export default chatAPI;