import React, { useEffect, useRef, useState } from 'react';
import classes from './ChatCard.module.scss';
import { ChatDataType } from '../../utils/types';
import { Avatar, useTheme } from '@mui/joy';
import { getStringDate } from '../../utils/helpers/date/getStringDate';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { getMessageTime } from '../../utils/helpers/date/getMessageTime';
import { checkUnreadCount } from '../../utils/helpers/checkUnreadCount';

type PropsType = {
	data: ChatDataType,
	active?: boolean
};

export const ChatCard: React.FC<PropsType> = ({data, active = false}) => {
	const { 
		contactAvatarUrl, contactFullname, contactId, 
		lastMessageData, lastMessageTime, unreadCount
	} = data;

	const [isCut, setIsCut] = useState<boolean>(false);
	const [widthForText, setWidthForText] = useState<number | undefined>(undefined);

	const textRef = useRef<HTMLParagraphElement>(null);
	const lastMessageRef = useRef<HTMLDivElement>(null);
	const counterRef = useRef<HTMLSpanElement>(null);
	const senderNameRef = useRef<HTMLParagraphElement>(null);

	//when refs setted -> set maxWidth for text
	useEffect(() => {
		if(lastMessageRef.current && counterRef.current && senderNameRef.current) {
			const width = lastMessageRef.current.offsetWidth - counterRef.current.offsetWidth - senderNameRef.current.offsetWidth;
			console.log('width', width);
			setWidthForText(width);
		}
	}, [lastMessageRef.current, counterRef.current, senderNameRef.current]);

	//width for text setted -> set isCut
	useEffect(() => {
		if(widthForText && textRef.current) {
			const value = textRef.current.offsetWidth > widthForText;
			setIsCut(value);  
		}
	}, [widthForText, textRef.current]);

	const theme = useTheme();
	//@ts-ignore
	const date = lastMessageTime?.seconds ? new Date(lastMessageTime.seconds * 1000) : new Date();

	const stringDate = getMessageTime(date);

	console.log('unread count', unreadCount, (unreadCount || 0) > 0);

	console.log('is cut', isCut);  
	return (
		<Link to={`/chat/${contactId}`} className={cn(active ? classes._active: '',  classes.ChatCard)}>
			<Avatar src={contactAvatarUrl} className={classes.avatar}/>
			<div className={classes.body}>
				<div className={classes.top}>
					<div className={classes.contactName}>{contactFullname}</div>
					<div className={classes.lastMessageTime}  >{stringDate}</div>
				</div>
				<div className={classes.lastMessage} ref={lastMessageRef}>
					{/* <p className={classes.senderName} ref={senderNameRef}>
						{lastMessageData.displayName === contactFullname ? contactFullname : 'Я'}:
					</p> */}
					<p className={classes.text} ref={textRef} style={{maxWidth: `${widthForText}px`}}>
						{lastMessageData.text}
						{isCut && <span className={classes.ending}>...</span>}
					</p>
					<span 
						className={cn(classes.newMessagesCount, checkUnreadCount(unreadCount) ? classes.styled : '')} 
						ref={counterRef}
					>
						{checkUnreadCount(unreadCount) ? unreadCount : ''}
					</span>
				</div>
			</div>
		</Link>
	)
}
