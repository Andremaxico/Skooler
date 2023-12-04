import React from 'react';
import classes from './ChatsList.module.scss';
import { ChatDataType } from '../../../utils/types';
import { ChatCard } from '../../../UI/ChatCard';

type PropsType = {
	chatsData: ChatDataType[],
};

export const ChatsList: React.FC<PropsType> = ({chatsData}) => {
	return (
		<div className={classes.ChatsList}>
			{chatsData.map(data => (
				<ChatCard
					data={data} 
					key={data.contactId}
				/>
			))}
		</div>
	)
}
