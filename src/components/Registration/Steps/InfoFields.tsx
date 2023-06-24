import React, { useContext } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { FormContext, RegistrationFieldValues } from '../Registration';
import classes from './Steps.module.scss';
import aboutImg from '../../../assets/images/about_img.png';
import { FormControl, FormHelperText, FormLabel, IconButton, Input, Radio, RadioGroup, TextField, Textarea } from '@mui/joy';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EastIcon from '@mui/icons-material/East';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { SaveBtn } from '../SaveBtn';
import { DateValidationError } from '@mui/x-date-pickers/models';
import { ReturnBtn } from '../ReturnBtn/ReturnBtn';


type PropsType = {
	errors: FieldErrors<RegistrationFieldValues>,
};

export const InfoFields: React.FC<PropsType> = ({errors}) => {
	const { nextStep, control, setError } = useContext(FormContext) || {};

	const fiveYearsAgo = dayjs().set('year', dayjs().year() - 5);

	const handleError = (error: DateValidationError) => {
		console.log('error', error);  
		if(setError) setError('birthDate', {
			type: 'max', 
			message: `Вам повинно бути більше чотирьох років`
		});
	}

	return (
		<div className={classes.Step}>
			<h2 className={classes.title}>Напишіть про себ е</h2>
			<div className={classes.image}>
				<img src={aboutImg} />
			</div>
			<div className={classes.form}>
				<Controller 
					control={control}
					name={'birthDate'}
					rules={{
						
					}}
					render={({field: {value, onChange}}) => (
						<FormControl
							className={classes.fieldWrapper}
						>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker 
									value={value}
									onChange={onChange}
									onError={handleError}
									disableFuture
									defaultValue={fiveYearsAgo }
									maxDate={fiveYearsAgo}
									label='Дата народження'
								/>
							</LocalizationProvider>
						</FormControl>
					)}
				/>

				<Controller 
					control={control}
					name={'gender'}
					rules={{
						required: "Це поле є обов'язковим",
					}}
					render={({field: {value, onChange}}) => (
						<FormControl
							className={classes.fieldWrapper}
						>
							<FormLabel className={classes.label}>Ваша стать</FormLabel>
							<RadioGroup 
								value={value} 
								onChange={onChange} 
								name="gender-radio-group"
								className={classes.radioGroup}
							>
								<Radio value="male" label="Чоловік" className={classes.radio}/>
								<Radio value="female" label="Жінка" className={classes.radio}/>
							</RadioGroup>
							{errors.gender &&
								<FormHelperText className={classes.errorText}>
									{errors.gender.message}
								</FormHelperText>
							}
						</FormControl>
					)}
				/>
			</div>
			<div className={classes.buttons}>
				<ReturnBtn />
				<SaveBtn
					errors={errors}
					fieldsNames={['birthDate']}
					className={classes.saveBtn}
				/>
			</div>
		</div>
	)
}  
