import React, { useContext } from 'react';
import classes from './Steps.module.scss';
import { Controller, FieldErrors, useWatch } from 'react-hook-form';
import { FormContext, RegistrationFieldValues } from '../Registration';
import { FormControl, FormHelperText, FormLabel, Input } from '@mui/joy';
import { ReturnBtn } from '../ReturnBtn';
import { SaveBtn } from '../SaveBtn';
import { useAppDispatch } from '../../../Redux/store';
import { createAccountByEmail } from '../../../Redux/account/account-reducer';
import { useSelector } from 'react-redux';

type PropsType = {
	errors: FieldErrors<RegistrationFieldValues>,
};

export const EmailVerirficationField: React.FC<PropsType> = ({errors}) => {
	const { control } = useContext(FormContext) || {};

	const dispatch = useAppDispatch();

	const [email, password] = useWatch({
		control, 
		name: ['email', 'password', 'emailCode'],
	})

	// const onSubmit  = async () => {
	// 	//await dispatch(markEmailAsVerified(email, password));
	// }

	return (
		<div className={classes.Step}>
			<div className={classes.title}>Підтвердження електронної пошти</div>
			<p className={classes.infoText}>
				Перейдіть за посиланням, що прийшло на вашу пошту
				<span style={{'fontWeight': 'bold'}}> {email}</span> для підтвердження.
				Ви можете закрити цю сторінку
			</p>
			{/* <div className={classes.form}>
				<Controller 
					control={control}
					name={'emailCode'}
					rules={{
						required: `Це поле є обов'язковим`,
						pattern: { value: activeEmailCode ? emailCodeRegExp : /[0-9]{6}/, message: 'Недійсний код' },
						maxLength: {value: 6, message: "Код складається із 6 символів"},
						minLength: {value: 6, message: "Код складається із 6 символів"}
					}}
					render={({field: {value, onChange}}) => (
						<FormControl className={classes.fieldWrapper} required>
							<FormLabel className={classes.label} htmlFor='emailCode'>Код підтвердження</FormLabel>
							<Input
								error={!!errors.emailCode}
								id='emailCode'
								placeholder={`Код`}
								value={value}
								onChange={onChange}
								className={classes.input}
								type='number'
							/>
							{errors.emailCode &&
								<FormHelperText className={classes.errortText}>
									{errors.emailCode.message}
								</FormHelperText>
							}
						</FormControl>
					)}
				/>
			</div>
			<div className={classes.buttons}>
				<ReturnBtn className={classes.btn} />
				<SaveBtn 
					fieldsNames={['emailCode']}
					errors={errors}
					className={classes.btn}
					onSubmitFunctions={[onSubmit]}
					waitForAction={true}
				/>
			</div> */}
		</div>
	)
}
