import React from 'react';
import classes from './ChatCard.module.scss';
import { ChatDataType } from '../../../utils/types';
import { Avatar } from '@mui/joy';
import { getStringDate } from '../../../utils/helpers/getStringDate';

type PropsType = {
	data: ChatDataType
};

const getMessageTime = (date: Date): string => {
	const currDate = new Date();
	const currTime = currDate.getTime();
	const messageTime = date.getTime();

	const diff = currTime - messageTime;
	const minutesDiff = Math.floor(diff / 1000 / 60);
	const hoursDiff = Math.floor(minutesDiff);
	const timeDiff =  hoursDiff ;

	console.log('hoursDiff', timeDiff);

	const isToday = currDate.getHours() - hoursDiff > 0;

	console.log('is today', isToday);

	const day = 1000 * 60 * 60* 24;  
	const week = day * 7;

	if(isToday) {
		//show time
		const result = `${date.getHours()}:${date.getMinutes()}`;
		return result;
	} else if(!isToday && diff < 2 * day) {
		//show "yesterday"
		return 'Вчора';
	} else if(diff > day && diff <= (week - day)) {
		//show day of the week
		const days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота', 'Неділя'];
		const day = days[date.getDay()];

		return day;
	} else {
		return getStringDate(messageTime);
	}
}

export const ChatCard: React.FC<PropsType> = ({data}) => {
	const { 
		contactAvatarUrl, contactFullname, contactId, 
		lastMessageData, lastMessageTime 
	} = data;

	//@ts-ignore
	const date = lastMessageTime.seconds ? new Date(lastMessageTime.seconds * 1000) : new Date();

	const stringDate = getMessageTime(date);

	return (
		<div className={classes.ChatCard}>
			<Avatar src={contactAvatarUrl} className={classes.avatar}/>
			<div className={classes.body}>
				<div className={classes.top}>
					<div className={classes.contactName}>{contactFullname}</div>
					<div className={classes.lastMessageTime}>{stringDate}</div>
				</div>
				<div className={classes.lastMessage}>
					<div className={classes.senderName}>
						{lastMessageData.displayName === contactFullname ? contactFullname : 'Я'}:
					</div>
					<p className={classes.text}>{lastMessageData.text}fgdgdgdhg ndfsuy gifudguysdfogydfyigiunvfbygvniofsguyn</p>
					<span className={classes.newMessagesCount}>0</span>
				</div>
			</div>
		</div>
	)
}
