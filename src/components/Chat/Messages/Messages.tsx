import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectMyAccountData } from '../../../Redux/account/account-selectors';
import { selectCurrMessageWhoReadList, selectIsMessagesFetching } from '../../../Redux/chat/selectors'; 
import Preloader from '../../../UI/Preloader';
import { MessageDataType, MessagesDataType, UsersWhoReadMessageType } from '../../../utils/types';
import Message from './Message';
import classes from './Messages.module.scss';
import { useAppDispatch } from '../../../Redux/store';
import { deleteMessage, setCurrMessageWhoReadList } from '../../../Redux/chat/reducer';
import { EditMessageDataType } from '../Chat';
import { ReadMessageUser } from '../../../UI/ReadMessageUser';
import { MessagesGroup } from './MessagesGroup';
import { DeleteConfirm } from '../../../UI/DeleteConfirm';
import { UsersWhoReadDialog } from '../../../UI/UsersWhoReadDialog';
import { debounce } from 'lodash';
import { getStringDate } from '../../../utils/helpers/date/getStringDate';
import { selectFooterHeight, selectHeaderHeight } from '../../../Redux/app/appSelectors';
import { ScrollBtn } from '../../../UI/ScrollBtn';
import { getMessageGroupDate } from '../../../utils/helpers/date/getMessageGroupDate';

type PropsType = {
	setEditMessageData: (data: EditMessageDataType) => void, 
	messagesData: MessageDataType[],
	cancelEdit: () => void,
	unreadMessagesCount: number,
	newMessageFormHeight: number, 
	contactUid: string,
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

const getSortedByDateMessages = (messagesData: MessagesDataType): FormattedMessagesType => {
	const sortedMessages: FormattedMessagesType = {};

	messagesData.forEach((messageData: MessageDataType) => {
		//@ts-ignore
		const createMilisecs = messageData.createdAt?.seconds * 1000;
		const createDateString = getMessageGroupDate(createMilisecs || new Date().getTime()); // createMilisecs can be undefiend

		if(!sortedMessages[createDateString]) {
			sortedMessages[createDateString] = [];
		}

		sortedMessages[createDateString].push(messageData);
	});


	return sortedMessages;
}

const Messages = React.forwardRef<HTMLButtonElement, PropsType>(({
	setEditMessageData, messagesData, unreadMessagesCount, newMessageFormHeight, contactUid
}, ref) => {
	const isFetching = useSelector(selectIsMessagesFetching);
	const myAccountData = useSelector(selectMyAccountData);
	const usersWhoReadCurrMessageData = useSelector(selectCurrMessageWhoReadList);
	const headerHeight = useSelector(selectHeaderHeight);
	const footerHeight = useSelector(selectFooterHeight);

	const [usersWhoReadCurrMessage, setUsersWhoReadCurrMessage] = useState<UsersWhoReadMessageType | null>(null);
	const [isUsersFetching, setIsUsersFetching] = useState<boolean>(false);
	const [messagesList, setMessagesList] = useState<JSX.Element[] | null>(null);
	const [prevMessagesData, setPrevMessagesData] = useState<MessagesDataType>(messagesData);
	const [myMessages, setMyMessages] = useState<JSX.Element[]>([]);
	const [currDeleteMessageId, setCurrDeleteMessageId] = useState<string | null>(null);
	const [maxHeightValue, setMaxHeightValue] = useState<string>('100%');

	const listRef = useRef<HTMLDivElement>(null);
	const scrollBtnRef = useRef<HTMLButtonElement>(null);
	const lastReadedMessageRef = useRef<HTMLDivElement>(null);

	const dispatch = useAppDispatch();

	//show delete message modal
	const showDeleteConfirm = (messageId: string) => {
		setCurrDeleteMessageId(messageId)
	};
	const cancelDelete = () => {
		setCurrDeleteMessageId(null);
	}
	const deleteMess = () => {
		if(currDeleteMessageId && myAccountData) {
			dispatch(deleteMessage(myAccountData?.uid, contactUid, currDeleteMessageId));
		}
	}


	//on scroll listener
	useEffect(() => {
		const handleScroll = () => {
			console.log('onscroll');     
		}
		listRef.current?.addEventListener('scroll', debounce(handleScroll, 100));

		return () => {
			listRef.current?.removeEventListener('scroll', handleScroll);
		}
	}, [listRef.current]);

	//scroll to last read message
	useEffect(() => {
		console.log('lst ref current', lastReadedMessageRef.current);
		if(lastReadedMessageRef.current) {
			lastReadedMessageRef.current.scrollIntoView({
				block: 'end',
				behavior: 'auto',
			})
		}
	}, [lastReadedMessageRef, messagesList]);


	//sorted messages data -> messagesList(JSX.Element[])
	useEffect(() => {
		//set messages list
		let messages: JSX.Element[] = []; // messages list

			
		//sorting messages on groups by create date
		const sortedMessages: FormattedMessagesType = getSortedByDateMessages(messagesData);

		if(myAccountData) {
			Object.keys(sortedMessages).forEach(dateStr => {
				let currMessages: JSX.Element[] = []; // curr date messages
				let currGroupIndex = -1; // index of current filling group
				let messagesGroups: MessagesGroupType[] = []; // groups of messages by 1 user in a row

				let currMyMessages: JSX.Element[] = [];

				//set messages groups of 1 day
				sortedMessages[dateStr].map((data, i) => {
					const prevUid = i > 0 ? sortedMessages[dateStr][i-1].uid : null;
					const isShort: boolean = prevUid == data.uid;
					const isMy = data.uid === myAccountData.uid;

					const currMessage = (
						<Message 
							messageData={data} 
							myAccountId={myAccountData?.uid || ''} 
							setEditMessageData={setEditMessageData}
							key={`${data.createdAt}${data.uid}`} 
							showDeleteConfirm={showDeleteConfirm} 
							openInfoModal={setUsersWhoReadCurrMessage}  
							isShort={isShort} 
							ref={
								data.isRead || isMy ?
								lastReadedMessageRef : 
								null
							}
							contactId={data.uid}
						/>
					);
					
					if(isMy) {
						currMyMessages = [...currMyMessages, currMessage];
					}

					//create new group
					if(!isShort) {
						//if not my, add user avatar, that wrote these messages(data)
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
			});
		}

		setMessagesList(messages);
	}, [myAccountData, messagesData]);

	//get users that read curr message data (uid[] -> userData[])
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

	//users who read current message components
	let whoReadList: JSX.Element[] = [];

	if(usersWhoReadCurrMessageData) {
		//set who read list(JSX.Element)
		usersWhoReadCurrMessageData.forEach(data => {
			whoReadList.push(<ReadMessageUser userData={data} />);
		});
	}

	const closeModal = () => {
		setUsersWhoReadCurrMessage(null);
	}

	useEffect(() => {
		setMaxHeightValue(`calc(100vh - ${(footerHeight || 0) + (headerHeight || 0)}px`);
	}, [footerHeight, headerHeight]);

	console.log('list ref', window.document.body.offsetWidth - (listRef.current?.getBoundingClientRect().right || 0));

	return (
		<div 
			className={classes.Messages} 
			ref={listRef}
		>
			{isFetching && <Preloader />}

			<UsersWhoReadDialog
				isOpen={!!usersWhoReadCurrMessage}
				onClose={closeModal}
			>
				{whoReadList || 'Ваше повідомлення ніхто не прочитав'}
			</UsersWhoReadDialog>
			
			<DeleteConfirm 
				target='це повідомлення'
				isShow={!!currDeleteMessageId}
				onCancel={cancelDelete}
				onDelete={deleteMess}
				onClose={cancelDelete}
			/>

			{!!messagesList && messagesList['length'] > 0
				? 
					messagesList
				: <div>Немає повідомлень</div>
			}

			{listRef.current && 
				<ScrollBtn 
					newMessageFormH={newMessageFormHeight}
					right={window.document.body.offsetWidth - (listRef.current?.getBoundingClientRect().right || 0)}
					element={listRef.current} 
					ref={scrollBtnRef} 
					unreadCount={unreadMessagesCount || undefined} 
				/>
			}
		</div>
	)
});

export default Messages