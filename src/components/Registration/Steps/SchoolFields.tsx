import React, { ChangeEvent, useState } from 'react';
import classes from './Steps.module.scss';
import studyImg from '../../../assets/images/study-icon.png';
import EastIcon from '@mui/icons-material/East';
import { Control, FieldErrors, Controller, UseFormTrigger, UseFormSetValue } from 'react-hook-form';
import { RegistrationFieldValues } from '../Registration';
import { FormControl, TextField, IconButton, InputLabel, MenuItem, Select, Autocomplete, CircularProgress, FormHelperText } from '@mui/material';
import { ControllerFieldType, SchoolSearchItemType } from '../../../utils/types';
import { searchSchool } from '../../../Redux/account/account-reducer';
import { SaveBtn } from '../../../UI/SaveBtn';


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
	//@ts-ignore //хз, що тут робити, який інітіал валює поставити?
	const [schoolsOptions, setSchoolsOptions] = useState<SchoolOptionType[]>([{}]);

	const handleSearchChange = async (event: ChangeEvent<HTMLInputElement>) => {
		setLoading(true);
		//search string
		const value = event.target.value;

		//get from db list of founded schools
		const foundedSchools = await searchSchool(value);
		const schools: SchoolOptionType[] = foundedSchools.map(school => ({
			name: school.name,
			id: school.id,
		}));


		console.log('schools', schools);

		//set founded schools to options
		setSchoolsOptions(schools);
		setLoading(false);
	}

	//масив номерів класів
	const classesNums = [1, 2, 3, 4, 5, 6, , 8, 9, 10, 11];
	const classesOptions = classesNums.map(num => (
		<MenuItem value={num}>{num}</MenuItem>						
	))

	return (
		<section className={classes.Step}>
			<h2 className={classes.title}>Напишіть про себе</h2>
			<div className={classes.image}>
				<img src={studyImg} />
			</div>
			<div className={classes.form}>
				{/* Назва навчального закладу */}
				{/* @ts-ignore */}
				<Controller 
					control={control}
					name={'schoolId'}
					render={({field: {value, onChange}} : ControllerFieldType) => {
						console.log('school set value', value);
						return <FormControl 
							fullWidth 
							className={classes.fieldWrapper}
						>
							<Autocomplete
								sx={{ width: 300 }}
								open={open}
								onOpen={() => {
									setOpen(true);
								}}

								onClose={() => {
									setOpen(false);
								}}
								
								getOptionLabel={(option) => option.name}
								noOptionsText='Навчальних закладів не знайдено'
								loadingText='Завантаження...'
								options={schoolsOptions}
								value={value}
								onChange={(e, value) => {
									if(value.id) {
										setValue('schoolId', value.id);
									}
								}}
								loading={loading}
								renderInput={(params) => (
								<TextField
									{...params}
									label="Знайдіть Ваш навчальний заклад"
									onChange={handleSearchChange}
									error={!!errors.schoolId}
									InputProps={{
										...params.InputProps,
										endAdornment: (
										<React.Fragment>
											{loading ? <CircularProgress color="inherit" size={20} /> : null}
											{params.InputProps.endAdornment}
										</React.Fragment>
										),
									}}
								/>
								)}
							/>
							{!!errors.schoolId && <FormHelperText className={classes.errorText}>Помилка</FormHelperText>}
						</FormControl>
					}}
				/>

				{/* Номер класу */}
				{/* @ts-ignore */}
				<Controller 
					control={control}
					name={'class'}
					rules={{
						required: "Це поле є обов'язковим",
					}}
					render={({field: {onChange, value}} : ControllerFieldType) => (
						<FormControl
							className={classes.fieldWrapper}
							error={!!errors.schoolId}
						>
							<InputLabel id="classNum-select">Ваш клас</InputLabel>
							<Select
								labelId="classNum-select"
								value={value}
								label="Ваш клас"
								error={Boolean(errors.class)}
								onChange={onChange}
								>
									{classesOptions}
							</Select>
							{!!errors.class && <FormHelperText className={classes.errorText}>Помилка</FormHelperText>}
						</FormControl>
					)}
				/>
			</div>
			<SaveBtn onClick={nextStep} className={classes.btn} />
		</section>
	)
}
