import React from 'react'
import { useSelector } from 'react-redux';
import { selectMyLoginData } from '../../../Redux/account/account-selectors';
import { selectIsMessagesFetching, selectMessages } from '../../../Redux/chat/selectors'; 
import Preloader from '../../../UI/Preloader';
import Message from './Message';
import classes from './Messages.module.scss';

type PropsType = {}

const Messages: React.FC<PropsType> = ({}) => {
	const messagesData = useSelector(selectMessages);
	const isFetching = useSelector(selectIsMessagesFetching);
	const loginData = useSelector(selectMyLoginData);
	
	let messagesList: JSX.Element[] | null = null;

	if(messagesData) {
		messagesList = messagesData?.map(data => {
			return <Message 
				messageData={data} myAccountId={loginData?.uid || ''} 
				key={`${data.createdAt}${data.uid}`}
			/>
		});
	}

	console.log('messages list', messagesList);

	return (
		<div className={classes.Messages}>
			{isFetching && <Preloader />}
			{!!messagesList?.length
				? messagesList
				: <div>Немає повідомлень</div>
		
			}
		</div>
	)
}

export default Messages