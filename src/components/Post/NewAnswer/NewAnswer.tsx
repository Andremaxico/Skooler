import { Button } from '@mui/joy';
import Textarea from '@mui/joy/Textarea';
import TextField from '@mui/joy/TextField';
import { serverTimestamp } from 'firebase/firestore';
import React  from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { v4 } from 'uuid';
import { selectMyAccountData } from '../../../Redux/account/account-selectors';
import { useAppDispatch } from '../../../Redux/store';
import { addNewAnswer } from '../../../Redux/stream/stream-reducer';
import { CommentType } from '../../../utils/types';
import classes from './NewAnswer.module.scss';

type PropsType = {
	cancelAnswer: () => void,
	questionId: string | undefined,
};

type FieldValuesType = {
	text: string,
}
export const NewAnswer: React.FC<PropsType> = ({cancelAnswer, questionId}) => {
	const { control, handleSubmit, formState: {errors}, reset } = useForm<FieldValuesType>();

	const myAccountData = useSelector(selectMyAccountData);

	const dispatch = useAppDispatch();
	const onSubmit = (data: FieldValuesType) => {
		if(questionId && myAccountData) {
			const sendData: CommentType = {
				createdAt: serverTimestamp(),
				text: data.text,
				authorAvatarUrl: myAccountData.avatarUrl || '',
				authorFullname: `${myAccountData.surname} ${myAccountData.name}`,
				id: v4(),
				authorId: myAccountData.uid,
				stars: 0,
				isCorrect: false,
				authorRating: myAccountData.rating,
			}
	
			dispatch(addNewAnswer(questionId, sendData));
			close();
		}
	}

	const close = () => {
		reset();
		cancelAnswer();
	}

	return (
		<div className={classes.NewAnswer}>
			<div className={classes.top}>
				<h2 className={classes.title}>Дайте відповідь</h2>
				<Button className={classes.cancelBtn} size='sm' onClick={close}>
					Скасувати
				</Button>
			</div>
			<form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
				<Controller 
					control={control}
					name='text'
					render={({field: {onChange, value}}) => (
						<Textarea
							value={value}
							onChange={onChange}
							className={classes.textarea}
							placeholder={'Ваша відповідь...'}
							endDecorator={
								<div className={classes.endDecorator}>
									<Button className={classes.submitBtn} type={'submit'}>
										Опублікувати
									</Button>
								</div>
								
							}
						/>
					)}
				/>
			</form>
		</div>
	)
}
