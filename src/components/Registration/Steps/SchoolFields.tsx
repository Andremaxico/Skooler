import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import classes from './Steps.module.scss';
import studyImg from '../../../assets/images/study-icon.png';
import EastIcon from '@mui/icons-material/East';
import { Control, FieldErrors, Controller, UseFormTrigger, UseFormSetValue } from 'react-hook-form';
import { RegistrationFieldValues } from '../Registration';
import { ControllerFieldType, SchoolSearchItemType } from '../../../utils/types';
import { searchSchool } from '../../../Redux/account/account-reducer';
import { SaveBtn } from '../SaveBtn';
import Autocomplete from '@mui/joy/Autocomplete/Autocomplete';
import { CircularProgress, FormControl, FormHelperText, FormLabel, Input, MenuItem, Select } from '@mui/joy';


type PropsType = {
	control: Control<RegistrationFieldValues, any>,
	errors: FieldErrors<RegistrationFieldValues>,
	trigger: UseFormTrigger<RegistrationFieldValues>,
	setValue: UseFormSetValue<RegistrationFieldValues>,
	nextStep: () => void,
};

export type SchoolOptionType = {
	id: number,
	name: string,
};

export const SchoolFields: React.FC<PropsType> = ({control, errors, nextStep, trigger, setValue}) => {
	//is user can search school
	const [open, setOpen] = useState<boolean>(false)
	//is schools fetching
	const [loading, setLoading] = useState<boolean>(false);
	//schools list
	const [schoolsOptions, setSchoolsOptions] = useState<SchoolOptionType[]>([]);
	const [inputValue, setInputValue] = useState<string | null>(null);

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
		setValue('schoolId', -1);
		setInputValue(null);
		setSchoolsOptions([]);
		setLoading(false);
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

	//масив номерів класів
	const classesNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	const classesOptions = classesNums.map(num => (
		<MenuItem>{num}</MenuItem>						
	))

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
					name={'schoolId'}
					rules={{
						required: "Це поле є обов'язковим",
					}}
					render={({field: {value, onChange}} : ControllerFieldType) => (
							<FormControl className={classes.fieldWrapper} required>
								<FormLabel className={classes.label}>Заклад освіти</FormLabel>
								<Autocomplete
									open={open}
									onOpen={() => {
										setOpen(true);
									}}

									onClose={() => {
										setOpen(false);
									}}
									
									getOptionLabel={(option) => option.name}
									noOptionsText={'Навчальних закладів не знайдено або спробуйте точніше'}
									loadingText='Завантаження...'
									placeholder='Шукайте тут'

									options={schoolsOptions}
									value={value}
									onChange={(e, value) => {
										if(value.id) {
											setValue('schoolId', value.id);
										}
									}}
									onInputChange={(e, value) => {
										console.log(value, typeof value);
										//after blur we got 'undefined' value
										if(value === 'undefined') return;

										if(value.replace(' ', '').length > 2) {
											handleSearchChange(value);
										} else if(value.length < (inputValue?.length || 0)) {
											clearAutocomplete();
										}
										setInputValue(value);
									}}
									onBlur={handleBlur}
									inputValue={inputValue || ''}
									loading={loading}  
								/>
								{!!errors.schoolId && 
									<FormHelperText className={classes.errorText}>{errors.schoolId.message}</FormHelperText>
								}
							</FormControl>
						)
					}
				/>

				{/* Номер класу */}
				{/* @ts-ignore */}
				<Controller 
					control={control}
					name={'class'}
					rules={{
						required: "Це поле є обов'язковим",
						min: {value: 1, message: 'Рахуємо від 1'},
						max: {value: 11, message: 'Класів всього 11'},
					}}
					render={({field: {onChange, value}} : ControllerFieldType) => (
						<FormControl
							className={classes.fieldWrapper}
							required
						>
							<FormLabel htmlFor="classNum-select" className={classes.label}>Ваш клас</FormLabel>
							<Input 
								value={value}
								onChange={onChange}
								className={classes.input}
								placeholder='Ваш клас'
								error={!!errors.schoolId}
								type='number'
							/>
							{!!errors.class && 
								<FormHelperText className={classes.errorText}>{errors.class.message}</FormHelperText>
							}
						</FormControl>
					)}
				/>
			</div>
			<SaveBtn 
				className={classes.btn} 
				errors={errors}
				fieldsNames={['class', 'schoolId']}
			/>
		</section>
	)
}
