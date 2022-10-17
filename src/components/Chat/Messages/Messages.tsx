import { FieldValue } from 'firebase/firestore';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectMyLoginData } from '../../../Redux/account/account-selectors';
import { selectCurrMessageWhoReadList, selectIsMessagesFetching, selectMessages } from '../../../Redux/chat/selectors'; 
import Preloader from '../../../UI/Preloader';
import { ScrollBottomBtn } from '../../../UI/ScrollBottomBtn';
import { MessageDataType, ReceivedAccountDataType, UsersWhoReadMessageType } from '../../../utils/types';
import Message from './Message';
import classes from './Messages.module.scss';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import confirm from 'antd/lib/modal/confirm';
import { useAppDispatch } from '../../../Redux/store';
import { deleteMessage, setCurrMessageWhoReadList } from '../../../Redux/chat/reducer';
import { EditMessageDataType } from '../Chat';
import { Avatar, Modal } from 'antd';
import { ReadMessageUser } from '../../../UI/ReadMessageUser';
import ListSubheader from '@mui/material/ListSubheader';
import { Link } from 'react-router-dom';

type PropsType = {
	setEditMessageData: (data: EditMessageDataType) => void, 
	//ref: React.RefObject<HTMLButtonElement>,
}

type FormattedMessagesType = {[key: string]: MessageDataType[]};

const Messages = React.forwardRef<HTMLButtonElement, PropsType>(({setEditMessageData}, ref) => {
	const messagesData = useSelector(selectMessages);
	const isFetching = useSelector(selectIsMessagesFetching);
	const loginData = useSelector(selectMyLoginData);

	const [usersWhoReadCurrMessage, setUsersWhoReadCurrMessage] = useState<UsersWhoReadMessageType | null>(null);
	const usersWhoReadCurrMessageData = useSelector(selectCurrMessageWhoReadList);
	const [isUsersFetching, setIsUsersFetching] = useState<boolean>(false);

	const listRef = useRef<HTMLDivElement>(null);
	//show delete message modal
	const dispatch = useAppDispatch();

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

	messagesData?.forEach((messageData: MessageDataType) => {
		//@ts-ignore
		const createMilisecs = messageData.createdAt?.seconds * 1000;
		const createDate = new Date(createMilisecs || new Date().getTime());
		const createDateString = createDate.toLocaleDateString();

		if(!sortedMessages[createDateString]) {
			sortedMessages[createDateString] = [];
		}

		sortedMessages[createDateString].push(messageData);
	});


	//sorting messages in groups writed by 1 user in row
	//get unread messages count
	const unreadCount = messagesData?.filter((data: MessageDataType) => {
		if(data.usersWhoRead) {
			return !data.usersWhoRead.includes(loginData?.uid || null)
		}
		return false;
	}).length;

	let messagesList: JSX.Element[] | null = null;

	//set messages list
	if(messagesData) {
		let messages: JSX.Element[] = []; // messages list

		Object.keys(sortedMessages).forEach(dateStr => {

			let currMessages: JSX.Element[] = []; // curr date messages
			let currGroupIndex = -1; // index of current filling group
			let messagesGroups: Array<JSX.Element>[] = []; // groups of messages by 1 user in a row

			//set messages groups
			sortedMessages[dateStr].map((data, i) => {
				const prevUid = i > 0 ? sortedMessages[dateStr][i-1].uid : null;
				const isShort: boolean = prevUid == data.uid;
				const isMy = data.uid === loginData?.uid || null;

				const currMessage = (
					<Message 
						messageData={data} myAccountId={loginData?.uid || ''} setEditMessageData={setEditMessageData}
						key={`${data.createdAt}${data.uid}`} showDeleteConfirm={showDeleteConfirm} 
						openInfoModal={setUsersWhoReadCurrMessage}  isShort={isShort}
					/>
				);

				//if prev message's author is not current message's author, create new group
				if(!isShort) {
					const accountAvatar = (avatarUrl: string | null | undefined) => (
						<Link to={`/account/${!isMy ? loginData?.uid : ''}`} replace={true}>
							<ListSubheader className={classes.avatarWrap} >	
								<Avatar 
									src={avatarUrl} size={40} icon={<UserOutlined />}
									className={classes.avatar}
								/>
							</ListSubheader>
						</Link>
					)

					//if not my, add user avatar, that writed these messages
					if(!isMy) {
						messagesGroups.push([accountAvatar(data.photoUrl)]);
						//add current message to new group
						messagesGroups[currGroupIndex+1].push(currMessage);
					} else {
						messagesGroups.push([currMessage]);
					}
					currGroupIndex++;
				} else {
					messagesGroups[currGroupIndex].push(currMessage);
				}

				console.log('is short', isShort);
			});

			console.log('messages groups', messagesGroups);

			currMessages = messagesGroups.map(group => (
				<div className={classes.messagesGruop}>

					{group}
				</div>
			));

			const addedElements = [
				<div className={classes.messagesDate}>{dateStr}</div>, 
				...currMessages
			];

			messages = [...messages, ...addedElements];
		});

		messagesList = messages;
	}

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

	console.log('users that read mesage', usersWhoReadCurrMessageData);

	if(usersWhoReadCurrMessageData) {
		usersWhoReadCurrMessageData.forEach(data => {
			whoReadList.push(<ReadMessageUser userData={data} />);
		});
	}

	const closeModal = () => {
		setUsersWhoReadCurrMessage(null);
	}

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

			{!!messagesList?.length
				? 
					messagesList
				: <div>Немає повідомлень</div>
			}

			{listRef.current && !!messagesList?.length && 
			<ScrollBottomBtn element={listRef.current} ref={ref} unreadCount={unreadCount || 0} />}
		</div>
	)
});

export default Messages