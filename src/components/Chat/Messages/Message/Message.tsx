import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useContext } from 'react'
import { MessageDataType } from '../../../../utils/types';
import classes from './Message.module.scss';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../../../..';
import { Auth } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { getDatabase } from 'firebase/database';
import { addZero } from '../../../../utils/helpers/formatters';

type PropsType = {
	messageData: MessageDataType,
	myAccountId: string,
};

const Message: React.FC<PropsType> = ({messageData, myAccountId}) => {
	const isMy = messageData.uid === myAccountId;

	//@ts-ignore
	const createdAtMilisecs = messageData.createdAt ? messageData.createdAt.seconds * 1000 : new Date().getTime();
	const sendDate = new Date(createdAtMilisecs);
	//getTime() - щоб не показувалися неправильні дані при надісланні повіомлення
	const sendTime = `${addZero(sendDate.getHours())}:${addZero(sendDate.getMinutes())}`;

	return (
		<div className={`${classes.Message} ${isMy && classes._my}`}>
			<Link to={`/account/${!isMy ? messageData.uid : ''}`} replace={true}>
				<Avatar 
					src={messageData.photoUrl} size={40} icon={<UserOutlined />}
					className={classes.avatar}
				/>
			</Link>
			<div className={classes.messageBody}>
				<h5 className={classes.username}>{messageData.displayName}</h5>
				<p className={classes.text}>{messageData.text}</p>
				<p className={classes.createDate}>{sendTime}</p>
			</div>
		</div>
	)
}

export default Message