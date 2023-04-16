import { ClockCircleOutlined } from '@ant-design/icons';
import React from 'react'
import { getNumberOfDays } from '../../../../utils/helpers/getNumberOfDays';
import { EventDataType } from '../../../../utils/types'
import classes from './Event.module.scss';

type PropsType = {
	data: EventDataType,
	isPast?: boolean,
}

export const Event: React.FC<PropsType> = ({data, isPast}) => {
	let eventDateString: string = '';
	let isTarget: boolean = false; 
	let isToday: boolean = false;

	if(data.date) {
		//@ts-ignore
		const eventDate = new Date(data.date.seconds * 1000);

		//targetDate - currDate = number of days
		const daysToDate = getNumberOfDays(
			eventDate.getTime(), new Date().getTime()
		);
		if(!isPast) {
			//is event today
			isToday = daysToDate > -1 && daysToDate < 0;

			//is event start tomorrow
			isTarget = daysToDate == -1 || isToday ;

			//dd-mm-yyyy
			eventDateString = 
				isToday ? 'Сьогодні' :
				isTarget ? 'Завтра' : 
				daysToDate == -2 ? 'Післязавтра' :  
				eventDate.toLocaleDateString();
		}
	}

	return (
		<div className={
			`${classes.Event} ${isTarget ? classes._target : ''}
			 ${isPast ? classes._past : ''} ${isToday ? classes._today : ''}`
		}>
			<div className={classes.top}>
				<h3 className={classes.title}>{data.title}</h3>
				<span className={classes.leading}>{data.leading}</span>
				<div className={classes.date}>
					<ClockCircleOutlined className={classes.icon}/>
					{eventDateString}
				</div>
			</div>
			<p className={classes.about}>
				{
					data.about 
				|| 
					<span className={classes.placeholderText}>Немає додаткової інформації</span>
				}
			</p>
		</div>
	)
}
