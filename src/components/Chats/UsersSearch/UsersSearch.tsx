import { IconButton } from '@mui/joy';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import classes from './UsersSearch.module.scss';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Autocomplete from '@mui/joy/Autocomplete';
import { usersAPI } from '../../../api/usersApi';
import { useNavigate } from 'react-router-dom';

type PropsType = {};
type FieldValues = {
	query: string,
}

type OptionsType = {
	uid: string, 
	fullName: string,
}
export const UsersSearch: React.FC<PropsType> = ({}) => {
	const { control, watch, handleSubmit } = useForm<FieldValues>(); 
	const [ loading, setLoading ] = useState<boolean>(false);
	const [options, setOptions] = useState<OptionsType[]>([]);
	const [inputValue, setInputValue] = useState<string>('');

	//for navigate to found user account 
	const navigate = useNavigate();

	const handleInputChange = (event: any, value: string) => {
		setInputValue(value)
	}

	const onSubmit = (data: FieldValues) => {
		console.log('submit');
		setOptionsByQuery(data.query);
	}

	//qury -> server -> options
	const setOptionsByQuery = async (query: string | null) => {
		if(query) {
			setLoading(true);
			const newUsers = await usersAPI.getUsersByQuery(query);
			setLoading(false);
			if(newUsers) {
				setOptions(newUsers.map(data => ({
					fullName: data.fullName,
					uid: data.uid,
				})));
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
							inputValue={inputValue}
							freeSolo
							loading={loading}
							loadingText={'Пошук...'}
							//@ts-ignore
							isOptionEqualToValue={(option, value) => option.fullName === value.fullName}
							//@ts-ignore //не дає доступу до fullName  
							getOptionLabel={(option) => option.fullName}
							onChange={(event, value) => {
								//@ts-ignore
								navigate(`/account/${value.uid}`);
							}}
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
