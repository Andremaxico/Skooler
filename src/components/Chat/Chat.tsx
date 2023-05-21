import React, { useContext, useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { FirebaseContext } from '../..';
import Messages from './Messages';
import classes from './Chat.module.scss';
import { NewMessageForm } from './NewMessageForm';
import { Auth } from 'firebase/auth';
import { MessageDataType } from '../../utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrChatData, selectIsMessagesFetching, selectMessages } from '../../Redux/chat/selectors';
import { contactDataReceived, editMessage, setContactData, startMessaging, stopMessaging, subscribeOnChat, unsubscribeFromChat } from '../../Redux/chat/reducer';
import { AnyAction } from 'redux';
import Preloader from '../../UI/Preloader';
import { useAppDispatch } from '../../Redux/store';
import { ScrollBtn } from '../../UI/ScrollBtn';
import { selectMyAccountData, selectMyLoginData } from '../../Redux/account/account-selectors';
import { useSelect } from '@mui/base';

export type EditMessageDataType = {
	value: string,
	id: string,
}

const Chat = () => {
	const messagesData = useSelector(selectMessages);
	const myAccountData = useSelector(selectMyAccountData);
	const authData = useSelector(selectMyLoginData);
	const isFetching = useSelector(selectIsMessagesFetching);
	const chatData = useSelector(selectCurrChatData); 

	//is existing messages now editing
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [editMessageData, setEditMessageData] = useState<EditMessageDataType | null>(null);
	const [unreadMessagesCount, setUnreadMessagesCount] = useState<number | null>(null);

	const params = useParams();
	const navigate = useNavigate();

	const contactUid = params.userId;

	//fucking kostyl
	if(contactUid === authData?.uid) navigate('/', {replace: true});

	//messages list ref
	const scrollBtnRef = useRef<HTMLButtonElement>(null);
	const chatRef = useRef<HTMLDivElement>(null);
	console.log('edit message data', editMessageData);

	const dispatch = useAppDispatch();

	//subscribe on chat data
	useEffect(() => {
		console.log('subscribe on chat changes');
		if(myAccountData && contactUid) {
			dispatch(subscribeOnChat(myAccountData.uid, contactUid));
		}
		return () => {
			dispatch(unsubscribeFromChat());
		}

	}, [myAccountData, contactUid]);
	
	//cancel changes
	const cancelEdit = () => {
		setIsEdit(false);
		setEditMessageData(null);
	}

	//update message
	const sendUpdatedMessage = (value: string) => {
		if(editMessageData && myAccountData && contactUid) {
			cancelEdit();
			dispatch(editMessage(editMessageData.id, value, myAccountData.uid, contactUid));
		}
	}

	//start messaging
	useEffect(() => {
		if(contactUid) {
			dispatch(startMessaging(contactUid));
		}
		return () => {
			dispatch(stopMessaging());
		}
	}, [myAccountData?.uid]);

	//set unread messages count
	useEffect(() => {
		const unreadCount = chatData?.unreadCount;

		console.log('new unread count', unreadCount);

		setUnreadMessagesCount(unreadCount || null);
	}, [chatData]);

	//set contact data
	useEffect(() => {
		if(contactUid) {
			console.log('set contact data');
			dispatch(setContactData(contactUid));
		}

		return () => {
			dispatch(contactDataReceived(null));
		}
	}, [contactUid]);	


	if(isFetching || messagesData?.length === 0) return <Preloader fixed={true} />;
	
	if(!authData) return <Navigate to='/login' replace={true}/>	

	return (
		<div className={classes.Chat} ref={chatRef}>
			{messagesData !== null ? 
				<Messages 
					ref={scrollBtnRef} 
					contactId={contactUid || ''}
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
				<ScrollBtn 
					element={chatRef.current} 
					ref={scrollBtnRef} 
					unreadCount={unreadMessagesCount || undefined} 
				/>
			}
			<NewMessageForm   
				contactUid={contactUid || ''}
				authData={authData} 
				ScrollBtn={scrollBtnRef.current} 
				isMessageEdit={isEdit} 
				updateMessage={sendUpdatedMessage} 
				currValue={editMessageData?.value}
				unreadCount={unreadMessagesCount || 0}
			/>
		</div>
	)
}

export default Chat