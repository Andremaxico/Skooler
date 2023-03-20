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
import { ScrollBottomBtn } from '../../UI/ScrollBottomBtn';
import { selectMyAccountData } from '../../Redux/account/account-selectors';

export type EditMessageDataType = {
	value: string,
	id: string,
}

const Chat = () => {
	const { auth } = useContext(FirebaseContext);
	const [authData] = useAuthState(auth as Auth);

	const messagesData = useSelector(selectMessages);
	const myAccountData = useSelector(selectMyAccountData);

	//is exists messages now editing
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [editMessageData, setEditMessageData] = useState<EditMessageDataType | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [unreadMessagesCount, setUnreadMessagesCount] = useState<number | null>(null);

	//messages list ref
	const scrollBtnRef = useRef<HTMLButtonElement>(null);
	const chatRef = useRef<HTMLDivElement>(null);
	console.log('edit message data', editMessageData);

	const dispatch = useAppDispatch();

	//update message
	const cancelEdit = () => {
		setIsEdit(false);
		setEditMessageData(null);
	}

	const sendUpdatedMessage = (value: string) => {
		if(editMessageData?.id) {
			cancelEdit();
			dispatch(editMessage(editMessageData.id, value));
		}
	}

	useEffect(() => {
		dispatch(startMessaging());
	}, []);

	//set unread messages count
	useEffect(() => {
		const unreadCount = messagesData?.filter((data: MessageDataType) => {
			if(data.usersWhoRead) {
				return !data.usersWhoRead.includes(myAccountData?.uid || null)
			}
			return false;
		}).length;

		setUnreadMessagesCount(unreadCount || null);

		console.log('unread count', unreadCount);
	}, [messagesData?.length])

	if(isLoading && !messagesData) return <Preloader />;
	if(!authData) return <Navigate to='/login' replace={true}/>	

	return (
		<div className={classes.Chat} ref={chatRef}>
			{messagesData ? 
				<Messages 
					ref={scrollBtnRef} 
					messagesData={messagesData}
					setEditMessageData={(data: EditMessageDataType) => {
						setEditMessageData(data);
						setIsEdit(true);
						console.log('set edit message data', data);
					}
				}
					cancelEdit={cancelEdit}
				/>
				: <div>Немає повідомлень</div>
			}
			{chatRef.current && 
				<ScrollBottomBtn 
					element={chatRef.current} 
					ref={scrollBtnRef} 
					unreadCount={unreadMessagesCount || 0} 
				/>
			}
			<NewMessageForm 
				authData={authData} 
				scrollBottomBtn={scrollBtnRef.current} 
				isMessageEdit={isEdit} 
				updateMessage={sendUpdatedMessage} 
				currValue={editMessageData?.value}
			/>
		</div>
	)
}

export default Chat