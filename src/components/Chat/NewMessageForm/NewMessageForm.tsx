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
import { selectContactData, selectErrorsWithSendingMessages, selectMessages } from '../../../Redux/chat/selectors';
import { selectFooterHeight } from '../../../Redux/app/appSelectors';
import { GENERAL_CHAT_ID } from '../../../utils/constants';
import { getMessageTime } from '../../../utils/helpers/date/getMessageTime';

type ContactDataType = ReceivedAccountDataType | Promise<ReceivedAccountDataType | undefined>;

type PropsType = {
	myId: string,
	isMessageEdit: boolean,
	currValue?: string, 
	ScrollBtn: HTMLButtonElement | null,
	updateMessage: (value: string) => void,
	contactUid: string,
}

type FieldValues = {
	message: string,
}

export const NewMessageForm: React.FC<PropsType> = React.memo(({
	myId, isMessageEdit, currValue, updateMessage, ScrollBtn, contactUid
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
	const [lastSentMessageData, setLastSentMessageData] = useState<MessageDataType | null>(null);


	//ant design form(щоб показувати зарашнє значення коментара) & reset formmessa

	const accountData = useSelector(selectMyAccountData);
	const messages = useSelector(selectMessages);
	const contactData = useSelector(selectContactData);
	const errorsWithSending = useSelector(selectErrorsWithSendingMessages);

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
	// useEffect(() => {
	// 	const heightValue = formRef.current?.offsetHeight || 0;
	// 	//for Chat.tsx(upper level)
	// 	setHeight(heightValue);
	// }, [formRef]);

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
					contactFullname: userData.fullName,
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

	const createGeneralChatInfo = async (lastMessageData: MessageDataType) => {
		let chatInfo: null | ChatDataType = null;
		
		//create chat info if we hadn't messages before
		if(messages && messages.length < 2) {
			chatInfo = {
				lastMessageData,
				lastMessageTime: lastMessageData.createdAt,
				contactAvatarUrl: GENERAL_CHAT_ID,
				contactFullname: 'Загальний чат',
				contactId: GENERAL_CHAT_ID,
				unreadCount: 0
			}
			dispatch(setChatInfo(chatInfo, myId, GENERAL_CHAT_ID));
		//update chat info
		} else {
			chatInfo = {
				lastMessageData,
				lastMessageTime: lastMessageData.createdAt
			}
			dispatch(updateChatInfo(chatInfo, myId, GENERAL_CHAT_ID));
		}
	}

	//send message to thunk
	const addMessage = async (newMessage: string) => {
		//create new message data
		const newMessageData: MessageDataType = {
			uid: myId,
			displayName: `${accountData?.fullName}` || 'Анонім',
			photoUrl: accountData?.avatarUrl || '',
			text: newMessage,
			createdAt: serverTimestamp(),
			id: v1(),
			usersWhoRead: [myId || null],
			edited: false,
			sent: false,
			isRead: false,
		}
		reset();
		if(textareaEl) textareaEl.value = '';
		setIsSendBtnShowing(false);

		setLastSentMessageData(newMessageData);

		//if authed -> send message and set chat info
		console.log('contactdata', contactData, myId, accountData);
		if(accountData && contactUid === GENERAL_CHAT_ID) {
			//uid1->contactUid->messages
			dispatch(sendMessage(newMessageData, accountData.uid, contactUid));
		} else if(accountData && contactData) {
			console.log('have account data');
			//uid1->contactUid->messages
			dispatch(sendMessage(newMessageData, accountData.uid, contactUid));
		}
	}

	useEffect(() => {
		console.log('last message data changed-------------------------------', lastSentMessageData);
	}, [lastSentMessageData]);

	//we send message and check is it sended successfully -> then change Chat info
	useEffect(() => {
		console.log('laste sent message data', lastSentMessageData);
		console.log('error with sending', errorsWithSending);
		console.log(accountData, contactData);
		if(
			lastSentMessageData 
			&& !errorsWithSending.includes(lastSentMessageData.id) 
		) {
			if(contactUid === GENERAL_CHAT_ID) {
				createGeneralChatInfo(lastSentMessageData);
			} else if(contactData && accountData) {
				//uid1 -> contactUid-> data (api)
				createChatInfo(lastSentMessageData, contactData, accountData.uid, contactUid);
			}
		}
	}, [lastSentMessageData, errorsWithSending])

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
			// style={{
			// 	bottom: `-${formHeight}px`
			// }}
		>
			<Controller
				name='message'
				control={control}
				rules={{
					required: 'Напишіть повідомлення!',
					minLength: {value: 1, message: 'Напишіть повідомлення!'},
					maxLength: {value: 500, message: 'Повідомлення надто довге'},
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

