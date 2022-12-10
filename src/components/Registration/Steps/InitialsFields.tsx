import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { RegistrationFieldValues } from '../Registration';
import classes from './Steps.module.scss';
import { FormControl, TextField } from '@mui/material';
import { SaveBtn } from '../../../UI/SaveBtn';

type PropsType = {
	control: Control<RegistrationFieldValues, any>,
	nextStep: () => void,
};

export const InitialsFields: React.FC<PropsType> = ({control, nextStep}) => {
	return (
		<section className={classes.Step}>
			<h2 className={classes.title}>Як Вас звуть?</h2>
			{/* <div className={classes.image}>
				<img src={initialsImg} />
			</div> */}
			<div className={classes.form}>
				{/* @ts-ignore */}
				<Controller 
					control={control}
					name={'name'}
					render={({field: {value, onChange}}) => (
						<FormControl fullWidth className={classes.fieldWrapper}>
							<TextField
								label={`Ім'я`}
								value={value}
								onChange={onChange}
							/>
						</FormControl>
					)}
				/>

				{/* @ts-ignore */}
				<Controller 
					control={control}
					rules={{
						pattern: /[А-Я]+/
					}}
					name={'surname'}
					render={({field: {value, onChange}}) => (
						<FormControl className={classes.fieldWrapper}>
							<TextField
								label={`Прізвище`}
								value={value}
								onChange={onChange}
							/>
						</FormControl>
					)}
				/>
			</div>
			<SaveBtn onClick={nextStep} className={classes.btn} />
		</section>
	)
}
