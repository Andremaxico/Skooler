import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { startNewEventsListening, stopNewEventsListening } from '../../../Redux/mySchool/school-reducer';
import { selectMySchoolEvents } from '../../../Redux/mySchool/school-selectors';
import { useAppDispatch } from '../../../Redux/store';
import Preloader from '../../../UI/Preloader';
import { getNumberOfDays } from '../../../utils/helpers/date/getNumberOfDays';
import { EventDataType } from '../../../utils/types';
import { Event } from './Event';
import classes from './Events.module.scss';
import { NewEventForm } from './NewEventForm';

type PropsType = {
	isAdmin: boolean,
};

const isEventPast = (event: EventDataType): boolean => {
	//@ts-ignore
	const eventTime = new Date(event.date.seconds * 1000).getTime();
	const currTime = new Date().getTime();
	console.log('number of days', getNumberOfDays(eventTime, currTime));
	return getNumberOfDays(eventTime, currTime) >= 0;
}

export const Events: React.FC<PropsType> = ({isAdmin}) => {
	//when events fetching
	const [isFetching, setIsFetching] = useState<boolean>(false);
	//is new event add
	const [isEdit, setIsEdit] = useState<boolean>(false);

	const events = useSelector(selectMySchoolEvents);

	const pastEvents = events?.filter(event => isEventPast(event));

	const dispatch = useAppDispatch();
	// const getEvents = async () => {
	// 	setIsFetching(true);
	// 	setIsFetching(false);
	// }

	//when component render -> subscribe on updates
	useEffect(() => {	
		dispatch(startNewEventsListening());

		return () => {
			dispatch(stopNewEventsListening());
		}
	}, [])

	const toggleIsEdit = () => setIsEdit( (isEdit) => !isEdit);

	let eventsList: JSX.Element[] = [];
	let pastEventsList: JSX.Element[] | null = null;

	//if evets !== null and event have at least 1 element
	if(!!events && events.length > 0 && !!pastEvents) {
		const futureEvents = events.map(event => {
			if(pastEvents?.includes(event)) {
				console.log('includes event', event);
				return;
			}
			return event;
		}).filter(item => !!item); // check if item !== undefined

		console.log('sorted events', futureEvents);

		//set future events data to component[] for render
		futureEvents.forEach(eventData => {
			if(eventData) {
				eventsList.push(
					<Event data={eventData} key={eventData.id} />
				);
			}
		})

		//set components for list's bottom
		pastEventsList = pastEvents.map(eventData => (
			<Event data={eventData} key={eventData.id} isPast={true}/>
		));

		console.log('past events list', pastEventsList);
	}

	if(isFetching) return <Preloader fixed />

	return (
		<div className={classes.Events}>
			<div className={classes.header}>
				<h2 className={classes.title}>Події</h2>
				{ isAdmin && 
					<Button className={classes.addEventBtn} onClick={toggleIsEdit}>
						{isEdit ? 'Скасувати' : 'Нова подія'}
					</Button> 
				}
			</div>
			{isEdit && <NewEventForm onSave={() => setIsEdit(false)} />}
			<div className={classes.eventsList}>
				{eventsList || <div>Поки що подій немає</div>}
				{pastEventsList}
			</div>
		</div>
	)
}
