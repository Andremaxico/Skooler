import { ChatDataType, MessageDataType, MessagesDataType } from './../utils/types/index';
import { query, collection, Firestore, orderBy, onSnapshot, DocumentData, getDocs, setDoc, doc, updateDoc, getDoc, deleteDoc, addDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseApi";
import { GENERAL_CHAT_ID } from '../utils/constants';

export type MessageSubscriberType = (messages: MessagesDataType) => void;
export type FetchingSubscriberType = (value: boolean) => void;
export type ChatsSubscriberType = (chatsData: ChatDataType[]) => void;
export type ChatSubscriberType = (chatData: ChatDataType) => void;
 
type SubscribersObjType = {}
type UnsubscribersType = {
	messages?: Function,
	chats?: Function,
	chat?: Function,
}

const subscribers = {
	'messages-subs': [] as MessageSubscriberType[],
	'fetching-sub': [] as FetchingSubscriberType[],
	'chats-sub': [] as ChatsSubscriberType[],
	'chat-sub': null as ChatSubscriberType | null,
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

const notifyChatSubscriber = (data: ChatDataType) => {
	const sub = subscribers['chat-sub'];
	if(sub) {
		sub(data);
	}
}


const unsubscribers: UnsubscribersType = {}; //nothing -> function after subscribe

const chatAPI = {
	async subscribe(subscriber: MessageSubscriberType, uid: string, contactUid: string) {
		notifyFetchingSubscribers(true);

		let q = query(
			collection(firestore as Firestore, `messages/chat/${uid}/${contactUid}/messages`), 
			orderBy('createdAt')
		);

		try {
			unsubscribers.messages = onSnapshot(q, 
				(querySnapshot) => {
					let messages: DocumentData = [];

					console.log('snapshot');

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
		} catch(e) {

		}
	},

	async subscribeOnGeneralChatMessages(subscriber: MessageSubscriberType) {
		notifyFetchingSubscribers(true);

		let q = query(
			collection(firestore as Firestore, `messages/chat/${GENERAL_CHAT_ID}`), 
			orderBy('createdAt')
		);
		unsubscribers.messages = onSnapshot(q, 
			(querySnapshot) => {
				let messages: DocumentData = [];

				console.log('snapshot');

				querySnapshot.forEach((doc) => {
					console.log('doc data', doc.data());
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
	
	async sendMessage(messageData: MessageDataType, uid1: string, contactUid: string)  {
		const messageDoc = doc(firestore, `messages/chat/${uid1}/${contactUid}/messages`, messageData.id)
		await setDoc(messageDoc, messageData); 
	},

	async readMessage(messageId: string, uid: string, contactUid: string) {
		const docRef = doc(firestore, 'messages', 'chat', uid, contactUid, 'messages', messageId);
		//const messageData = await getDoc(docRef);
		await updateDoc(docRef, {
			//usersWhoRead: [...messageData.data()?.usersWhoRead, uid]
			isRead: true,
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

	async updateMessage(messageId: string, newText: string, uid1: string, contactUid: string,) {
		const docRef = doc(firestore, 'messages', 'chat', uid1, contactUid, 'messages', messageId);
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

	async subscribeOnChatInfo(uid1: string, contactUid: string, subscriber: ChatSubscriberType) {
		subscribers['chat-sub'] = subscriber;

		const ref = doc(firestore, 'messages', 'chat', uid1, contactUid);

		let chatInfo: ChatDataType | null = null;

		try {
			unsubscribers.chat = onSnapshot(ref, (snap) => {
				console.log('chat data updated');
				if(snap.exists()) {
					chatInfo = snap.data() as ChatDataType;
					notifyChatSubscriber(chatInfo);
				}
			});
		} catch(e) {

		}
	},

	async unsubscribeFromChatInfo() {
		if(unsubscribers.chat) {
			unsubscribers.chat();
			subscribers['chat-sub'] = null;
		}
	},

	async setChatInfo(data: ChatDataType, uid1: string, contactUid: string) {
		try {
			setDoc(
				doc(firestore, `messages/chat/${uid1}/${contactUid}`), 
				data,   
			);
		} catch(e) {

		}
	},

	async updateChatInfo(data: ChatDataType, uid1: string, contactUid: string) {
		try {
			updateDoc(
				doc(firestore, `messages/chat/${uid1}/${contactUid}`), 
				data,   
			);
		} catch(e) {

		}
	},

	async increaceUnreadCount(uid1: string, contactUid: string) {
		const ref = doc(firestore, 'messages', 'chat', contactUid, uid1)
		const prevDoc = await getDoc(ref);

		let prevData: null | ChatDataType = null;

		try {
			if(prevDoc.exists()) {
				prevData = prevDoc.data() as ChatDataType;
				console.log('increase unread count', prevData);
				if(prevData && prevData.unreadCount) {
					updateDoc(
						ref, {
							unreadCount: (prevData?.unreadCount || 0) + 1,
						}
					)
				}
			}
		} catch(e) {

		}
	},
	async decreaceUnreadCount(uid1: string, contactUid: string) {
		const ref = doc(firestore, 'messages', 'chat', uid1, contactUid)
		const prevDoc = await getDoc(ref);

		console.log('decrese unread count', prevDoc);

		let prevData: null | ChatDataType = null;
		try {
			if(prevDoc.exists()) {
				prevData = prevDoc.data() as ChatDataType;
	
				if(prevData && prevData.unreadCount) {
					updateDoc( 
						ref, {
							unreadCount: prevData.unreadCount - 1,
						}
					)
				}
			}
		} catch(e) {

		}
	},
}

export default chatAPI;