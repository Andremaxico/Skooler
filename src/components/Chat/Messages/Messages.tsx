import { FieldValue } from 'firebase/firestore';
import React, { useRef } from 'react'
import { useSelector } from 'react-redux';
import { selectMyLoginData } from '../../../Redux/account/account-selectors';
import { selectIsMessagesFetching, selectMessages } from '../../../Redux/chat/selectors'; 
import Preloader from '../../../UI/Preloader';
import { ScrollBottomBtn } from '../../../UI/ScrollBottomBtn';
import { MessageDataType } from '../../../utils/types';
import { renderToStaticMarkup } from "react-dom/server";
import Message from './Message';
import classes from './Messages.module.scss';

type PropsType = {}

type FormattedMessagesType = {[key: string]: MessageDataType[]};

const Messages: React.FC<PropsType> = ({}) => {
	const messagesData = useSelector(selectMessages);
	const isFetching = useSelector(selectIsMessagesFetching);
	const loginData = useSelector(selectMyLoginData);

	const sortedMessages: FormattedMessagesType = {};

	const listRef = useRef<HTMLDivElement>(null);

	//sorting messages
	messagesData?.forEach(messageData => {
		//@ts-ignore
		const createMilisecs = messageData.createdAt ? messageData.createdAt.seconds * 1000 : new Date().getTime();
		const createDate = new Date(createMilisecs);
		const createDateString = createDate.toLocaleDateString();

		if(!sortedMessages[createDateString]) {
			sortedMessages[createDateString] = [];
		}

		sortedMessages[createDateString].push(messageData);
		console.log('formatted messages', sortedMessages);

	});

	//get unread messages count
	const unreadCount = messagesData?.filter(data => {
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
			const currMessages = sortedMessages[dateStr].map(data => (
				<Message 
					messageData={data} myAccountId={loginData?.uid || ''} 
					key={`${data.createdAt}${data.uid}`}
		   	/>
			));
			const addedElements = [
				<div className={classes.messagesDate}>{dateStr}</div>, 
				...currMessages
			];

			messages = [...messages, ...addedElements];
		});

		messagesList = messages;
	}

	return (
		<div className={classes.Messages} ref={listRef}>
			{isFetching && <Preloader />}

			{!!messagesList?.length
				? 
					messagesList
				: <div>Немає повідомлень</div>
			}

			{listRef.current && !!messagesList?.length && <ScrollBottomBtn element={listRef.current} unreadCount={unreadCount || 0} />}
		</div>
	)
}

export default Messages