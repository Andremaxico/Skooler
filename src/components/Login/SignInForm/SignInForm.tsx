import React from 'react';
import classes from './SignInForm.module.scss';
import { useForm } from 'react-hook-form';
import { signInByEmail } from '../../../Redux/account/account-reducer';
import { LoginForm } from '../../../UI/LoginForm/LoginForm';
import { useAppDispatch } from '../../../Redux/store';
import { Button } from '@mui/joy';
import cn from 'classnames';

type PropsType = {
	className?: string,
}

export type LoginFieldsValues = {
	email: string,
	password: string,
};

export const SignInForm: React.FC<PropsType> = ({className}) => {
	const { control, formState: { errors }, handleSubmit } = useForm<LoginFieldsValues>();

	const dispatch = useAppDispatch();

	const onSubmit = (data: LoginFieldsValues) => {
		console.log('submit data', data);
		dispatch(signInByEmail(data.email, data.password));
	};

	return (
		<form className={cn(className, classes.loginForm)} onSubmit={handleSubmit(onSubmit)}>
			<LoginForm 
				control={control}
				errors={errors}
				className={classes.loginFields}
			/>
			<Button type='submit' className={classes.submitBtn}>
				Увійти
			</Button>
		</form>
)
}
