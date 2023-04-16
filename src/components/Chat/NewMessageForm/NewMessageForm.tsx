import React, { FocusEvent, ReactElement, useEffect, useRef, useState } from 'react';

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
import { footerHeightReceived } from '../../../Redux/app/appReducer';

type PropsType = {
	authData: UserType | null,
	isMessageEdit: boolean,
	currValue?: string, 
	ScrollBtn: HTMLButtonElement | null,
	updateMessage: (value: string) => void,
}

type FieldValues = {
	message: string,
}

export const NewMessageForm: React.FC<PropsType> = React.memo(({
	authData, isMessageEdit, currValue, updateMessage, ScrollBtn
}): ReactElement<any, any> => {
	//react-hook-form
	const { control, formState: {errors, isValid}, handleSubmit, reset, setValue, trigger, watch } = useForm<FieldValues>();
	const [isSending, setIsSending] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [isFirstlyOpened, setIsFirstlyOpened] = useState<boolean>(true);
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
	const [textareaEl, setTextareaEl] = useState<HTMLTextAreaElement | null>(null);

	//ant design form(щоб показувати зарашнє значення коментара) & reset formmessa

	const accountData = useSelector(selectMyAccountData);

	//for autofocus
	const messageField = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);

	//set textarea element
	useEffect(() => {
		if(messageField.current) {
			//fignyaaaaaaaa 
			// DELETE THISSSS! IS`S GIVNOCODE
			//ale pobachymo
			setTextareaEl(messageField.current.querySelector('textarea'));
			console.log('set textareaEl');
		}
	}, []);

	const dispatch = useAppDispatch();

	const onSubmit = async (data: FieldValues) => {
		console.log('submit data', data);
		if(!isSubmitted) setIsSubmitted(true);
	 	if(!isMessageEdit) {
			setIsSending(true);
			await addMessage(data.message);
			setIsSending(false);
			if(ScrollBtn) {
				//for in MEssages changed will apply
				setTimeout(() => {
					console.log('cliked!');
					ScrollBtn.click()
				}, 300);
			}
		} else  {
			setIsSending(true);
			await updateMessage(data.message);
			setIsSending(false);
		}

		//reset
		if(textareaEl) textareaEl.value = '';
		setValue('message', '', {shouldValidate: true});
	};

	//for edit
	useEffect(() => {
		//set focus on the message field
		console.log('curr value or ismessageEdit changed', textareaEl, isMessageEdit);
		if(textareaEl && isMessageEdit) {
			textareaEl.focus();
		}
		//set to react-hook-form value
		
	}, [isMessageEdit]);

	useEffect(() => {
		setValue('message', currValue || '');
	}, [currValue])

	//send message to thunk
	const addMessage = async (newMessage: string) => {
		const newMessageData: MessageDataType = {
			uid: authData?.uid || 'undefined',
			displayName: `${accountData?.fullName}` || 'Анонім',
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

	//form instaead of footer
	useEffect(() => {
		if(formRef.current) {
			const formHeight = formRef.current.offsetHeight;

			console.log('formHeight', formHeight);

			dispatch(footerHeightReceived(formHeight));
		}
	}, []);

	//trigger message field for start validation
	useEffect(() => {
		if(!isSubmitted) {
			console.log('trigger');
			trigger('message');
		}
	}, [watch('message')]);

	const isSendBtnShowing = isFirstlyOpened && !isMessageEdit ? !isFirstlyOpened : !isMessageEdit ? !errors.message : true;

	return (
		<form className={classes.NewMessageForm} onSubmit={handleSubmit(onSubmit)} ref={formRef}>
			<Controller
				name='message'
				control={control}
				rules={{
					required: 'Напишіть повідомлення!',
					minLength: {value: 1, message: 'Напишіть повідомлення!'},
					maxLength: {value: 600, message: 'Повідомлення надто довге'},
				}}
				defaultValue={currValue}
				render={({field: {onChange, value}}) => (
					<FormControl className={classes.textareaWrap} >
						<Textarea
							value={value}
							// error={!!errors.message && isFocused}
							//onFocus={() => setIsFirstlyOpened(false)}
							// onBlur={() => setIsFocused(false)}
							defaultValue={currValue}
							onChange={(e) => {
								onChange(e);
								if(isFirstlyOpened) setIsFirstlyOpened(false);
							}} 
							component={FormControl}
							placeholder='Ваше повідомлення'
							size='lg'
							ref={messageField}
							sx={{minWidth: '100%' }}
							endDecorator={ isSendBtnShowing &&		
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

