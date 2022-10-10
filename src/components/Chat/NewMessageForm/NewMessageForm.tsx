import React, { ReactElement, useEffect, useRef, useState } from 'react';

import { Button, Form } from 'antd';
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

type PropsType = {
	authData: UserType | null,
	isMessageEdit: boolean,
	currValue?: string, 
	updateMessage: (value: string) => void,
}

type FieldValues = {
	message: string,
}

export const NewMessageForm: React.FC<PropsType> = React.memo(({authData, isMessageEdit, currValue, updateMessage}): ReactElement<any, any> => {
	//react-hook-form
	const { control, formState: {errors}, handleSubmit, reset, setValue } = useForm<FieldValues>();

	//ant design form(щоб показувати зарашнє значення коментара)
	const [ form ] = Form.useForm();

	const accountData = useSelector(selectMyAccountData);

	const messageField = useRef<HTMLTextAreaElement>(null);

	const dispatch = useAppDispatch();

	const onSubmit = (data: FieldValues) => {
		console.log('submit data', data);
	 	if(!isMessageEdit) {
			addMessage(data.message);
		} else  {
			updateMessage(data.message);
		}
		 
	};

	useEffect(() => {
		//set for antd textarea
		form.setFieldValue('message', currValue);
		//set focus on the message field
		if(messageField.current && isMessageEdit) {
			messageField.current.focus();
		}
		//set to react-hook-form value
		setValue('message', currValue || '');
	}, [currValue]);

	const addMessage = async (newMessage: string) => {
		const newMessageData: MessageDataType = {
			uid: authData?.uid,
			displayName: `${accountData?.surname} ${accountData?.name}` || 'Анонім',
			photoUrl: accountData?.avatarUrl || '',
			text: newMessage,
			createdAt: serverTimestamp(),
			id: v1(),
			usersWhoRead: [authData?.uid || null],
			edited: false,
		}

		reset();
		dispatch(sendMessage(newMessageData));
	}

	return (
		<Form className={classes.NewMessageForm} onFinish={handleSubmit(onSubmit)} form={form}>
			<Controller
				name='message'
				control={control}
				defaultValue={currValue}
				render={({field: {onChange, value = 'h1h'}}) => (
					<Form.Item
						name={'message'}
						initialValue={currValue}
						dependencies={currValue ? [currValue] : undefined}
					>
						<TextArea 
							showCount maxLength={100}  value={value}
							onChange={onChange} className={classes.textareaWrap}
							placeholder='Ваше повідомлення' defaultValue={currValue}
							ref={messageField}
						/>
					</Form.Item>
				)} 
			/>
			<Button htmlType='submit' className={classes.sendBtn} type='primary'> Надіслати</Button>

		</Form>
	)
});

