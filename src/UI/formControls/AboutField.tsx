import React, { ChangeEvent, ChangeEventHandler, useContext } from 'react';
import { FormControl, FormHelperText, FormLabel, Textarea } from '@mui/joy';
import aboutImg from '../../../assets/images/about_img.png';
import { Controller, FieldErrors } from 'react-hook-form';
import { SaveBtn } from '../../components/Registration/SaveBtn';
import { RegistrationFieldValues, FormContext } from '../../components/Registration/Registration';
import { ReturnBtn } from '../../components/Registration/ReturnBtn/ReturnBtn';

type PropsType = {
	error: string | undefined,
	value: string,
	onChange: ChangeEventHandler<HTMLTextAreaElement>,
};

export const AboutField: React.FC<PropsType> = ({error, value, onChange}) => {
	return (
		<FormControl
			className={'fieldWrapper'}
		>
			<FormLabel className={'fieldLabel'}>Про себе</FormLabel>
			<Textarea
				error={!!error}
				minRows={2}
				maxRows={6}
				className={'input'}
				defaultValue={undefined || ''}
				value={value || undefined}
				onChange={onChange}
				placeholder='Напишіть, які Ви файні'
			/>
			{error &&
				<FormHelperText className={'fieldErrorText'}>
					{error}
				</FormHelperText>
			}
		</FormControl>
	)
}
