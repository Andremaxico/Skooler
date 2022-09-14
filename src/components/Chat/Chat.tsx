import React, { useContext, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Navigate } from 'react-router-dom';
import { FirebaseContext } from '../..';
import Messages from './Messages';
import classes from './Chat.module.scss';
import { NewMessageForm } from './NewMessageForm';
import { Auth } from 'firebase/auth';
import { MessageDataType } from '../../utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { selectMessages } from '../../Redux/chat/selectors';
import { startMessaging, stopMessaging } from '../../Redux/chat/reducer';
import { AnyAction } from 'redux';


const Chat = () => {
	const { auth } = useContext(FirebaseContext);
	const [authData] = useAuthState(auth as Auth);

	const messages = useSelector(selectMessages);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(startMessaging() as unknown as AnyAction);

		return () => {
			stopMessaging();
		}
	}, []);


	if(!authData) return <Navigate to='/login' replace={true}/>	

	return (
		<div className={classes.Chat}>
			<Messages messagesData={messages}/>
			<NewMessageForm authData={authData} />
		</div>
	)
}

export default Chat