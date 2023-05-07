import { ChatDataType, MessageDataType, MessagesDataType } from './../utils/types/index';
import { query, collection, Firestore, orderBy, onSnapshot, DocumentData, getDocs, setDoc, doc, updateDoc, getDoc, deleteDoc, addDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseApi";

export type MessageSubscriberType = (messages: MessagesDataType) => void;
export type FetchingSubscriberType = (value: boolean) => void;
export type ChatsSubscriberType = (chatsData: ChatDataType[]) => void;

type SubscribersObjType = {}
type UnsubscribersType = {
	messages?: Function,
	chats?: Function,
}

const subscribers = {
	'messages-subs': [] as MessageSubscriberType[],
	'fetching-sub': [] as FetchingSubscriberType[],
	'chats-sub': [] as ChatsSubscriberType[],
}

const notifyMessagesSubscribers = (data: MessagesDataType) => {
	subscribers['messages-subs'].forEach(sub => sub(data));
}

const notifyFetchingSubscribers = (value: boolean) => {
	subscribers['fetching-sub'].forEach(sub => sub(value));
}

const notifyChatsSubscribers = (data: ChatDataType[]) => {
	subscribers['chats-sub'].forEach(sub => sub(data));
}


const unsubscribers: UnsubscribersType = {}; //nothing -> function after subscribe

const chatAPI = {
	async subscribe(subscriber: MessageSubscriberType, uid: string, uid2: string) {
		notifyFetchingSubscribers(true);

		let q = query(
			collection(firestore as Firestore, `messages/chat/${uid}/${uid2}/messages`), 
			orderBy('createdAt')
		);

		unsubscribers.messages = onSnapshot(q, 
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

		subscribers['messages-subs'].push(subscriber);

		notifyFetchingSubscribers(false);
	},

	async fetchingSubscribe(subscriber: FetchingSubscriberType) {
		subscribers['fetching-sub'].push(subscriber);
	},
	
	sendMessage(messageData: MessageDataType, uid1: string, uid2: string)  {
		try {
			const messageDoc = doc(firestore, `messages/chat/${uid1}/${uid2}/messages`, messageData.id)
			setDoc(messageDoc, messageData); 
			
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
		if(unsubscribers.messages) {
			unsubscribers.messages();
		}
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
	},

	async getChatsData(uid: string) {
		const q = query(
			collection(firestore, `messages/chat/${uid}`),
			orderBy('lastMessageTime', 'desc'),
		);

		const qSnapshot = await getDocs(q);

		const chatsData: ChatDataType[] = []; 

		qSnapshot.forEach(snap => {
			if(snap.exists()) {
				chatsData.push(snap.data() as ChatDataType);
			}
		});

		return chatsData;
	},    

	async subscribeOnChats(uid: string, subscriber: ChatsSubscriberType) {
		subscribers['chats-sub'].push(subscriber);

		const q = query(
			collection(firestore, `messages/chat/${uid}`),
			orderBy('lastMessageTime', 'desc')
		);

		unsubscribers.chats = onSnapshot(q, 
			(snap) => {
				const chatsData: ChatDataType[] = [];

				snap.forEach(doc => {
					if(doc.exists()) {
						console.log('doc data', doc.data());
						chatsData.push(doc.data() as ChatDataType);
					}
				});

				notifyChatsSubscribers(chatsData);
			}
		);

	},

	async setChatInfo(data: ChatDataType, uid1: string, uid2: string) {
		setDoc(
			doc(firestore, `messages/chat/${uid1}/${uid2}`), 
			data,   
		);
	},

	async updateChatInfo(data: ChatDataType, uid1: string, uid2: string) {
		updateDoc(
			doc(firestore, `messages/chat/${uid1}/${uid2}`), 
			data,   
		);
	},
}

export default chatAPI;