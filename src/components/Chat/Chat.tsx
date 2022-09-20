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
import Preloader from '../../UI/Preloader';
import { useAppDispatch } from '../../Redux/store';


const Chat = () => {
	const { auth } = useContext(FirebaseContext);
	const [authData] = useAuthState(auth as Auth);

	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(startMessaging());
	}, []);


	if(!authData) return <Navigate to='/login' replace={true}/>	

	return (
		<div className={classes.Chat}>
			<Messages />
			<NewMessageForm authData={authData} />
		</div>
	)
}

export default Chat