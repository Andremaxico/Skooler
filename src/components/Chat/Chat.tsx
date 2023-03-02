import React, { useContext, useEffect, useRef, useState } from 'react'
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
import { editMessage, startMessaging, stopMessaging } from '../../Redux/chat/reducer';
import { AnyAction } from 'redux';
import Preloader from '../../UI/Preloader';
import { useAppDispatch } from '../../Redux/store';

export type EditMessageDataType = {
	value: string,
	id: string,
}

const Chat = () => {
	const { auth } = useContext(FirebaseContext);
	const [authData] = useAuthState(auth as Auth);

	const messagesData = useSelector(selectMessages);

	//is exists messages now editing
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [editMessageData, setEditMessageData] = useState<EditMessageDataType | undefined>(undefined);


	//messages list ref
	const scrollBtnRef = useRef<HTMLButtonElement>(null);
	console.log('edit message data', editMessageData);

	const dispatch = useAppDispatch();

	const sendUpdatedMessage = (value: string) => {
		if(editMessageData?.id) {
			setIsEdit(false);
			setEditMessageData(undefined);
			dispatch(editMessage(editMessageData.id, value));
		}
	}

	useEffect(() => {
		dispatch(startMessaging());
	}, []);


	if(!authData) return <Navigate to='/login' replace={true}/>	

	console.log('edit messag data', editMessageData);

	return (
		<div className={classes.Chat}>
			{messagesData ? 
				<Messages 
					ref={scrollBtnRef} 
					messagesData={messagesData}
					setEditMessageData={(data: EditMessageDataType) => {
						setEditMessageData(data);
						setIsEdit(true);
						console.log('set edit message data', data);
					}
				}/>
				: <div>Немає повідомлень</div>
			}
			<NewMessageForm 
				authData={authData} scrollBottomBtn={scrollBtnRef.current} isMessageEdit={isEdit} 
				updateMessage={sendUpdatedMessage} currValue={editMessageData?.value}
			/>
		</div>
	)
}

export default Chat