import React, { ReactElement, useEffect, useRef, useState } from 'react';

import SendIcon from '@mui/icons-material/Send';
import classes from './NewMessageForm.module.scss';
import { ChatDataType, MessageDataType, ReceivedAccountDataType, UserType } from '../../../utils/types';
import { serverTimestamp } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { sendMessage, setChatInfo, updateChatInfo } from '../../../Redux/chat/reducer';
import { selectMyAccountData } from '../../../Redux/account/account-selectors';
import { Controller, useForm } from 'react-hook-form';
import { v1 } from 'uuid';
import { useAppDispatch } from '../../../Redux/store';
import { FormControl, IconButton, Textarea } from '@mui/joy';
import { footerHeightReceived } from '../../../Redux/app/appReducer';
import { selectContactData, selectMessages } from '../../../Redux/chat/selectors';
import { selectFooterHeight } from '../../../Redux/app/appSelectors';

type ContactDataType = ReceivedAccountDataType | Promise<ReceivedAccountDataType | undefined>;

type PropsType = {
	authData: UserType | null,
	isMessageEdit: boolean,
	currValue?: string, 
	ScrollBtn: HTMLButtonElement | null,
	updateMessage: (value: string) => void,
	setHeight: (n: number) => void,
	contactUid: string,
	unreadCount: number,
}

type FieldValues = {
	message: string,
}

export const NewMessageForm: React.FC<PropsType> = React.memo(({
	authData, isMessageEdit, currValue, updateMessage, ScrollBtn, contactUid, unreadCount, setHeight
}): ReactElement<any, any> => {
	//react-hook-form
	const { control, formState: {errors, isValid}, handleSubmit, reset, setValue, trigger, watch } = useForm<FieldValues>();
	const [isSending, setIsSending] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [isFirstlyOpened, setIsFirstlyOpened] = useState<boolean>(true);
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
	const [textareaEl, setTextareaEl] = useState<HTMLTextAreaElement | null>(null);
	const [isSendBtnShowing, setIsSendBtnShowing] = useState<boolean>(false);
	const [formHeight, setFormHeight] = useState<number>(0);

	//ant design form(щоб показувати зарашнє значення коментара) & reset formmessa

	const accountData = useSelector(selectMyAccountData);
	const messages = useSelector(selectMessages);
	const contactData = useSelector(selectContactData);

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

	//when whole form submitting -> send message
	const onSubmit = async (data: FieldValues) => {
		console.log('submit data', data);
		if(!isSubmitted) setIsSubmitted(true);
	 	if(!isMessageEdit) {
			setIsSending(true);
			await addMessage(data.message);
			setIsSending(false);
			if(ScrollBtn) {
				//scroll to new message
				ScrollBtn.click();
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

	//autofocus when editinig
	useEffect(() => {
		//set focus on the message field
		console.log('curr value or ismessageEdit changed', textareaEl, isMessageEdit);
		if(textareaEl && isMessageEdit) {
			textareaEl.focus();
		}
		//set to react-hook-form value
		
	}, [isMessageEdit]);

	//menual value set in react-hook-form
	useEffect(() => {
		setValue('message', currValue || '');
	}, [currValue])

	//changed ref -> set height for chat body padding
	useEffect(() => {
		const heightValue = formRef.current?.offsetHeight || 0;
		//for Chat.tsx(upper level)
		setHeight(heightValue);
	}, [formRef]);

	//changed ref -> set height for -bottom value of form
	useEffect(() => {
		const heightValue = formRef.current?.offsetHeight || 0;
		//for -bottom valuef
		setFormHeight(heightValue);
	}, [formRef]);


	//chat info for chatCard  
	const createChatInfo = async (
		messageData: MessageDataType, contactData: ContactDataType, baseUid: string, secondUid: string
	) => {
		let chatInfo: ChatDataType | null = null;

		console.log('create chat info messages', messages);
		//if we havent messages -> we havent chat in firebase -> create info
		if(!messages || messages.length === 0) {
			console.log('new chat info');
			const userData = await contactData;   
			if(userData) {
				chatInfo = {
					lastMessageData: messageData,
					lastMessageTime: messageData.createdAt,
					contactAvatarUrl: userData?.avatarUrl || undefined,
					contactFullname: userData.name + ' ' + userData.surname,
					contactId: userData.uid,
					unreadCount: 0,
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
			displayName: `${accountData?.name} ${accountData?.surname}` || 'Анонім',
			photoUrl: accountData?.avatarUrl || '',
			text: newMessage,
			createdAt: serverTimestamp(),
			id: v1(),
			usersWhoRead: [authData?.uid || null],
			edited: false,
			sent: false,
			isRead: false,
		}
		reset();
		if(textareaEl) textareaEl.value = '';
		setIsSendBtnShowing(false);

		//if authed -> send message and set chat info
		console.log('contactdata', contactData);
		if(accountData && contactData) {
			console.log('have account data');
			//uid1 -> contactUid-> data (api)
			createChatInfo(newMessageData, contactData, accountData.uid, contactUid);
			//uid1->contactUid->messages
			dispatch(sendMessage(newMessageData, accountData.uid, contactUid));
			//uid1->contactUid->messages
			await dispatch(sendMessage(newMessageData, contactUid, accountData.uid));
		}
	}

	//trigger message field for start validation
	useEffect(() => {
		if(!isSubmitted) {
			trigger('message');
		}
	}, [watch('message')]);

	useEffect(() => {
		setIsSendBtnShowing(
			isFirstlyOpened && !isMessageEdit ? false 
			: !isMessageEdit ? isValid
			: true
		);
	}, [isFirstlyOpened, isMessageEdit, isValid]);
	//if firstly open and not editing -> false, else if no(editing) and no firstly -> is messagesErrors(true -> false)
	return (
		<form 
			className={classes.NewMessageForm} 
			onSubmit={handleSubmit(onSubmit)} 
			ref={formRef}
			style={{
				bottom: `-${formHeight}px`
			}}
		>
			<Controller
				name='message'
				control={control}
				rules={{
					required: 'Напишіть повідомлення!',
					minLength: {value: 1, message: 'Напишіть повідомлення!'},
					maxLength: {value: 5, message: 'Повідомлення надто довге'},
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

