import React from 'react'
import { MessageDataType } from '../../../utils/types'
import Message from './Message';
import classes from './Messages.module.scss';

type PropsType = {
	messagesData: MessageDataType[] | null
}

const Messages: React.FC<PropsType> = ({messagesData}) => {
	const messagesList = messagesData?.map(data => {
		return <Message messageData={data} />
	});

	return (
		<div className={classes.Messages}>
			{messagesList}
		</div>
	)
}

export default Messages