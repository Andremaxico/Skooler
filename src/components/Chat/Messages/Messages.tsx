import { FieldValue } from 'firebase/firestore';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { renderToStaticMarkup } from "react-dom/server"
import { selectMyAccountData, selectMyLoginData } from '../../../Redux/account/account-selectors';
import { selectCurrMessageWhoReadList, selectIsMessagesFetching, selectMessages } from '../../../Redux/chat/selectors'; 
import Preloader from '../../../UI/Preloader';
import { ScrollBottomBtn } from '../../../UI/ScrollBottomBtn';
import { MessageDataType, MessagesDataType, ReceivedAccountDataType, UsersWhoReadMessageType } from '../../../utils/types';
import Message from './Message';
import classes from './Messages.module.scss';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import confirm from 'antd/lib/modal/confirm';
import { useAppDispatch } from '../../../Redux/store';
import { deleteMessage, setCurrMessageWhoReadList } from '../../../Redux/chat/reducer';
import { EditMessageDataType } from '../Chat';
import { Avatar, message, Modal } from 'antd';
import { ReadMessageUser } from '../../../UI/ReadMessageUser';
import ListSubheader from '@mui/material/ListSubheader';
import { Link } from 'react-router-dom';
import { MessagesGroup } from './MessagesGroup';

type PropsType = {
	setEditMessageData: (data: EditMessageDataType) => void, 
	messagesData: MessageDataType[],
	//ref: React.RefObject<HTMLButtonElement>,
}

type FormattedMessagesType = {[key: string]: MessageDataType[]};
export type MessagesGroupMetadataType = {
	isMy: boolean,
	avatarData?: {
		photoUrl: string | null | undefined,
		uid: string,
	}
}

type MessagesGroupType = {
	messages: JSX.Element[],
	metadata: MessagesGroupMetadataType,
}

const Messages = React.forwardRef<HTMLButtonElement, PropsType>(({setEditMessageData, messagesData}, ref) => {
	const isFetching = useSelector(selectIsMessagesFetching);
	const myAccountData = useSelector(selectMyAccountData);
	const usersWhoReadCurrMessageData = useSelector(selectCurrMessageWhoReadList);

	const [usersWhoReadCurrMessage, setUsersWhoReadCurrMessage] = useState<UsersWhoReadMessageType | null>(null);
	const [isUsersFetching, setIsUsersFetching] = useState<boolean>(false);
	const [messagesList, setMessagesList] = useState<JSX.Element[] | null>(null);
	const [prevMessagesData, setPrevMessagesData] = useState<MessagesDataType>(messagesData);
	const [myMessages, setMyMessages] = useState<JSX.Element[]>([]);

	const listRef = useRef<HTMLDivElement>(null);
	const myMessageRef = useRef<HTMLDivElement>(null);

	const dispatch = useAppDispatch();

	//show delete message modal
	const showDeleteConfirm = (messageId: string) => {
		confirm({
			title: 'Видалити повідомлення',
			icon: <ExclamationCircleOutlined />,
			content: 'Ви дійсно хочете видалити це повдомлення?',
			okText: 'Видалити',
			okType: 'danger',
			cancelText: 'Скасувати',
			onOk() {
				dispatch(deleteMessage(messageId));
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	};

	//sorting messages on groups by create date
	const sortedMessages: FormattedMessagesType = {};
	//on scroll listener
	// useEffect(() => {
	// 	const handleScroll = () => {
	// 		console.log('onscroll');     
	// 	}
	// 	listRef.current?.addEventListener('scroll', handleScroll);

	// 	return () => {
	// 		listRef.current?.removeEventListener('scroll', handleScroll);
	// 	}
	// }, []);

	//get unread messages count
	const unreadCount = messagesData?.filter((data: MessageDataType) => {
		if(data.usersWhoRead) {
			return !data.usersWhoRead.includes(myAccountData?.uid || null)
		}
		return false;
	}).length;

	//sorting messages in groups writed by 1 user in row
	useEffect(() => {
		if(myMessageRef.current) {
			myMessageRef.current.scrollIntoView({
				behavior: 'auto',
			})
		}
	}, [myMessageRef.current]);

	//sorted messages data -> messagesList
	useEffect(() => {
		//set messages list
		let messages: JSX.Element[] = []; // messages list

			
		//here we sort messages in groups with keys - dates
		messagesData.forEach((messageData: MessageDataType) => {
			//@ts-ignore
			const createMilisecs = messageData.createdAt?.seconds * 1000;
			const createDate = new Date(createMilisecs || new Date().getTime());
			const createDateString = createDate.toLocaleDateString();

			if(!sortedMessages[createDateString]) {
				sortedMessages[createDateString] = [];
			}

			sortedMessages[createDateString].push(messageData);
		});

		Object.keys(sortedMessages).forEach(dateStr => {
			let currMessages: JSX.Element[] = []; // curr date messages
			let currGroupIndex = -1; // index of current filling group
			let messagesGroups: MessagesGroupType[] = []; // groups of messages by 1 user in a row

			let currMyMessages: JSX.Element[] = [];

			//set messages groups of 1 day
			sortedMessages[dateStr].map((data, i) => {
				const prevUid = i > 0 ? sortedMessages[dateStr][i-1].uid : null;
				const isShort: boolean = prevUid == data.uid;
				const isMy = data.uid === myAccountData?.uid || null;

				const currMessage = (
					<Message 
						messageData={data} myAccountId={myAccountData?.uid || ''} setEditMessageData={setEditMessageData}
						key={`${data.createdAt}${data.uid}`} showDeleteConfirm={showDeleteConfirm} 
						openInfoModal={setUsersWhoReadCurrMessage}  isShort={isShort} ref={myMessageRef}
					/>
				);


				if(isMy) {
					currMyMessages = [...currMyMessages, currMessage];
				}

				//create new group
				if(!isShort) {
					//if not my, add user avatar, that writed these messages
					if(!isMy) {
						messagesGroups.push({
							messages: [],
							metadata: {
								isMy: false,
								avatarData: {
									photoUrl: data.photoUrl,
									uid: data.uid,
								}
							}
						});
						//add current message to new group
						messagesGroups[currGroupIndex+1].messages.push(currMessage)
					} else {
						messagesGroups.push({
							messages: [currMessage],
							metadata: {isMy: true}
						});
					}
					currGroupIndex++;
				} else {
					messagesGroups[currGroupIndex].messages.push(currMessage);
				}
			});

			//sorted data -> JSX.Element[]
			currMessages = messagesGroups.map(group => {
				return (
					<MessagesGroup metadata={group.metadata} listRef={listRef}>
						{group.messages}
					</MessagesGroup>
				)	
			});

			const addedElements = [
				<div className={classes.messagesDate}>{dateStr}</div>, 
				...currMessages
			];

			setMyMessages((prevMessages) => [...prevMessages, ...currMyMessages]);

			messages = [...messages, ...addedElements];

			console.log('messages', message);
		});

		setMessagesList(messages);

		console.log('messagesList', messagesList);  
	}, [myAccountData]);

	//get users еhat read curr message 
	useEffect(() => { 
		const getUsers = async () => {
			if(usersWhoReadCurrMessage) {
				setIsUsersFetching(true);
				await dispatch(setCurrMessageWhoReadList(usersWhoReadCurrMessage));
				setIsUsersFetching(false);
			}
		}

		getUsers();
	}, [usersWhoReadCurrMessage]);

	//set users who read current message components
	let whoReadList: JSX.Element[] = [];

	if(usersWhoReadCurrMessageData) {
		usersWhoReadCurrMessageData.forEach(data => {
			whoReadList.push(<ReadMessageUser userData={data} />);
		});
	}

	const closeModal = () => {
		setUsersWhoReadCurrMessage(null);
	}

	useEffect(() => {
		if(messagesList && messagesList.length > 0 && prevMessagesData.length !== messagesData.length) {
			const diff = messagesData.filter(({ id: id1 }, i) => {
				const isDifferent = prevMessagesData[i]?.id !== id1;

				console.log('is different', isDifferent);

				return isDifferent;
			});

			//to chnage this if we create new group
			const lastGroup = messagesList.pop();

			//to add new message to this
			const groupMessages = lastGroup?.props.children;

			if(diff.length > 0) {
				const newGroups = diff.map((data, i) => {
					const lastMessage: MessageDataType = i === 0 ? prevMessagesData[prevMessagesData.length - 1] : diff[i - 1];
					//we need to create new group
					const lastAccountId = lastMessage.uid ;
					//@ts-ignore
					console.log('timestamps', data.createdAt.seconds, lastMessage.createdAt.seconds, data.createdAt.seconds )
	
	
	
					//@ts-ignore
					const lastData = new Date(lastMessage.createdAt.seconds * 1000);
	
					console.log('last data', lastData);
					//@ts-ignore
					const currData = data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000) : new Date();
	
					console.log('curr', currData);
	
					const isNewDate = currData.getTime() - lastData.getTime() < 24 * 60 * 60 * 1000
	
					console.log('is new date', isNewDate);
	
					//create new group or not
					const isNewGroup: boolean = lastAccountId !== data.uid;
					const isMy = data.uid === myAccountData?.uid;
	
					const currMessage = (
						<Message 
							messageData={data} 
							myAccountId={myAccountData?.uid || ''} 
							setEditMessageData={setEditMessageData}
							key={`${data.createdAt}${data.uid}`} 
							showDeleteConfirm={showDeleteConfirm} 
							openInfoModal={setUsersWhoReadCurrMessage}  
							isShort={isNewGroup} 
							ref={isMy ? myMessageRef : undefined}
						/>
					);
		
					if(!isNewGroup && !isNewDate) {
						groupMessages.push(currMessage);
					}
	
					const metadata: MessagesGroupMetadataType = {
						isMy: isNewGroup,
						avatarData: {
							photoUrl: data.photoUrl,
							uid: data.uid,
						}
					}
				
					return (
						<>
							{isNewGroup && !isNewDate ?
								<>
									{lastGroup}
									<MessagesGroup listRef={listRef} metadata={metadata}>
										<></>
										{currMessage}
									</MessagesGroup>
								</>
								: isNewDate ?
								<>
									{lastGroup}
									<div className={classes.messagesDate}>{currData.toLocaleDateString()}</div>, 
									<MessagesGroup listRef={listRef} metadata={metadata}>
										<></>
										{currMessage}
									</MessagesGroup>
								</>
								:
								<MessagesGroup listRef={listRef} metadata={metadata}>
									{groupMessages}
								</MessagesGroup>
							}
						</>
					)
				})
	
	
				const updatedList = [...messagesList, ...newGroups];
	
				setMessagesList((updatedList));
		
		
				setPrevMessagesData(messagesData);
			}
		}
	}, [messagesData]);
	if(!myAccountData) return <Preloader />;

	return (
		<div className={classes.Messages} ref={listRef}>
			{isFetching && <Preloader />}

			<Modal 
				title='Переглянули'
				open={!!usersWhoReadCurrMessage}
				onCancel={() => closeModal()}
				footer={null}
			>
				{whoReadList || 'Ваше повідомлення ніхто не прочитав'}
			</Modal>

			{!!messagesList && messagesList['length'] > 0
				? 
					messagesList
				: <div>Немає повідомлень</div>
			}

			{listRef.current && !!messagesList && messagesList['length'] && 
			<ScrollBottomBtn element={listRef.current} ref={ref} unreadCount={unreadCount || 0} />}
		</div>
	)
});

export default Messages