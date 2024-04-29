import React from 'react';
import classes from './ResetEmailForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { FormControl, FormLabel, FormHelperText, Input, Button } from '@mui/joy';
import cn from 'classnames';
import { useAppDispatch } from '../../../../Redux/store';
import { sendPasswordResetEmail } from '../../../../Redux/account/account-reducer';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectPrevPage } from '../../../../Redux/app/appSelectors';

type PropsType = {
	className?: string,
}

type FieldsValues = {
	email: string,
}

export const ResetEmailForm: React.FC<PropsType> = ({ className }) => {
	const { control, formState: { errors }, handleSubmit, reset  } = useForm<FieldsValues>();

	const prevPage = useSelector(selectPrevPage);

	const navigate = useNavigate();

	const dispatch = useAppDispatch();

	const onSubmit = async (data: FieldsValues) => {
		await dispatch(sendPasswordResetEmail(data.email.trim()));

		reset();  
	}

	const returnBack = () => {
		navigate(prevPage || '/login');
	}

	return (
		<form className={cn(className, classes.ResetEmailForm)} onSubmit={handleSubmit(onSubmit)}>
			<Controller 
				//@ts-ignore
				control={control}
				name={'email'}
				rules={{
					required: `Це поле є обов'язковим`,
				}}
				render={({field: {value, onChange}}) => (
					//TODO 
					//cteate new compoennt for it
					<FormControl className={classes.fieldWrapper} required>
						<FormLabel className={classes.label} htmlFor='email-input'>Електронна пошта</FormLabel>
						<Input
							id='email-input'
							error={!!errors.email}
							value={value}
							onChange={onChange}
							placeholder='Електронна пошта'
							type='email'
							className={classes.input}
						/>
						<FormHelperText className={classes.errorText}>{errors.email?.message}</FormHelperText>
					</FormControl>
				)}
			/>
			<div className={classes.buttons}>
				<Button className={classes.submitBtn} onClick={returnBack} color='danger'>
					Скасувати
				</Button>
				<Button className={classes.submitBtn} type='submit'>
					Зберегти
				</Button>
			</div>
		</form>
	)
}
