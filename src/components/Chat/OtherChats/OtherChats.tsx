import React, { useEffect } from 'react'
import classes from './OtherChats.module.scss';
import { useSelector } from 'react-redux'
import { selectChatsData } from '../../../Redux/chat/selectors'
import { selectMyAccountData } from '../../../Redux/account/account-selectors'
import { useAppDispatch } from '../../../Redux/store'
import { subscribeOnChats } from '../../../Redux/chat/reducer'
import { ChatCard } from '../../../UI/ChatCard';

//openedChatId - for matching in other chats current ioened chat 
type PropsType = {
	openedChatId?: string,
}

export const OtherChats: React.FC<PropsType> = ({openedChatId}) => {
	const chatsData = useSelector(selectChatsData);
	const myAccountData = useSelector(selectMyAccountData);

	const dispatch = useAppDispatch();

	//when we got account data -> subscribing on chat changed -> immediately get chats data
	useEffect(() => {
		dispatch(subscribeOnChats());
	}, [myAccountData?.uid]);

	return (
		<aside className={classes.OtherChats}>
			{chatsData?.map(data => (
				<ChatCard 
					data={data}
					key={data.contactId}
					active={openedChatId === data.contactId}
				/>
			))}
		</aside>
	)
}