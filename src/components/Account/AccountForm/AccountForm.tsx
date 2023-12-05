import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { ReceivedAccountDataType, SchoolInfoType, UpdatedAccountDataType } from '../../../utils/types';
import classes from './AccountForm.module.scss';
import { updateMyAccountData } from '../../../Redux/account/account-reducer';
import { useAppDispatch } from '../../../Redux/store';
import { FormHelperText } from '@mui/material';
import { Button, FormControl, FormLabel } from '@mui/joy';
import { SchoolField } from '../../../UI/formControls/SchoolField';
import { AvatarUpload } from '../../../UI/formControls/AvatarUpload';
import { ClassField } from '../../../UI/formControls/ClassField';
import { ABOUT_ME_MAX_LENGTH } from '../../../utils/constants';
import { AboutField } from '../../../UI/formControls/AboutField';

type PropsType = {
	accountData: ReceivedAccountDataType,
	setIsEdit: (value: boolean) => void,
};


export const AccountForm: React.FC<PropsType> = React.memo(({accountData, setIsEdit}) => {
	//use Form
	const { 
		register, handleSubmit, watch, formState: {errors},
		control, setValue
	} = useForm<UpdatedAccountDataType>();
	
	//prealoder під час відправки запиту
	const [isSending, setIsSending] = useState<boolean>(false)

	//current selected file in Avatar Upalod but not setted to form 
	const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);

	const { birthDate, name, surname, school } = accountData || {};

	const dispatch = useAppDispatch();

	//коли форма субітиться -> дані в staте -> дані на сервер
	const onSubmit = async (data: UpdatedAccountDataType) => {console.log('send data', accountData);
		setIsSending(true);
		await dispatch(updateMyAccountData(data));
		console.log('sended');

		//await dispatch(setMySchool(Number(id)));
		setIsSending(false);
		setIsEdit(false);
	}

	useEffect(() => {
		setValue('avatar', selectedFile);
	}, [selectedFile])

	return (
		// onFinish == onSubmit
		<>
			<form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
				<h2 className={classes.title}>Змінити дані профілю</h2>
				<div className={classes.body}>
					<div className={classes.top}>
						<div className={classes.avatar}>
							<AvatarUpload
								selectedFile={selectedFile}
								setSelectedFile={setSelectedFile}
								name={name}
								surname={surname}
								size={96}
								existingAvatarUrl={accountData.avatarUrl || undefined}
							/>
						</div>

						<div className={classes.textFields}>
							<Controller	
								control={control}
								name='schoolInfo'
								rules={{
									required: `Це поле є обов'язковим`,
									min: {value: 1, message: 'Тоді Ви ще не ходите в школу(1-12)'},
									max: {value: 12, message: 'Певно, Ви вже закінчили школу(1-12)'},
								}}
								defaultValue={{
									label: accountData.school.institution_name,
									id: +accountData.school.institution_id
								}}
								render={({field: {value}}) => (
									<FormControl error={!!errors.schoolInfo} required>
										<FormLabel>
											Навчальний заклад
										</FormLabel>

										<SchoolField 
											error={errors.schoolInfo?.message}
											setValue={(name: 'schoolInfo', value: SchoolInfoType) => {
												setValue(name, value);
											}}
											value={value}
											inputValue={value.label}
										/>
										<FormHelperText>
											{errors.schoolInfo?.message}
										</FormHelperText>
									</FormControl>
								)}
							/>		
							<Controller 
								control={control}
								name='class'
								defaultValue={accountData.class}
								render={({field: { value, onChange }}) => (
									<ClassField 
										error={errors.class?.message}
										onChange={onChange}
										value={value}
										required
									/>
								)}
							/>
						</div>
					</div>
					<Controller
						control={control}
						name='aboutMe'
						defaultValue={accountData.aboutMe || ''}
						rules={{
							maxLength: {value: ABOUT_ME_MAX_LENGTH, message: `Повинно бути менше ${ABOUT_ME_MAX_LENGTH} символів`}
						}}
						render={({field: {value, onChange  }}) => (
							<AboutField
								error={errors.aboutMe?.message}
								onChange={onChange}
								value={value}
							/>
						)}
					/>
				</div>
				<Button className={classes.submitBtn} type='submit'>
					Зберегти
				</Button>
			</form>
		</>	
	);

});