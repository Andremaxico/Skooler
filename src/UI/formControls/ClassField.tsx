import { FormControl, FormLabel, FormHelperText } from '@mui/joy';
import Input from '@mui/joy/Input';
import React from 'react';

type PropsType = {
	error: string | undefined,
	value: number,
	onChange: React.ChangeEventHandler<HTMLInputElement>,
	required?: boolean,
}

export const ClassField: React.FC<PropsType> = ({error, value, onChange, required}) => {
	console.log('value', value);
	return (
		<FormControl
			className={'fieldWrapper'}
			required={required}
		>
			<FormLabel htmlFor="classNum-select" className={'fieldLabel'}>Ваш теперішній клас</FormLabel>
			<Input 
				value={value}
				onChange={onChange}
				className={'input'}
				placeholder='Ваш клас'
				error={!!error}
				type='number'
			/>
			{!!error && 
				<FormHelperText className={'fieldErrorText'}>{error}</FormHelperText>
			}
		</FormControl>
	)
}
