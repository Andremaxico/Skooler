import React, { useContext } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { FormContext, RegistrationFieldValues } from '../Registration';
import classes from './Steps.module.scss';
import aboutImg from '../../../assets/images/about_img.png';
import { FormControl, FormHelperText, FormLabel, IconButton, Input, Radio, RadioGroup, TextField, Textarea } from '@mui/joy';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EastIcon from '@mui/icons-material/East';
import dayjs, { Dayjs } from 'dayjs';
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
	const { nextStep, control, setError, setValue } = useContext(FormContext) || {};

	const fiveYearsAgo = dayjs().set('year', dayjs().year() - 5);
	const twentyYearsAgo = dayjs().set('year', dayjs().year() - 20);

	const handleError = (error: DateValidationError) => {
		console.log('error', error);  
		if(setError) {
			if(error === 'minDate') {
				setError('birthDate', {
					type: 'max', 
					message: `Вам повинно бути менше 20 років`
				});
			} else if(error === 'maxDate') {
				setError('birthDate', {
					type: 'max', 
					message: `Вам повинно бути більше чотирьох років`
				});
			}
		} 
	}

	return (
		<div className={classes.Step}>
			<h2 className={classes.title}>Давайте познайомимося ближче</h2>
			<div className={classes.image}>
				<img src={aboutImg} />
			</div>
			<div className={classes.form}>
				<Controller 
					control={control}
					name={'birthDate'}
					rules={{
						required: `Це поле є обов'язковим`
					}}
					render={({field: {value, onChange}}) => (
						<FormControl
							className={classes.fieldWrapper}
						>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker 
									value={value}
									onChange={(value: Dayjs | null) => {
										if(value && setValue) setValue('birthDate', value)
									}}
									onError={handleError}
									disableFuture
									maxDate={fiveYearsAgo}
									minDate={twentyYearsAgo}
									label='Дата народження'
								/>
							</LocalizationProvider>
							<FormHelperText className={'fieldErrorText'}>{errors.birthDate?.message}</FormHelperText>
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
