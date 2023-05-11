import React, { FocusEvent, ReactElement, useEffect, useRef, useState } from 'react';

import SendIcon from '@mui/icons-material/Send';
import TextArea from 'antd/lib/input/TextArea';
import classes from './NewMessageForm.module.scss';
import Preloader from '../../../UI/Preloader';
import { ChatDataType, MessageDataType, ReceivedAccountDataType, UserType } from '../../../utils/types';
import { serverTimestamp } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { editMessage, sendMessage, setChatInfo, updateChatInfo } from '../../../Redux/chat/reducer';
import { AnyAction } from 'redux';
import { selectMyAccountData } from '../../../Redux/account/account-selectors';
import { Controller, useForm } from 'react-hook-form';
import { v1 } from 'uuid';
import { useAppDispatch } from '../../../Redux/store';
import { scrollElementToBottom } from '../../../utils/helpers/scrollElementToBottom';
import { Button, FormControl, IconButton, Textarea } from '@mui/joy';
import { message } from 'antd';
import { footerHeightReceived } from '../../../Redux/app/appReducer';
import { selectMessages } from '../../../Redux/chat/selectors';
import { useUserData } from '../../../utils/hooks/useUserData';

type ContactDataType = ReceivedAccountDataType | Promise<ReceivedAccountDataType | undefined>;

type PropsType = {
	authData: UserType | null,
	isMessageEdit: boolean,
	currValue?: string, 
	ScrollBtn: HTMLButtonElement | null,
	updateMessage: (value: string) => void,
	uid2: string,
}

type FieldValues = {
	message: string,
}

export const NewMessageForm: React.FC<PropsType> = React.memo(({
	authData, isMessageEdit, currValue, updateMessage, ScrollBtn, uid2
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
	const messages = useSelector(selectMessages);
	const contactData = useUserData(uid2);

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

	
	const createChatInfo = async (
		messageData: MessageDataType, secondUserData: ContactDataType, baseUid: string, secondUid: string
	) => {
		let chatInfo: ChatDataType | null = null;

		console.log('create chat info messages', messages);
		//if we havent messages -> we havent chat in firebase -> create info
		if(!messages || messages.length === 0) {
			console.log('new chat info');
			const userData = await secondUserData;
			if(userData) {
				chatInfo = {
					lastMessageData: messageData,
					lastMessageTime: messageData.createdAt,
					contactAvatarUrl: userData?.avatarUrl,
					contactFullname: userData.fullName,
					contactId: userData.uid,
				}
				dispatch(setChatInfo(chatInfo, baseUid, secondUid));
			}
		//we update old info
		} else {
			chatInfo = {
				lastMessageData: messageData,
				lastMessageTime: messageData.createdAt,
			}
			dispatch(updateChatInfo(chatInfo, baseUid, secondUid));
		}
	}

	//send message to thunk
	const addMessage = async (newMessage: string) => {
		//create new message data
		const newMessageData: MessageDataType = {
			uid: authData?.uid || 'undefined',
			displayName: `${accountData?.fullName}` || 'Анонім',
			photoUrl: accountData?.avatarUrl || '',
			text: newMessage,
			createdAt: serverTimestamp(),
			id: v1(),
			usersWhoRead: [authData?.uid || null],
			edited: false,
			sent: false,
			isRead: false,
		}
		//if authed -> send message and set chat info
		if(accountData) {
			//uid1 -> uid2-> data (api)
			createChatInfo(newMessageData, contactData, accountData.uid, uid2);
			//uid2 -> uid1 -> data (api)
			createChatInfo(newMessageData, accountData, uid2, accountData.uid);
			//uid1->uid2->messages
			dispatch(sendMessage(newMessageData, accountData.uid, uid2));
			//uid1->uid2->messages
			await dispatch(sendMessage(newMessageData, uid2, accountData.uid));
		}
		reset();
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

