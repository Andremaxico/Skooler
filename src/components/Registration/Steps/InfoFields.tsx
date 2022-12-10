import {  Form, Input } from 'antd';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { RegistrationFieldValues } from '../Registration';
import classes from './Steps.module.scss';
import aboutImg from '../../../assets/images/about_img.png';
import TextArea from 'antd/lib/input/TextArea';
import { FormControl, IconButton, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EastIcon from '@mui/icons-material/East';


type PropsType = {
	control: Control<RegistrationFieldValues, any>,
	errors: FieldErrors<RegistrationFieldValues>,
	nextStep: () => void,
};

export const InfoFields: React.FC<PropsType> = ({control, nextStep, errors}) => {
	return (
		<div className={classes.Step}>
			<h2 className={classes.title}>Напишіть про себе</h2>
			<div className={classes.image}>
				<img src={aboutImg} />
			</div>
			<form className={classes.form}>
				{/* @ts-ignore */}
				<Controller 
					control={control}
					name={'birthDate'}
					render={({field: {value, onChange}}) => (
						<FormControl
							className={classes.fieldWrapper}
						>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									label='Дата народження'
									value={value}
									onChange={onChange}
									renderInput={
										(params) => <TextField {...params} />
									}
								/>
							</LocalizationProvider>
						</FormControl>
					)}
				/>

				{/* @ts-ignore */}
				<Controller 
					control={control}
					name={'aboutMe'}
					rules={{
						required: "Це поле є обов'язковим",
					}}
					render={({}) => (
						<FormControl
							className={classes.fieldWrapper}
						>
							<TextField
								error={Boolean(errors.aboutMe)}
								multiline
								maxRows={6}
								minRows={4}
								label="Про себе"
								defaultValue={undefined || ''}
								variant='outlined'
							/>
						</FormControl>
					)}
				/>
			</form>
			<button className={classes.btn} onClick={nextStep}>
				<span>Далі</span>
				<IconButton className={classes.iconWrapper}>
					<EastIcon color='primary' />
				</IconButton>
			</button>
		</div>
	)
}  
