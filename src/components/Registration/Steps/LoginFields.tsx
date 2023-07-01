import React, { useContext, useEffect, useRef, useState } from 'react';
import classes from './Steps.module.scss';
import loginImg from '../../../assets/images/login-img.png';
import EastIcon from '@mui/icons-material/East';   
import { Select } from 'antd';
import { ControllerFieldType } from '../../../utils/types';
import { Control, Controller, FieldErrors, UseFormTrigger, useWatch } from 'react-hook-form';
import { FormContext, RegistrationFieldValues } from '../Registration';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { values } from 'lodash';
import { SaveBtn } from '../SaveBtn';
import { FormControl, FormHelperText, FormLabel, Input, TextField } from '@mui/joy';
import IconButton from '@mui/joy/IconButton';
import { useAppDispatch } from '../../../Redux/store';
import { LoginForm } from '../../../UI/LoginForm/LoginForm';
import { checkEmailForExisting, sendEmailVerificationLink } from '../../../Redux/account/account-reducer';


type PropsType = {
	errors: FieldErrors<RegistrationFieldValues>, 
};

export const LoginFields: React.FC<PropsType> = ({errors}) => {
	const { control } = useContext(FormContext) || {};
 
	const email = useWatch({
		control,
		name: 'email',
	})

	const dispatch = useAppDispatch();

	const onSubmit = async () => {
		console.log('on submit', email);
		await dispatch(checkEmailForExisting(email));
		await dispatch(sendEmailVerificationLink(email));
	}

	return (
		<section className={classes.Step}>
			<h2 className={classes.title}>Уведіть дані акаунту</h2>
			<div className={classes.image}>
				<img src={loginImg} />
			</div>
			
			<LoginForm 
				control={control}
				errors={errors}
				className={classes.form}
			/>

			<SaveBtn 
				className={classes.btn}
				errors={errors}
				onSubmit={onSubmit}
				waitForAction={true}
				//strict order adherence(дотримання) for firebase functions(-> array)
				fieldsNames={['email', 'password']}
			/>
		</section>
	)
}
