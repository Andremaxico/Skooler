import React from 'react';
import classes from './ChatsList.module.scss';
import { ChatDataType } from '../../../utils/types';
import { ChatCard } from '../../../UI/ChatCard';
import { GeneralChatCard } from '../../../UI/GeneralChatCard';
import { useSelector } from 'react-redux';
import { selectGeneralChatData } from '../../../Redux/chat/selectors';
import { GENERAL_CHAT_ID } from '../../../utils/constants';

type PropsType = {
	chatsData: ChatDataType[],
};

export const ChatsList: React.FC<PropsType> = ({chatsData}) => {
	const generalChatData = useSelector(selectGeneralChatData);

	return (
		<div className={classes.ChatsList}>
			{generalChatData &&
				<GeneralChatCard 
					data={generalChatData}
					active={false}
				/>
			}
			{chatsData.map(data => (
				data.contactId !== GENERAL_CHAT_ID  &&
				<ChatCard
					data={data} 
					key={data.contactId}
				/>
			))}
		</div>
	)
}
