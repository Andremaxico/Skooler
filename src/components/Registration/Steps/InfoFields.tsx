<<<<<<< HEAD
import {  Form } from 'antd';
=======
import {  Form, Input } from 'antd';
>>>>>>> f0a0e1dc5720320ac046ce0a9489471ff300868f
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { RegistrationFieldValues } from '../Registration';
import classes from './Steps.module.scss';
import aboutImg from '../../../assets/images/about_img.png';
import TextArea from 'antd/lib/input/TextArea';
<<<<<<< HEAD
import { FormControl, IconButton, Input } from '@mui/joy';
=======
import { FormControl, IconButton, TextField } from '@mui/material';
>>>>>>> f0a0e1dc5720320ac046ce0a9489471ff300868f
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
<<<<<<< HEAD
				{/* <Controller 
=======
				<Controller 
>>>>>>> f0a0e1dc5720320ac046ce0a9489471ff300868f
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
<<<<<<< HEAD
										(params) => <Input {...params} />
=======
										(params) => <TextField {...params} />
>>>>>>> f0a0e1dc5720320ac046ce0a9489471ff300868f
									}
								/>
							</LocalizationProvider>
						</FormControl>
					)}
<<<<<<< HEAD
				/> */}

				{/* @ts-ignore */}
				{/* <Controller 
=======
				/>

				{/* @ts-ignore */}
				<Controller 
>>>>>>> f0a0e1dc5720320ac046ce0a9489471ff300868f
					control={control}
					name={'aboutMe'}
					rules={{
						required: "Це поле є обов'язковим",
					}}
					render={({}) => (
						<FormControl
							className={classes.fieldWrapper}
						>
<<<<<<< HEAD
							<Input
=======
							<TextField
>>>>>>> f0a0e1dc5720320ac046ce0a9489471ff300868f
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
<<<<<<< HEAD
				/> */}
=======
				/>
>>>>>>> f0a0e1dc5720320ac046ce0a9489471ff300868f
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
