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
import { selectIsMessagesFetching, selectMessages } from '../../Redux/chat/selectors';
import { editMessage, startMessaging, stopMessaging } from '../../Redux/chat/reducer';
import { AnyAction } from 'redux';
import Preloader from '../../UI/Preloader';
import { useAppDispatch } from '../../Redux/store';
import { ScrollBtn } from '../../UI/ScrollBtn';
import { selectMyAccountData, selectMyLoginData } from '../../Redux/account/account-selectors';

export type EditMessageDataType = {
	value: string,
	id: string,
}

const Chat = () => {
	const messagesData = useSelector(selectMessages);
	const myAccountData = useSelector(selectMyAccountData);
	const authData = useSelector(selectMyLoginData);
	const isFetching = useSelector(selectIsMessagesFetching);

	//is existing messages now editing
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [editMessageData, setEditMessageData] = useState<EditMessageDataType | null>(null);
	const [unreadMessagesCount, setUnreadMessagesCount] = useState<number | null>(null);

	const params = useParams();
	const navigate = useNavigate();

	const uid2 = params.userId || '';

	//fucking kostyl
	if(uid2 === authData?.uid) navigate('/', {replace: true});

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
		if(editMessageData?.id && myAccountData?.uid) {
			cancelEdit();
			dispatch(editMessage(editMessageData.id, value, myAccountData.uid, uid2));
		}
	}

	useEffect(() => {
		dispatch(startMessaging(uid2));
		return () => {
			dispatch(stopMessaging());
		}
	}, [myAccountData?.uid]);

	//set unread messages count
	useEffect(() => {
		const unreadCount = messagesData?.filter((data: MessageDataType) => !data.isRead && data.uid !== myAccountData?.uid).length;

		setUnreadMessagesCount(unreadCount || null);

		console.log('unread count', unreadCount);
	}, [messagesData?.length])

	console.log('messages data', messagesData);

	if(isFetching || messagesData?.length === 0) return <Preloader fixed={true} />;
	console.log('message sdata', messagesData, 'myAccountdata', myAccountData);
	if(!authData) return <Navigate to='/login' replace={true}/>	

	return (
		<div className={classes.Chat} ref={chatRef}>
			{messagesData !== null ? 
				<Messages 
					ref={scrollBtnRef} 
					contactId={uid2}
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
				uid2={uid2}
				authData={authData} 
				ScrollBtn={scrollBtnRef.current} 
				isMessageEdit={isEdit} 
				updateMessage={sendUpdatedMessage} 
				currValue={editMessageData?.value}
			/>
		</div>
	)
}

export default Chat