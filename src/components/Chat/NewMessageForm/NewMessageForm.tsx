import React, { ReactElement, useState } from 'react';

import { Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import classes from './NewMessageForm.module.scss';
import Preloader from '../../../UI/Preloader';
import { MessageDataType, UserType } from '../../../utils/types';
import { serverTimestamp } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../../Redux/chat/reducer';
import { AnyAction } from 'redux';
import { selectMyAccountData } from '../../../Redux/account/account-selectors';

type PropsType = {
	authData: UserType | null,
}

export const NewMessageForm: React.FC<PropsType> = ({authData}): ReactElement<any, any> => {
	const [messageValue, setMessageValue] = useState<string>('');
	const accountData = useSelector(selectMyAccountData);

	const dispatch = useDispatch();

	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessageValue(e.target.value);
	}

	const addMessage = async () => {
		const newMessageData: MessageDataType = {
			uid: authData?.uid,
			displayName: `${accountData?.surname} ${accountData?.name}` || 'Анонім',
			photoUrl: accountData?.avatarUrl || '',
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

