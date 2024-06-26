import React, { useEffect, useRef, useState } from 'react'
import { MessageDataType, UsersWhoReadMessageType } from '../../../../utils/types';
import classes from './Message.module.scss';
import { Link } from 'react-router-dom';
import { addZero } from '../../../../utils/helpers/formatters';
import { useInView } from 'react-intersection-observer';
import { useAppDispatch } from '../../../../Redux/store';
import { markMessageAsRead } from '../../../../Redux/chat/reducer';
import { DeleteMessageOption } from './MessageOptions/DeleteMessageOption';
import { EditMessageDataType } from '../../Chat';
import ListSubheader from '@mui/material/ListSubheader';
import PopupState, { bindTrigger, bindMenu, Props, bindPopover } from 'material-ui-popup-state';
import { Popover } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import cn from 'classnames';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { selectErrorsWithSendingMessages } from '../../../../Redux/chat/selectors';
import { useSelector } from 'react-redux';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

type PropsType = {
	messageData: MessageDataType,
	myAccountId: string,
	contactId: string,
	isShort: boolean,
	showDeleteConfirm: (messageId: string) => void,
	setEditMessageData: (data: EditMessageDataType) => void,
	openInfoModal: (usersWHoRead: UsersWhoReadMessageType) => void,
};

const Message = React.forwardRef<HTMLDivElement, PropsType>(({
	messageData, myAccountId, showDeleteConfirm, setEditMessageData, openInfoModal, isShort, contactId
}, ref) => {
	const { text, photoUrl, uid, id, usersWhoRead, createdAt, displayName, sent, edited, isRead} = messageData;

	const errorsWithSendingMessages = useSelector(selectErrorsWithSendingMessages);
	const isErrorWithSending = errorsWithSendingMessages.filter(messageId => messageId === id).length > 0;

	const menuRef = useRef<HTMLDivElement>(null);
	
	//check if my
	const isMy = uid === myAccountId;

	//intersection observer hook
	const { ref: observerRef, inView, entry } = useInView({
		threshold: 0.7,
	});   

	const dispatch = useAppDispatch();

	//if in view and weren't in view
	if(inView && !usersWhoRead.includes(myAccountId) && !isRead  && !isMy) {
		console.log('mark message as read');   
		dispatch(markMessageAsRead(id, myAccountId, contactId));
		dispatch(markMessageAsRead(id, contactId, myAccountId));
	}

	//@ts-ignore
	const createdAtMilisecs = createdAt?.seconds * 1000;
	const sendDate = new Date(createdAtMilisecs || new Date().getTime());
	//getTime() - щоб не показувалися неправильні дані при надісланні повіомлення
	const sendTime = `${addZero(sendDate.getHours())}:${addZero(sendDate.getMinutes())}`;

	return (
		<div className={`${classes.Message} ${isMy && classes._my}`} ref={observerRef}>
			{/* {!isShort && !isMy && <Link to={`/account/${!isMy ? uid : ''}`} replace={true}>
				<ListSubheader>	
					<Avatar 
						src={photoUrl} size={40} icon={<UserOutlined />}
						className={classes.avatar}
					/>
			</Link>} */}
			<PopupState variant="popover" popupId="message-context">
				{ (popupState) => (
					<>
					<div {...bindTrigger(popupState)} className={classes.messageBody} ref={ref}>
						{!isShort && !isMy && <h5 className={classes.username}>{displayName}</h5>}
						<p className={classes.text}>{text}</p>
						<div className={classes.info}>
							{edited && <p className={classes.edited}>Змінено</p>}

							<p className={classes.createDate}>{sendTime}</p>

							{isMy && <p className={classes.receivedStatus}>
								{ isErrorWithSending ?
									<button className={classes.sendingErrorBtn}>
										<ErrorOutlineIcon className={classes.icon} color='error'/>
									</button>
									: isRead 
									? <DoneAllOutlinedIcon className={classes.icon} /> 
									: sent 
									? <DoneOutlinedIcon className={classes.icon} /> 
									: <AccessTimeIcon className={classes.icon} />}
							</p>}
						</div>
					</div>
					<Popover
						{...bindPopover(popupState)}

						onClick={(e: React.MouseEvent) =>{
							const target = e.target as Element;
							const isClickedOnMenu = target === menuRef.current;
					
							if(!isClickedOnMenu) {
								popupState.close();
							}
						}}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'center',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'center',
						}}
					>
						<Menu {...bindMenu(popupState)} ref={menuRef} className={classes.contextMenu}>
							{isMy && 
								<>
									<MenuItem onClick={() => {
										setEditMessageData({value: text, id})
									}} className={classes.menuItem}>Редагувати</MenuItem>
								</>
							}
							<MenuItem onClick={() => {
								openInfoModal(usersWhoRead)
							}} className={classes.menuItem}>Інформація</MenuItem>

							{isMy && 
								<MenuItem className={classes.deleteBtn}>
									<DeleteMessageOption 
										className={cn(classes.deleteMessage, classes.menuItem)} 
										showDeleteConfirm={showDeleteConfirm} 
										messageId={messageData.id}
									/>
								</MenuItem>
							}
						</Menu>
					</Popover>
					</>
				)}
			</PopupState>
		</div>
	)
});

export default Message