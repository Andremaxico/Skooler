import { DocumentData, onSnapshot, Query, QuerySnapshot, Unsubscribe, where } from 'firebase/firestore';
import { orderBy } from 'firebase/firestore';
import { schoolInfoReceived } from './../Redux/account/account-reducer';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseApi';
import { EventDataType, ReceivedAccountDataType } from './../utils/types/index';

type EventSubscriberType = (events: EventDataType[]) => void;
let eventsSubscribers: EventSubscriberType[] = [];

let unsubscribeFromEvents: Unsubscribe | null = null;
let eventsQuery:  Query<DocumentData> | null = null;

const callEventsSubscribers = (events: EventDataType[]) => {
	eventsSubscribers.forEach(sub => sub(events));
}

const parseEvents = (snapshot: QuerySnapshot<DocumentData>) => {
	let events: EventDataType[] = [];

	snapshot.forEach(doc => {
		//remove old
		if(doc.exists()) {
			let eventData = doc.data();
			//check if event is in future
			const timeToEvent = new Date(doc.data().date.seconds * 1000).getTime() - new Date().getTime();
			if(timeToEvent < 0) {
				eventData = { ...eventData, isPast: true };
				//delete document
				deleteDoc(doc.ref);
			}

			events.push(eventData as EventDataType);
		} else {
			alert('Такої школи не існує');
		}
	});

	callEventsSubscribers(events);
}

export const mySchoolAPI = {
	//get events by start
	async getEvents() {
		if(eventsQuery) {
			const querySnapshot = await getDocs(eventsQuery);
			parseEvents(querySnapshot);
		}
	},

	async getPupilsBySchoolId(id: string) {
		console.log('schoolds id', id);
		let pupils: ReceivedAccountDataType[] = [];
		const q = query(collection(firestore, 'users'), where('school.institution_id', '==', id));

		const docs = await getDocs(q);
		docs.forEach(doc => {
			if(doc.exists()) {
				pupils.push(doc.data() as ReceivedAccountDataType);
			} else {
				console.error('No user');
				return;
			}
		});

		return pupils;
		
	},

	//subscribe on updates
	async subscribe(sub: EventSubscriberType, schoolId: string) {
		eventsSubscribers.push(sub);
		eventsQuery = query(collection(firestore, 'schools', schoolId, 'events'), orderBy('date'));
		unsubscribeFromEvents = onSnapshot(eventsQuery, (snapshot) => parseEvents(snapshot));
	},

	//send new event data to server
	async addEvent(data: EventDataType, schoolId: string) {
		const docRef = doc(firestore, 'schools', schoolId, 'events', data.id);
		await setDoc(docRef, data);
	},

	unsubscribe() {
		if(unsubscribeFromEvents) {
			unsubscribeFromEvents();
		}
	}
}