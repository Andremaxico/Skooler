import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useContext } from 'react'
import { MessageDataType } from '../../../../utils/types';
import classes from './Message.module.scss';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../../../..';
import { Auth } from 'firebase/auth';

type PropsType = {
	messageData: MessageDataType,
	myAccountId: string,
};

const Message: React.FC<PropsType> = ({messageData, myAccountId}) => {
	const isMy = messageData.uid === myAccountId;

	return (
		<div className={`${classes.Message} ${isMy && classes._my}`}>
			<Avatar 
				src={messageData.photoUrl} size={40} icon={<UserOutlined />}
				className={classes.avatar}
			/>
			<div className={classes.messageBody}>
				<h5 className={classes.username}>{messageData.displayName}</h5>
				<p className={classes.text}>{messageData.text}</p>
			</div>
		</div>
	)
}

export default Message