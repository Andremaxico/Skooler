import React, { ReactElement, useState } from 'react';

import { Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import classes from './NewMessageForm.module.scss';
import Preloader from '../../../UI/Preloader';
import { MessageDataType, UserType } from '../../../utils/types';
import { serverTimestamp } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { sendMessage } from '../../../Redux/chat/reducer';
import { AnyAction } from 'redux';

type PropsType = {
	authData: UserType | null,
}

export const NewMessageForm: React.FC<PropsType> = ({authData}): ReactElement<any, any> => {
	const [messageValue, setMessageValue] = useState<string>('');

	const dispatch = useDispatch();

	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessageValue(e.target.value);
	}

	const addMessage = async () => {
		const newMessageData: MessageDataType = {
			uid: authData?.uid,
			displayName: authData?.displayName,
			photoUrl: authData?.photoURL,
			text: messageValue,
			createdAt: serverTimestamp(),
		}

		sendMessage(newMessageData);

		//setMessagesData(messages);
		setMessageValue('');
	}

	return (
		<form className={classes.NewMessageForm} onSubmit={addMessage}>
			<TextArea 
				showCount maxLength={100}  value={messageValue}
				onChange={onChange} className={classes.textareaWrap}
				placeholder='Your message'
			/>
			<Button onClick={addMessage} className={classes.sendBtn} type='primary'>Send</Button>

		</form>
	)
}

