import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import classes from './Steps.module.scss';
import studyImg from '../../../assets/images/study-icon.png';
import EastIcon from '@mui/icons-material/East';
import { Control, FieldErrors, Controller, UseFormTrigger, UseFormSetValue, useWatch } from 'react-hook-form';
import { RegistrationFieldValues } from '../Registration';
import { ControllerFieldType, SchoolInfoType, SchoolOptionType, SchoolSearchItemType } from '../../../utils/types';
import { searchSchool } from '../../../Redux/account/account-reducer';
import { SaveBtn } from '../SaveBtn';
import Autocomplete from '@mui/joy/Autocomplete/Autocomplete';
import { CircularProgress, FormControl, FormHelperText, FormLabel, Input, MenuItem, Select } from '@mui/joy';
import { ReturnBtn } from '../ReturnBtn/ReturnBtn';
import { SchoolField } from '../../../UI/formControls/SchoolField';
import { ClassField } from '../../../UI/formControls/ClassField';


type PropsType = {
	control: Control<RegistrationFieldValues, any>,
	errors: FieldErrors<RegistrationFieldValues>,
	trigger: UseFormTrigger<RegistrationFieldValues>,
	setValue: UseFormSetValue<RegistrationFieldValues>,
	nextStep: () => void,
};

export const SchoolFields: React.FC<PropsType> = ({control, errors, nextStep, trigger, setValue}) => {
	const schoolInfo = useWatch({
		control,
		name: 'schoolInfo',
	})

	//is user can search school
	const [open, setOpen] = useState<boolean>(false)
	//is schools fetching
	const [loading, setLoading] = useState<boolean>(false);
	//schools list
	const [schoolsOptions, setSchoolsOptions] = useState<SchoolOptionType[]>([]);
	const [inputValue, setInputValue] = useState<string>(schoolInfo?.label || '');

	const handleSearchChange = async (value: string) => {
		setLoading(true);
		//search string

		console.log('value of input', value, value.length);

		//get from db list of founded schools
		const foundedSchools: SchoolSearchItemType[] = await searchSchool(value);
		const schools: SchoolOptionType[] = foundedSchools.map(school => ({
			name: school.name,
			id: school.id,
		}));


		console.log('!!!!!!!schools', schools);

		//set founded schools to options
		setLoading(false);
		setSchoolsOptions(schools);
	}

	//because value of input after blur is 'undefined'
	const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
		console.log('inputValue after blur', inputValue);
		//if(inputValue === 'undefined') setInputValue(nu);
	}

	const clearAutocomplete = () => {
		console.log('clear autocomplete');
		setValue('schoolInfo', {id: -1, label: ''});
		setInputValue('');
		setSchoolsOptions([]);
		setLoading(false);
	}

	//we make this function because of difficulty about throwing setValue into ptops(typization)
	const setValueForSchoolField = (name: 'schoolInfo', value: SchoolInfoType) => {
		setValue(name, value);
	}

	useEffect(() => {
		console.log('input value changed:', inputValue);
	}, [inputValue])

	//for clearing school options after their async getting if input is empty
	//clearAutocomplete working before async getting
	useEffect(() => {
		console.log('schools changed', inputValue, inputValue?.length, inputValue?.replace(' ', '').length);
		if((
			(inputValue?.replace(' ', '').length || 0) < 3 
			|| inputValue === null)
			&& schoolsOptions.length > 0
		) {
			console.log('clear school options');
			setSchoolsOptions([]);
		}
	}, [schoolsOptions])

	return (
		<section className={classes.Step}>
			<h2 className={classes.title}>Де Ви вчитеся?</h2>
			<div className={classes.image}>
				<img src={studyImg} />
			</div>
			<div className={classes.form}>
				{/* Назва навчального закладу */}
				<Controller 
					control={control}
					name={'schoolInfo'}
					rules={{
						required: "Це поле є обов'язковим",
					}}
					render={({field: {value, onChange}} : ControllerFieldType) => (
						<FormControl className={classes.fieldWrapper} required>
							<FormLabel className={classes.label}>Заклад освіти</FormLabel>
							<SchoolField
								error={errors.schoolInfo?.message}
								setValue={setValueForSchoolField}
								value={value}
							/>
							{!!errors.schoolInfo && 
								<FormHelperText className={classes.errorText}>{errors.schoolInfo.message}</FormHelperText>
							}
						</FormControl>
					)}
				/>

				{/* Номер класу */}
				<Controller 
					control={control}
					name={'class'}
					rules={{
						required: "Це поле є обов'язковим",
						min: {value: 1, message: 'Рахуємо від 1'},
						max: {value: 11, message: 'Класів всього 11'},
					}}
					render={({field: {onChange, value}} : ControllerFieldType) => (
						<ClassField
							error={errors.class?.message}
							onChange={onChange}
							value={value}
						/>
					)}
				/>
			</div>
			<div className={classes.buttons}>
				<ReturnBtn />
				<SaveBtn 
					className={classes.btn} 
					errors={errors}
					fieldsNames={['schoolInfo', 'class']}
				/>
			</div>
		</section>
	)
}
