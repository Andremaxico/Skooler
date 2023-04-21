import { IconButton } from '@mui/joy';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import classes from './UsersSearch.module.scss';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Autocomplete from '@mui/joy/Autocomplete';
import { usersAPI } from '../../../api/usersApi';

type PropsType = {};
type FieldValues = {
	query: string,
}

export const UsersSearch: React.FC<PropsType> = ({}) => {
	const { control, watch, handleSubmit } = useForm<FieldValues>(); 
	const [ loading, setLoading ] = useState<boolean>(false);
	const [options, setOptions] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState<string>('');

	const handleInputChange = (event: any, value: string) => {
		setInputValue(value)
	}

	const onSubmit = (data: FieldValues) => {
		console.log('submit');
		setOptionsByQuery(data.query);
	}

	//qury -> server -> options
	const setOptionsByQuery = async (query: string | null) => {
		console.log('query', query);
		if(query) {
			setLoading(true);
			const newUsers = await usersAPI.getUsersByQuery(query);
			console.log('new users', newUsers);
			setLoading(false);
			if(newUsers) {
				setOptions(newUsers.map(data => data.fullName));
				console.log('options', options);
			}           
		}
	}

	//if query changed -> change options
	useEffect(() => {
		console.log('query changed');
		if(inputValue) {
			setOptionsByQuery(inputValue);
		}
	}, [inputValue]);

	return (
		<div className={classes.UsersSearch}>
			<h3 className={classes.title}>Знайдіть нових співрозмовників</h3>
			<form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
				<Controller 
					control={control}
					name={'query'}
					render={({field: {value, onChange}}) => (
						<Autocomplete
							options={options} 
							className={classes.input}
							value={value}
							inputValue={inputValue}
							freeSolo
							loading={loading}
							loadingText={'Пошук...'}
							onChange={onChange}
							onInputChange={handleInputChange}
							placeholder={`І'мя та прізвище`}
							endDecorator={
								<IconButton className={classes.iconBtn} type='submit'>
									<SearchRoundedIcon className={classes.icon} />
								</IconButton>
							}
						/>
					)}
				/>
			</form>
		</div>
	)
}
