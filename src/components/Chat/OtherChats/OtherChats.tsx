import React, { useEffect } from 'react'
import classes from './OtherChats.module.scss';
import { useSelector } from 'react-redux'
import { selectChatsData, selectGeneralChatData } from '../../../Redux/chat/selectors'
import { selectMyAccountData } from '../../../Redux/account/account-selectors'
import { useAppDispatch } from '../../../Redux/store'
import { subscribeOnChats, unsubscribeFromChats } from '../../../Redux/chat/reducer'
import { ChatCard } from '../../../UI/ChatCard';
import { GeneralChatCard } from '../../../UI/GeneralChatCard';
import { GENERAL_CHAT_ID } from '../../../utils/constants';

//openedChatId - for matching in other chats current ioened chat 
type PropsType = {
	openedChatId?: string,
}

export const OtherChats: React.FC<PropsType> = ({openedChatId}) => {
	const chatsData = useSelector(selectChatsData);
	const generalChatData = useSelector(selectGeneralChatData);
	const myAccountData = useSelector(selectMyAccountData);

	const dispatch = useAppDispatch();

	console.log(chatsData, generalChatData);

	//when we got account data -> subscribing on chat changed -> immediately get chats data
	useEffect(() => {
		dispatch(subscribeOnChats());

		return () => {
			dispatch(unsubscribeFromChats());
		}
	}, [myAccountData?.uid]);

	return (
		<aside className={classes.OtherChats}>
			{generalChatData &&
				<GeneralChatCard
					active={openedChatId === GENERAL_CHAT_ID}
					data={generalChatData}
					key={GENERAL_CHAT_ID}
				/>
			}
			
			{chatsData?.map(data => (
				data.contactId !== GENERAL_CHAT_ID &&
				<ChatCard 
					data={data}
					key={data.contactId}
					active={openedChatId === data.contactId}
				/>
			))}
		</aside>
	)
}