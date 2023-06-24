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
import { LoginForm } from '../../../UI/LoginForm/LoginForm';


type PropsType = {
	control: Control<RegistrationFieldValues, any>,
	errors: FieldErrors<RegistrationFieldValues>, 
	nextStep: () => void,
	trigger: UseFormTrigger<RegistrationFieldValues>,
};

export const LoginFields: React.FC<PropsType> = ({control, errors, nextStep, trigger}) => {
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
				//strict order adherence(дотримання) for firebase functions(-> array)
				fieldsNames={['email', 'password']}
			/>
		</section>
	)
}
