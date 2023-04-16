import { mySchoolAPI } from './../../api/mySchoolApi';
import { AppDispatchType, RootStateType } from './../store';
import { createAction, createReducer } from "@reduxjs/toolkit";
import { EventDataType, ReceivedAccountDataType } from "../../utils/types";

//=======================ACTIONS=================
const eventsReceived = createAction<EventDataType[]>('school/EVENTS_RECEIVED')
const currSchoolPupilsReceived = createAction<ReceivedAccountDataType[]>('schhol/CURR_SCHOOL_PUPILS_RECEIVED');
const currClassPupilsChanged = createAction<ReceivedAccountDataType[]>('school/CURR_CLASS_PUPILS_CHANGED');
//=-------================REDUCER====================
type SchoolStateType = {
	eventsData: EventDataType[] | null,
	currSchoolPupils: ReceivedAccountDataType[] | null,
	currClassPupils: ReceivedAccountDataType[] | null,
};
const initialState: SchoolStateType = {
	eventsData: null,
	currSchoolPupils: null,
	currClassPupils: null,
}

export const schoolReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(eventsReceived, (state, action) => {
			state.eventsData = action.payload;
		})
		.addCase(currSchoolPupilsReceived, (state, action) => {
			state.currSchoolPupils = action.payload
		})
		.addCase(currClassPupilsChanged, (state, action) => {
			state.currClassPupils = action.payload  
		})
		.addDefaultCase((state, action) => {})
});

//=======================THUNKS=====================================	

// //get events from server and set to state
// export const setMySchoolEvents = () => async (dispatch: AppDispatchType) => {
// 	const data = await mySchoolAPI.getEvents();

// 	console.log('events', data);

// 	dispatch(eventsReceived(data));
// }

//subscribe on events updates
export const startNewEventsListening = () => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const mySchoolId = getState().account.myAccountData?.school.institution_id;
	await mySchoolAPI.subscribe((events: EventDataType[]) => {
		dispatch(eventsReceived(events));
	}, mySchoolId || '');
}

//unsubscribe on events updates
export const stopNewEventsListening = () => async (dispatch: AppDispatchType) => {
	await mySchoolAPI.unsubscribe();
}

//get pupils
export const setMySchoolPupils = () => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const mySchoolId = getState().account.myAccountData?.school.institution_id;
	console.log('school id', mySchoolId);
	if(mySchoolId) {
		const data = await mySchoolAPI.getPupilsBySchoolId(mySchoolId);

		dispatch(currSchoolPupilsReceived(data));

		console.log('pupils', data);
	}
}

export const setCurrClassPupils = (classNum: string | null) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	console.log('reducer classNum', classNum);
	const allCurrSchoolPupils: ReceivedAccountDataType[] | null = getState().mySchool.currSchoolPupils;

	console.log('all curr school pupils', allCurrSchoolPupils);

	let currClassPupils = allCurrSchoolPupils;

	if(classNum !== null && allCurrSchoolPupils) {
		currClassPupils = allCurrSchoolPupils?.filter(pupil => (
			pupil.class == classNum
		));
	}

	console.log('curr class pupil', currClassPupils);
	if(currClassPupils) {
		dispatch(currClassPupilsChanged(currClassPupils));
	}
}

//send data to api
export const sendNewEvent = (data: EventDataType) => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	const mySchoolId = getState().account.myAccountData?.school.institution_id;

	await mySchoolAPI.addEvent(data, mySchoolId || '');
	console.log('new event data', data);
}