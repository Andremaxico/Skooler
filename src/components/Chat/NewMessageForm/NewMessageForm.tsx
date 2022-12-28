import React, { ReactElement, useEffect, useRef, useState } from 'react';

import SendIcon from '@mui/icons-material/Send';
import TextArea from 'antd/lib/input/TextArea';
import classes from './NewMessageForm.module.scss';
import Preloader from '../../../UI/Preloader';
import { MessageDataType, UserType } from '../../../utils/types';
import { serverTimestamp } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { editMessage, sendMessage } from '../../../Redux/chat/reducer';
import { AnyAction } from 'redux';
import { selectMyAccountData } from '../../../Redux/account/account-selectors';
import { Controller, useForm } from 'react-hook-form';
import { v1 } from 'uuid';
import { useAppDispatch } from '../../../Redux/store';
import { scrollElementToBottom } from '../../../utils/helpers/scrollElementToBottom';
import { Button, FormControl, IconButton, Textarea } from '@mui/joy';
import { message } from 'antd';

type PropsType = {
	authData: UserType | null,
	isMessageEdit: boolean,
	currValue?: string, 
	scrollBottomBtn: HTMLButtonElement | null,
	updateMessage: (value: string) => void,
}

type FieldValues = {
	message: string,
}

export const NewMessageForm: React.FC<PropsType> = React.memo(({
	authData, isMessageEdit, currValue, updateMessage, scrollBottomBtn
}): ReactElement<any, any> => {
	//react-hook-form
	const { control, formState: {errors}, handleSubmit, reset, setValue } = useForm<FieldValues>();
	const [isSending, setIsSending] = useState<boolean>(false);

	//ant design form(щоб показувати зарашнє значення коментара) & reset formmessa

	const accountData = useSelector(selectMyAccountData);

	//for autofocus
	const messageField = useRef<HTMLDivElement>(null);
	let textareaEl: HTMLTextAreaElement | null | undefined = null;

	useEffect(() => {
		if(messageField) {
			//fignyaaaaaaaa 
			// DELETE THISSSS! IS`S GIVNOCODE
			//ale pobachymo
			textareaEl = messageField.current?.querySelector('textarea');
		}
	}, [messageField]);

	console.log('message ref', messageField);

	const dispatch = useAppDispatch();

	const onSubmit = async (data: FieldValues) => {
		console.log('submit data', data);
	 	if(!isMessageEdit) {
			setIsSending(true);
			await addMessage(data.message);
			setIsSending(false);
			if(scrollBottomBtn) {
				//for in MEssages changed will apply
				setTimeout(() => {
					console.log('cliked!');
					scrollBottomBtn.click()
				}, 300);
			}
		} else  {
			setIsSending(true);
			await updateMessage(data.message);
			setIsSending(false);
		}

		reset();
	};

	//for edit
	useEffect(() => {
		//set for antd textarea
		//form.setFieldValue('message', currValue);
		//set focus on the message field
		if(textareaEl && isMessageEdit) {
			textareaEl.focus();
		}
		//set to react-hook-form value
		setValue('message', currValue || '');
	}, [currValue]);

	const addMessage = async (newMessage: string) => {
		const newMessageData: MessageDataType = {
			uid: authData?.uid || 'undefined',
			displayName: `${accountData?.surname} ${accountData?.name}` || 'Анонім',
			photoUrl: accountData?.avatarUrl || '',
			text: newMessage,
			createdAt: serverTimestamp(),
			id: v1(),
			usersWhoRead: [authData?.uid || null],
			edited: false,
			received: false,
		}

		reset();
		await dispatch(sendMessage(newMessageData));
		if(textareaEl) textareaEl.value = '';
	}

	return (
		<form className={classes.NewMessageForm} onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name='message'
				control={control}
				defaultValue={currValue}
				render={({field: {onChange, value}}) => (
					<FormControl className={classes.textareaWrap} >
						<Textarea
							value={value}
							onChange={onChange} 
							component={FormControl}
							placeholder='Ваше повідомлення'
							size='lg'
							ref={messageField}
							sx={{minWidth: '100%' }}
							endDecorator={		
								<IconButton color='primary' type='submit' className={classes.sendBtn}> 
									<SendIcon />
								</IconButton>
							}
						/>
					</FormControl>
				)} 
			/>
		</form>
	)
});

