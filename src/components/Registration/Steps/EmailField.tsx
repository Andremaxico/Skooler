import React, { useContext } from 'react';
import classes from './Steps.module.scss';
import { Controller, FieldErrors, useWatch } from 'react-hook-form';
import { FormContext, RegistrationFieldValues } from '../Registration';
import { FormControl, FormHelperText, FormLabel, Input } from '@mui/joy';
import { SaveBtn } from '../SaveBtn';
import { useAppDispatch } from '../../../Redux/store';
import { checkEmailForExisting, sendEmailVerificationLink } from '../../../Redux/account/account-reducer';

type PropsType = {
	errors: FieldErrors<RegistrationFieldValues>,
};

export const EmailField: React.FC<PropsType> = ({errors}) => {
	const { control } = useContext(FormContext) || {};

	//for dispatching email for check for existing
	const value = useWatch({
		control,
		name: 'email',
	})

	const dispatch = useAppDispatch();

	//run after positive validation
	const onSubmit = async () => {
		await dispatch(checkEmailForExisting(value));
		await dispatch(sendEmailVerificationLink());
	}

	return (
		<div className={classes.Step}>
			<h1 className={classes.title}>Введіть Вашу електронну пошту</h1>
			<div className={classes.image}></div>
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
			</div>
			<div className={classes.buttons}>
				<SaveBtn
					errors={errors}
					fieldsNames={['email']}
					className={classes.btn}
					onSubmit={onSubmit}
				/>
			</div>
		</div>
	)
}
