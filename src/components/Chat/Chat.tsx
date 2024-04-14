import { MouseEvent, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Messages from './Messages';
import classes from './Chat.module.scss';
import { NewMessageForm } from './NewMessageForm';
import { useSelector } from 'react-redux';
import { selectCurrChatData, selectIsMessagesFetching, selectMessages } from '../../Redux/chat/selectors';
import { contactDataReceived, editMessage, setContactData, startMessaging, stopMessaging, subscribeOnChat, subscribeOnGeneralChat, unsubscribeFromChat } from '../../Redux/chat/reducer';
import Preloader from '../../UI/Preloader';
import { useAppDispatch } from '../../Redux/store';
import { ScrollBtn } from '../../UI/ScrollBtn';
import { selectMyAccountData, selectMyLoginData } from '../../Redux/account/account-selectors';
import { OtherChats } from './OtherChats';
import { selectFooterHeight, selectHeaderHeight } from '../../Redux/app/appSelectors';
import { BASE_PAGE_PADDING, GENERAL_CHAT_ID } from '../../utils/constants';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import cn from 'classnames';

export type EditMessageDataType = {
	value: string,
	id: string,
}

const Chat = () => {
	const myAccountData = useSelector(selectMyAccountData);
	const authData = useSelector(selectMyLoginData);
	const chatData = useSelector(selectCurrChatData); 
	const footerHeight = useSelector(selectFooterHeight);
	const headerHeight = useSelector(selectHeaderHeight);

	//is existing messages now editing
	const [unreadMessagesCount, setUnreadMessagesCount] = useState<number | null>(null);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [editMessageData, setEditMessageData] = useState<EditMessageDataType | null>(null);
	const [bodyHeight, setBodyHeight] = useState<string>('auto');
	const [newMessageFormHeight, setNewMessageFormHeight] = useState<number>(0);
	const [isChatsShow, setIsChatsShow] = useState<boolean>(false); // when screen <768px


	const params = useParams();
	const navigate = useNavigate();

	const contactUid = params.userId;


	//fucking kostyl
	if(contactUid === authData?.uid) navigate('/', {replace: true});

	//messages list ref
	const scrollBtnRef = useRef<HTMLButtonElement>(null);
	const chatRef = useRef<HTMLDivElement>(null);
	const newMessageFormRef = useRef<HTMLDivElement>(null);
	const openChatsBtnRef = useRef<HTMLButtonElement>(null);

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

	const changeEditMessageData = (data: EditMessageDataType) => {
		setEditMessageData(data);
		setIsEdit(true);
		console.log('set edit message data', data);
	}

	//event handlers
	const handleOtherChatsBtnClick = (e: MouseEvent<HTMLButtonElement>) => {
		setIsChatsShow(!isChatsShow);
		console.log('btn clicked');
	}

	const handleOtherChatsWrapClick = (e: MouseEvent) => {
		console.log('classname', openChatsBtnRef.current?.className);
		const target = (e.target as HTMLElement).closest(`.${openChatsBtnRef.current?.className}`);
		const btn = openChatsBtnRef.current;
		console.log('elements', target, btn);
		//btn in chats block
		if(target !== btn) {
			setIsChatsShow(false);
		}
	}
	//set body height
	//= 100vh - container's padding - footerH - headerH
	useEffect(() => {
		console.log('new message for height', newMessageFormHeight);
		const value = `calc(100vh - ${(footerHeight || 0) + (headerHeight || 0) + BASE_PAGE_PADDING * 2 + newMessageFormHeight}px)`;

		setBodyHeight(value);
		console.log('body height value', value);
	}, [footerHeight, headerHeight, newMessageFormHeight]);

	//set unread messages count from chat data
	useEffect(() => {
		const unreadCount = chatData?.unreadCount;

		setUnreadMessagesCount(unreadCount || null);
	}, [chatData]);

	//set contact data for current chat
	useEffect(() => {
		if(contactUid && contactUid !== GENERAL_CHAT_ID) {
			console.log('set contact data');
			dispatch(setContactData(contactUid));
		}

		return () => {
			dispatch(contactDataReceived(null));
		}
	}, [contactUid]);	

	//set newMessageFormHeihgt for paddings(UI)
	useEffect(() => {
		const el = newMessageFormRef.current;
		if(el) {
			setNewMessageFormHeight(el.offsetHeight);
		}
	}, [newMessageFormRef.current])
	
	if(!authData) return <Navigate to='/login' replace={true}/>	
	if(!myAccountData) return <Preloader fixed/>	

	return (
		<div className={classes.Chat} ref={chatRef}>
			<div className={cn(classes.otherChatsWrap, isChatsShow ? classes._show : '')}
				onClick={handleOtherChatsWrapClick}
			>
				<button className={cn(classes.openOtherChatsBtn, isChatsShow ? classes._opened : '')}
					onClick={handleOtherChatsBtnClick}
					ref={openChatsBtnRef}
				>
					<ArrowForwardIosIcon className={classes.icon} />
				</button>
				<OtherChats 
					openedChatId={contactUid}
				/>
			</div>

			<div className={classes.body}
				style={{
					height: bodyHeight,
				}}
			>
				{contactUid ? 
					<Messages 
						ref={scrollBtnRef} 
						unreadMessagesCount={unreadMessagesCount || 0}
						newMessageFormHeight={newMessageFormHeight}
						setEditMessageData={changeEditMessageData}
						cancelEdit={cancelEdit}
						contactUid={contactUid}
					/>
					: <div>Немає повідомлень</div>
				}
				<div 
					className={classes.newMessageFormWrap}
					ref={newMessageFormRef}
					style={{
						transform: `translateY(${newMessageFormHeight}px)`
					}}
				>
					<NewMessageForm   
						contactUid={contactUid || ''}
						myId={myAccountData.uid} 
						ScrollBtn={scrollBtnRef.current} 
						isMessageEdit={isEdit} 
						updateMessage={sendUpdatedMessage} 
						currValue={editMessageData?.value}
					/>
				</div>
			</div>
		</div>
	)
}

export default Chat