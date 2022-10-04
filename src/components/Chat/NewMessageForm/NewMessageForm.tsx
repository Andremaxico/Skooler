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
import { Controller, useForm } from 'react-hook-form';
import { v1 } from 'uuid';

type PropsType = {
	authData: UserType | null,
}

type FieldValues = {
	message: string,
}

export const NewMessageForm: React.FC<PropsType> = ({authData}): ReactElement<any, any> => {
	const { control, formState: {errors}, handleSubmit, reset } = useForm<FieldValues>();
	const accountData = useSelector(selectMyAccountData);

	const dispatch = useDispatch();

	const onSubmit = (data: FieldValues) => addMessage(data.message);

	const addMessage = async (newMessage: string) => {
		const newMessageData: MessageDataType = {
			uid: authData?.uid,
			displayName: `${accountData?.surname} ${accountData?.name}` || 'Анонім',
			photoUrl: accountData?.avatarUrl || '',
			text: newMessage,
			createdAt: serverTimestamp(),
			id: v1(),
			usersWhoRead: [authData?.uid || null],
		}

		sendMessage(newMessageData);
		reset();
	}

	return (
		<form className={classes.NewMessageForm} onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name='message'
				control={control}
				render={({field: {onChange, value}}) => (
					<TextArea 
						showCount maxLength={100}  value={value}
						onChange={onChange} className={classes.textareaWrap}
						placeholder='Your message'
					/>
				)} 
			/>
			<Button htmlType='submit' className={classes.sendBtn} type='primary'>Надіслати</Button>

		</form>
	)
}

