import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { RegistrationFieldValues } from '../Registration';
import classes from './Steps.module.scss';
import aboutImg from '../../../assets/images/about_img.png';
import { FormControl, IconButton, Input, TextField, Textarea } from '@mui/joy';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EastIcon from '@mui/icons-material/East';
import dayjs from 'dayjs';


type PropsType = {
	control: Control<RegistrationFieldValues, any>,
	errors: FieldErrors<RegistrationFieldValues>,
	nextStep: () => void,
};

export const InfoFields: React.FC<PropsType> = ({control, nextStep, errors}) => {
	const day = dayjs('2022-04-22');


	return (
		<div className={classes.Step}>
			<h2 className={classes.title}>Напишіть про себ е</h2>
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
									onChange={onChange}
									value={value}
									renderInput={({
										value, 
										...other
									}) => (
										<TextField 
											value={value as string}  
											{...other}
										/>
									)}
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
							<Textarea
								defaultValue={undefined || ''}
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
