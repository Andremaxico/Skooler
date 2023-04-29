import React from 'react';
import classes from './ChatCards.module.scss';
import { ChatDataType } from '../../../utils/types';
import { Avatar } from '@mui/joy';

type PropsType = {
	data: ChatDataType
};

export const ChatCard: React.FC<PropsType> = ({data}) => {
	const { 
		contactAvatarUrl, contactFullname, contactId, 
		lastMessageData, lastMessageTime 
	} = data;

	return (
		<div className={classes.ChatCard}>
			<div className={classes.avatar}>
				<Avatar src={contactAvatarUrl} />
			</div>
			<div className={classes.body}>
				<div className={classes.top}>
					<div className={classes.contactName}>{contactFullname}</div>
					<div className={classes.lastMessageTime}>{lastMessageTime}</div>
				</div>
				<div className={classes.lastMessage}>
					<div className={classes.senderName}>
						{lastMessageData.displayName === contactFullname ? contactFullname : 'Me'}:
					</div>
					<p className={classes.text}>{lastMessageData.text}</p>
					<span className={classes.newMessagesCount}></span>
				</div>
			</div>
		</div>
	)
}
