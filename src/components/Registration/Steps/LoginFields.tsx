import React, { useEffect, useRef, useState } from 'react';
import classes from './Steps.module.scss';
import loginImg from '../../../assets/images/login-img.png';
import EastIcon from '@mui/icons-material/East';   
import { Select } from 'antd';
import { ControllerFieldType } from '../../../utils/types';
import { Control, Controller, FieldErrors, UseFormTrigger } from 'react-hook-form';
import { RegistrationFieldValues } from '../Registration';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { values } from 'lodash';
import { SaveBtn } from '../SaveBtn';
import { FormControl, FormHelperText, FormLabel, Input, TextField } from '@mui/joy';
import IconButton from '@mui/joy/IconButton';
import { useAppDispatch } from '../../../Redux/store';


type PropsType = {
	control: Control<RegistrationFieldValues, any>,
	errors: FieldErrors<RegistrationFieldValues>, 
	nextStep: () => void,
	trigger: UseFormTrigger<RegistrationFieldValues>,
};

export const LoginFields: React.FC<PropsType> = ({control, errors, nextStep, trigger}) => {
	const passwordInpRef = useRef<null | HTMLInputElement>(null);

	const [showPassword, setShowPassword] = useState<boolean>(false);

	const dispatch = useAppDispatch();

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
		<section className={classes.Step}>
			<h2 className={classes.title}>Уведіть дані акаунту</h2>
			<div className={classes.image}>
				<img src={loginImg} />
			</div>
			<div className={classes.form}>
				{/* Логін */}
				<Controller 
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
					control={control}
					name={'password'}
					rules={{
						required: "Це поле є обов'язковим",
						pattern:{
							value: /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}/g, 
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

			<SaveBtn 
				className={classes.btn}
				errors={errors}
				//strict order adherence(достримання) for firebase functions(-> array)
				fieldsNames={['email', 'password']}
			/>
		</section>
	)
}
