import { MessageDataType, MessagesDataType } from './../utils/types/index';
import { query, collection, Firestore, orderBy, onSnapshot, DocumentData, getDocs, setDoc, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseApi";

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

let unsubscribeFromMessages = () => {}; //nothing




const chatAPI = {
	async subscribe(subscriber: MessageSubscriberType) {
		notifyFetchingSubscribers(true);

		const querySnapshot = await getDocs(q);

		let messages: DocumentData = [];
		querySnapshot.forEach((doc) => {
			messages.push({...doc.data(), id: doc.id})
		});
		unsubscribeFromMessages = onSnapshot(q, 
			(querySnapshot) => {
				let messages: DocumentData = [];

				querySnapshot.forEach((doc) => {
					messages.push({...doc.data(), id: doc.id});
				});

				notifyMessagesSubscribers(messages as MessagesDataType);
			},
			(error) => {
				console.log('error' ,error.message);
			}
		);

		console.log('messages data', messages);

		subscribers['messages-subs'].push(subscriber);

		notifyMessagesSubscribers( messages as MessagesDataType );
		notifyFetchingSubscribers(false);


		unsubscribeFromMessages = onSnapshot(q, 
			(querySnapshot) => {
				let messages: DocumentData = [];
		
				querySnapshot.forEach((doc) => {
					messages.push({...doc.data(), id: doc.id});
				});
		
				notifyMessagesSubscribers(messages as MessagesDataType);
			},
			(error) => {
				console.log('error' ,error.message);
			}
		);
	},

	async fetchingSubscribe(subscriber: FetchingSubscriberType) {
		subscribers['fetching-sub'].push(subscriber);
	},
	
	sendMessage(messageData: MessageDataType)  {
		try {
			setDoc(doc(firestore, 'messages', messageData.id), messageData); 
			
		} catch(e) {
			console.log(e);
		}
	},

	async readMessage(messageId: string, uid: string) {
		const docRef = doc(firestore, 'messages', messageId);
		const messageData = await getDoc(docRef);
		await updateDoc(docRef, {
			usersWhoRead: [...messageData.data()?.usersWhoRead, uid]
		});
	},

	unsubscribe() {
		console.log('unsubscribe');
		unsubscribeFromMessages();
	},

	async deleteMessage(messageId: string) {
		const docRef = doc(firestore, 'messages', messageId);

		//delete document
		await deleteDoc(docRef);
	},

	async updateMessage(messageId: string, newText: string) {
		const docRef = doc(firestore, 'messages', messageId);
		console.log('update message', messageId, newText);
		await updateDoc(docRef, {
			text: newText,
			edited: true,
		})
	}
}

export default chatAPI;