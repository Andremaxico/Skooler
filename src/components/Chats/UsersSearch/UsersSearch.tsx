import { IconButton, Input } from '@mui/joy';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import classes from './UsersSearch.module.scss';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import cn from 'classnames';
import Autocomplete from '@mui/joy/Autocomplete';
import { usersAPI } from '../../../api/usersApi';

type PropsType = {};
type FieldValues = {
	query: string,
}

export const UsersSearch: React.FC<PropsType> = ({}) => {
	const { control } = useForm<FieldValues>(); 
	const [loading, setLoading] = useState<boolean>(false);

	let options: string[] = [];
	
	const handleChange = async (value: string) => {
		setLoading(true);
		const newUsers = await usersAPI.getUsersByQuery(value);
		console.log('new users', newUsers);
		setLoading(false);
		options = newUsers.map(data => data.fullName);
	}

	return (
		<div className={classes.UsersSearch}>
			<h3 className={classes.title}>Знайдіть нових співрозмовників</h3>
			<form className={classes.form}>
				<Controller 
					control={control}
					name={'query'}
					render={({field: {value, onChange}}) => (
						<Autocomplete
							options={options} 
							className={classes.input}
							onKeyDown={() => handleChange(value)}
							value={value}
							freeSolo
							loading={loading}
							loadingText={'Пошук...'}
							onChange={onChange}
							placeholder='Шукайте тут'
							endDecorator={
								<IconButton className={classes.iconBtn}>
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
