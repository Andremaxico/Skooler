import React, { useRef, useState } from 'react';
import classes from './LoginForm.module.scss';
import { RegistrationFieldValues } from '../../components/Registration/Registration';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { FormControl, FormLabel, FormHelperText, IconButton, Input } from '@mui/joy';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { ControllerFieldType } from '../../utils/types';
import { AnyAction } from 'redux';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { selectAuthErrors } from '../../Redux/account/account-selectors';
import { LoginFieldsValues } from '../../components/Login/SignInForm/SignInForm';

//created separated component for login fields
//this is using in Registration.tsx(LoginFields) and Login.tsx

type PropsType = {
	control: Control<RegistrationFieldValues, any> | Control<LoginFieldsValues, any> | undefined,
	errors: FieldErrors<RegistrationFieldValues | LoginFieldsValues>, 
	className?: string,
};

export const LoginForm: React.FC<PropsType> = ({control, errors, className  }) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const passwordInpRef = useRef<null | HTMLInputElement>(null);

	const authErrors = useSelector(selectAuthErrors);

	const handleClickShowPassword = () => {
		if(passwordInpRef.current) {
			//givno code
			const input = passwordInpRef.current.querySelector('input');
			//TODO:
			//focus in the end of text on input
			if(input) {
				const end = input.value.length;
				const value = input.value;

  				input.focus();

			}
		}

		setShowPassword((isShow) => !isShow);
	};

	return (
		<div className={cn(classes.form, className)}>
			{authErrors['signin'] &&
				<p className={classes.serverError}>{authErrors['signin'].message}</p>
			}
		
			{/* Логін */}
			<Controller 
			//@ts-ignore
				control={control}
				name={'email'}
				rules={{
					required: `Це поле є обов'язковим`,
				}}
				render={({field: {value, onChange}}) => (
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
						<FormHelperText className={classes.errorText}></FormHelperText>
					</FormControl>
				)}
			/>

			{/* Пароль*/}
			<Controller 
			//@ts-ignore
				control={control}
				name={'password'}
				rules={{
					required: "Це поле є обов'язковим",
					pattern:{
						value: /(?=.*[0-9])(?=.*[a-z])[0-9a-zA-Z]{6,}/g, 
						message: 'Пароль повинен містити мінімум 6 символів, цифри, малі і великі букви'
					},
					maxLength: {value: 16, message: 'Максимальна довдина пароля - 16 символів'}
				}}
				render={({field: {onChange, value}} : ControllerFieldType) => (
					<FormControl className={classes.fieldWrapper} required>
						<FormLabel className={classes.label} htmlFor="password">Пароль</FormLabel>
						<Input
							id="password"
							type={showPassword ? 'text' : 'password'}
							value={value}
							error={!!errors.password}
							onChange={onChange}
							ref={passwordInpRef}
							placeholder="Пароль"
							endDecorator={
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									variant='plain'
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							}
						/>
						<FormHelperText className={classes.errorText}></FormHelperText>
					</FormControl>
				)}
			/>
		</div>
	)
}
