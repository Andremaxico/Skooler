import React, { useContext, useState } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { FormContext, RegistrationFieldValues } from '../Registration';
import classes from './Steps.module.scss';
import { FormControl, FormHelperText, FormLabel, Input } from '@mui/joy';
import { SaveBtn } from '../SaveBtn';
import Preloader from '../../../UI/Preloader/Preloader';
import { ReturnBtn } from '../ReturnBtn/ReturnBtn';

type PropsType = {
	errors: FieldErrors<RegistrationFieldValues>,
};  
export const InitialsFields: React.FC<PropsType> = ({errors}) => {
	const {control, nextStep, trigger} = useContext(FormContext) || {};

	if(!control || !nextStep || !errors || !trigger) return <Preloader />

	return (
		<section className={classes.Step}>
			<p className={classes.infoText}>Вашу електронну адресу перевірено, продовжуйте реєстрацію</p>
			<h2 className={classes.title}>Як Вас звуть?</h2>
			{/* <div className={classes.image}>
				<img src={initialsImg} />
			</div> */}
			<div className={classes.form}> 
				<Controller 
					control={control}
					name={'name'}
					rules={{
						pattern: {value: /[А-Я][а-я]+/, message: `Використовуйте кирилицю, від 2-х літер`},
						required: "Це поле є обов'язковим"
					}}
					render={({field: {value, onChange}}) => (
						<FormControl className={classes.fieldWrapper} required>
							<FormLabel className={classes.label} htmlFor='name'>Ім'я</FormLabel>
							<Input
								error={!!errors.name}
								id='name'
								placeholder={`Ім'я`}
								value={value}
								onChange={onChange}
								className={classes.input}
							/>
							{errors.name &&
								<FormHelperText className={classes.errortText}>
									{errors.name.message}
								</FormHelperText>
							}
						</FormControl>
					)}
				/>

				<Controller 
					control={control}
					rules={{
						pattern: {value: /[А-Я][а-я]+/, message: `Використовуйте кирилицю, від 2-х літер`},
						required: "Це поле є обов'язковим",
					}}
					name={'surname'}
					render={({field: {value, onChange}}) => (
						<FormControl className={classes.fieldWrapper} required>
							<FormLabel className={classes.label} htmlFor='surname'>Прізвище</FormLabel>
							<Input
								error={!!errors.surname}
								id='surname'
								placeholder={`Прізвище`}
								value={value}
								onChange={onChange}
								className={classes.input}
							/>
							{errors?.surname &&
								<FormHelperText className={classes.errortText}>
									{errors.surname.message}
								</FormHelperText>
							}
						</FormControl>
					)}
				/>
			</div>
			<div className={classes.buttons}>
				<SaveBtn 
					className={classes.btn}
					errors={errors}
					fieldsNames={['name', 'surname']}
				/>
			</div>
		</section>
	)
}
