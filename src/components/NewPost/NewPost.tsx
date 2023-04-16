
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import classes from './NewPost.module.scss';
import { useAppDispatch } from '../../Redux/store';
import { PostDataType } from '../../utils/types';
import { v4 } from 'uuid';
import { selectMyAccountData } from '../../Redux/account/account-selectors';
import { sendNewPost } from '../../Redux/stream/stream-reducer';
import { useNavigate } from 'react-router-dom';
import { FieldValue, serverTimestamp } from 'firebase/firestore';
import Textarea from '@mui/joy/Textarea';
import FormHelperText from '@mui/joy/FormHelperText';
import { Button, FormControl } from '@mui/joy';
import { CategoriesSelect } from '../../UI/CategoriesSelect';

type PropsType = {}

type FieldsType = {
	text: string,
	category: any,
}

export const NewPost: React.FC<PropsType> = ({}) => {
	const { control, handleSubmit, formState: {errors}, reset } = useForm<FieldsType>();

	const myAccountData = useSelector(selectMyAccountData);

	const dispatch = useAppDispatch();
	
	const navigate = useNavigate();
	//redirect to main   page
	const cancel = () => {
		reset();
		navigate('/');
	}

	//if not authed -> redirect to login page
	if(!myAccountData) navigate('/login');

	const onSubmit = (data: FieldsType) => {
		console.log('subit data', data);

		const newPostData: PostDataType = {
			id: v4(),
			authorAvatarUrl: myAccountData?.avatarUrl || null,
			authorFullname: `${myAccountData?.fullName}`,
			createdAt: serverTimestamp(),
			text: data.text,
			category: data.category,
			stars: 0,
			authorId: myAccountData?.uid || 'no',
			commentsCount: 0,
			isClosed: false,
			authorRating: myAccountData?.rating || 'Ніхто',
			isEdited: false,
		}

		//send question
		dispatch(sendNewPost(newPostData));

		cancel();
	}

	return (
		<div className={classes.NewPost}>
			<h2 className={classes.title}>Запитайте щось</h2>
			<form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
				<Controller 
					control={control}
					name='text'
					rules={{
						required: 'Запитайте щось!'
					}}
					render={({field: {value, onChange}}) => (
						<FormControl>
							<Textarea
								placeholder={'Ваше запитання'}
								value={value}
								error={!!errors.text}
								onChange={onChange}
								minRows={3}
								className={classes.textarea}
								component={FormControl}
							/>
							{errors.text && <FormHelperText>{errors.text.message}</FormHelperText>}
						</FormControl>
					)}
				/>
				<CategoriesSelect control={control} className={classes.select}/>
				<div className={classes.buttons}>
					<Button 
						variant="outlined" 
						color="danger"
						className={classes.cancelBtn}
						onClick={cancel}
					>
						Скасувати
					</Button>
					<Button 
						className={classes.submitBtn}
						type='submit'
					>
						Опублікувати
					</Button>
				</div>
			</form>
		</div>
	)
}
