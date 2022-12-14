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
import { ExclamationCircleOutlined } from '@ant-design/icons';
import confirm from 'antd/lib/modal/confirm';
import { useAppDispatch } from '../../../Redux/store';
import { deleteMessage, setCurrMessageWhoReadList } from '../../../Redux/chat/reducer';
import { EditMessageDataType } from '../Chat';
import { Modal } from 'antd';
import { ReadMessageUser } from '../../../UI/ReadMessageUser';
//import ListSubheader from '@mui/material/ListSubheader';

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
		let messages: JSX.Element[] = [];

		Object.keys(sortedMessages).forEach(dateStr => {
			const currMessages = sortedMessages[dateStr].map((data, i) => {
				const prevUid = i > 0 ? sortedMessages[dateStr][i-1].uid : null;
				const isShort: boolean = prevUid == data.uid;

				console.log(isShort ? 'repeated messages' : 'common');

				return <Message 
					messageData={data} myAccountId={loginData?.uid || ''} setEditMessageData={setEditMessageData}
					key={`${data.createdAt}${data.uid}`} showDeleteConfirm={showDeleteConfirm} 
					openInfoModal={setUsersWhoReadCurrMessage}  isShort={isShort}
		   	/>
			});
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

			{/* <ListSubheader sx={{ bgcolor: 'background.paper' }}>
				Yesterday
			</ListSubheader> */}

			{listRef.current && !!messagesList?.length && 
			<ScrollBottomBtn element={listRef.current} ref={ref} unreadCount={unreadCount || 0} />}
		</div>
	)
});

export default Messages