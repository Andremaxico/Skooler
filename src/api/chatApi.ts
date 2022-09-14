import { getApp } from 'firebase/app';
import { sendMessage } from './../../../samurai-way/src/Redux/messages-reducer';
import { MessageDataType, MessagesDataType } from './../utils/types/index';
import { query, collection, Firestore, orderBy, onSnapshot, DocumentData, addDoc, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebaseApi";

export type MessageSubscriberType = (messages: MessagesDataType) => void;

const subscribers: MessageSubscriberType[] = [];

const notifySubscribers = (data: MessagesDataType) => {
	console.log('notify subscribers');
	subscribers.forEach(sub => sub(data));
}

//get query 
const q = query(collection(firestore as Firestore, 'messages'), orderBy('createdAt'));

const unsubscribe = onSnapshot(q, (querySnapshot) => {
	console.log('on snapshot');
	let messages: DocumentData = [];
	querySnapshot.forEach((doc) => {
		messages.push({...doc.data(), id: doc.id});
	});
	notifySubscribers(messages as MessagesDataType);
});


const chatAPI = {
	async subscribe(subscriber: MessageSubscriberType) {
		const querySnapshot = await getDocs(q);
		let messages: DocumentData = [];
		querySnapshot.forEach((doc) => {
			messages.push({...doc.data(), id: doc.id})
		});
		console.log('data', messages);
		notifySubscribers( messages as MessagesDataType );

		subscribers.push(subscriber);
	},
	
	sendMessage(messageData: MessageDataType)  {
		console.log('api send message data', messageData);
		addDoc(collection(firestore as Firestore, 'messages'), messageData); 
	},

	unsubscribe() {
		unsubscribe();
	}
}

export default chatAPI;