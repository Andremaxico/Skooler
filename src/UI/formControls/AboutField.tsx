import React, { useContext } from 'react';
import classes from './Steps.module.scss';
import { FormControl, FormHelperText, FormLabel, Textarea } from '@mui/joy';
import aboutImg from '../../../assets/images/about_img.png';
import { Controller, FieldErrors } from 'react-hook-form';
import { SaveBtn } from '../../components/Registration/SaveBtn';
import { RegistrationFieldValues, FormContext } from '../../components/Registration/Registration';
import { ReturnBtn } from '../../components/Registration/ReturnBtn/ReturnBtn';

type PropsType = {
	error: string | undefined,
};

export const AboutField: React.FC<PropsType> = ({error}) => {
	const {control} = useContext(FormContext) || {};

	return (
		<div className={classes.Step}>
			<h2 className={classes.title}>Напишіть про себе</h2>
			<div className={classes.image}>
				<img src={aboutImg} />
			</div>
			<div className={classes.form}>
				<Controller 
					control={control}
					name={'aboutMe'}
					rules={{
						maxLength: {value: 500, message: 'Максимум 500 символів'}
					}}
					render={({field: {value, onChange}}) => (
						<FormControl
							className={classes.fieldWrapper}
						>
							<FormLabel className={classes.label}>Про себе</FormLabel>
							<Textarea
								error={!!errors.aboutMe}
								minRows={2}
								maxRows={6}
								className={classes.textarea}
								defaultValue={undefined || ''}
								value={value || undefined}
								onChange={onChange}
								placeholder='Напишіть, які Ви файні'
							/>
							{errors.aboutMe &&
								<FormHelperText className={classes.errorText}>
									{errors.aboutMe.message}
								</FormHelperText>
							}
						</FormControl>
					)}
				/>
			</div>
		</div>
	)
}
