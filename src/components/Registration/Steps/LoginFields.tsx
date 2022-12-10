import React, { useState } from 'react';
import classes from './Steps.module.scss';
import loginImg from '../../../assets/images/login-img.png';
import EastIcon from '@mui/icons-material/East';   
import { FormControl, Autocomplete, TextField, CircularProgress, InputLabel, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { Select } from 'antd';
import { ControllerFieldType } from '../../../utils/types';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { RegistrationFieldValues } from '../Registration';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { values } from 'lodash';
import { SaveBtn } from '../../../UI/SaveBtn';

type PropsType = {
	control: Control<RegistrationFieldValues, any>,
	errors: FieldErrors<RegistrationFieldValues>,
	nextStep: () => void,
};

export const LoginFields: React.FC<PropsType> = ({control, errors, nextStep}) => {
	const [values, setValues] = React.useState({
		amount: '',
		password: '',
		weight: '',
		weightRange: '',
		showPassword: false,
	});
  
	const handleClickShowPassword = () => {
		setValues({
		  ...values,
		  showPassword: !values.showPassword,
		});
	};

	return (
		<section className={classes.Step}>
			<h2 className={classes.title}>Уведіть дані акаунту</h2>
			<div className={classes.image}>
				<img src={loginImg} />
			</div>
			<div className={classes.form}>
				{/* Логін */}
				{/* @ts-ignore */}
				<Controller 
					control={control}
					name={'email'}
					rules={{
						required: `Це поле є обов'язковим`,
						pattern: /[A-z][1-9]/,
					}}
					render={({field: {value, onChange}} : ControllerFieldType) => (
						<FormControl fullWidth className={classes.fieldWrapper}>
							<TextField
								value={value}
								onChange={onChange}
								label='Електронна пошта'
							/>
						</FormControl>
					)}
				/>

				{/* Пароль*/}
				{/* @ts-ignore */}
				<Controller 
					control={control}
					name={'password'}
					rules={{
						required: "Це поле є обов'язковим",
						pattern: /[A-Z]+  /
					}}
					render={({field: {onChange, value}} : ControllerFieldType) => (
						<FormControl
							className={classes.fieldWrapper}
						>
							<InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
							<OutlinedInput
								id="outlined-adornment-password"
								type={values.showPassword ? 'text' : 'password'}
								value={value}
								onChange={onChange}
								endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										edge="end"
									>
										{values.showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
								}
								label="Пароль"
							/>
						</FormControl>
					)}
				/>
			</div>

			<SaveBtn className={classes.btn}  onClick={nextStep}/>
		</section>
	)
}
