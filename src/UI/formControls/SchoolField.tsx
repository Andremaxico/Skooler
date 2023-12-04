import Autocomplete from '@mui/joy/Autocomplete/Autocomplete';
import React, { useState } from 'react'
import { FieldErrors } from 'react-hook-form';
import { SchoolInfoType, SchoolOptionType, SchoolSearchItemType } from '../../utils/types';
import { searchSchool } from '../../Redux/account/account-reducer';

type PropsType = {
	error: string | undefined,
	setValue: (name: 'schoolInfo', value: SchoolInfoType) => void,
	inputValue?: string,
	value: any, //it's have any type, because Controller render={({field: {value : any}})}
};

export const SchoolField: React.FC<PropsType> = ({error, setValue, value, inputValue: initInputValue }) => {
	// const startValueForOptions = [{
	// 	name: value.label,
	// 	id: value.id,
	// }]

	//is user can search school
	const [open, setOpen] = useState<boolean>(false)
	//is schools fetching
	const [loading, setLoading] = useState<boolean>(false);
	//schools list
	const [schoolsOptions, setSchoolsOptions] = useState<SchoolOptionType[]>([]);
	const [inputValue, setInputValue] = useState<string>(initInputValue || '');

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

	return (
		<Autocomplete
			open={open}
			onOpen={() => {
				setOpen(true);
			}}

			onClose={() => {
				setOpen(false);
			}}
			
			error={!!error}

			options={schoolsOptions}
			getOptionLabel={(option) => option.name}
			
			noOptionsText={'Навчальних закладів не знайдено або спробуйте точніше'}
			loadingText='Завантаження...'
			placeholder='Шукайте тут'

			value={value}
			onChange={(e, value: SchoolOptionType) => {
				console.log('autocomplete value', value);
				if(value.id && value.name) {
					setValue('schoolInfo', {
						id: value.id,
						label: value.name,
					});
				}
			}}

			onInputChange={(e, value) => {
				//after blur we got 'undefined' value
				if(value === 'undefined') return;

				//when search changed -> get request to server	
				if(value.replace(' ', '').length > 2) {
					//we can`t await this, because user wants to input more symbols
					handleSearchChange(value);
				} else if(value.length < (inputValue?.length || 0)) {
					clearAutocomplete();
				}
				setInputValue(value);
			}}

			onBlur={handleBlur}
			inputValue={inputValue}
			loading={loading}  
		/>
	)
}
