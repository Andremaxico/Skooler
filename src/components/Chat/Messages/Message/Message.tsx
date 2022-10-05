import { Avatar, Dropdown, Menu, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React from 'react'
import { MessageDataType } from '../../../../utils/types';
import classes from './Message.module.scss';
import { Link } from 'react-router-dom';
import { addZero } from '../../../../utils/helpers/formatters';
import { useInView } from 'react-intersection-observer';
import { useAppDispatch } from '../../../../Redux/store';
import { markMessageAsRead } from '../../../../Redux/chat/reducer';
import { DeleteMessageOption } from './DeleteMessageOption';

type PropsType = {
	messageData: MessageDataType,
	myAccountId: string,
	showDeleteConfirm: (messageId: string) => void,
};

const Message: React.FC<PropsType> = ({messageData, myAccountId, showDeleteConfirm}) => {
	//intersection observer hook
	const { ref: observerRef, inView, entry } = useInView({
		threshold: 0.7,
	});

	const dispatch = useAppDispatch();

	//if in view and weren't in view
	if(inView && !messageData.usersWhoRead.includes(myAccountId)) {
		dispatch(markMessageAsRead(messageData.id, myAccountId));
	}

	//check if my
	const isMy = messageData.uid === myAccountId;

	//@ts-ignore
	const createdAtMilisecs = messageData.createdAt ? messageData.createdAt.seconds * 1000 : new Date().getTime();
	const sendDate = new Date(createdAtMilisecs);
	//getTime() - щоб не показувалися неправильні дані при надісланні повіомлення
	const sendTime = `${addZero(sendDate.getHours())}:${addZero(sendDate.getMinutes())}`;

	//show this by (right button of mouse) click on message
	const contextMenu = (
		<Menu className={classes.contextMenu}
			items={[
				{
					label: 'Змінити',
					key: '1',
				},
				{
					label: 'Інформація',
					key: '3',
				},
				{
					label: 
						<DeleteMessageOption 
							className={classes.deleteMessage} 
							showDeleteConfirm={showDeleteConfirm} messageId={messageData.id}
						/>,
					key: '2',
				},
			]}
		/>
	 );

	return (
		<div className={`${classes.Message} ${isMy && classes._my}`} ref={observerRef}>
			<Link to={`/account/${!isMy ? messageData.uid : ''}`} replace={true}>
				<Avatar 
					src={messageData.photoUrl} size={40} icon={<UserOutlined />}
					className={classes.avatar}
				/>
			</Link>
			<Dropdown overlay={contextMenu} trigger={['contextMenu']}>
				<div className={classes.messageBody}>
					<h5 className={classes.username}>{messageData.displayName}</h5>
					<p className={classes.text}>{messageData.text}</p>
					<p className={classes.createDate}>{sendTime}</p>
				</div>
			</Dropdown>
		</div>
	)
}

export default Message