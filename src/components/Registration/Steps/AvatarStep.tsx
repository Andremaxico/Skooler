import React, { useState } from 'react';
import classes from './Steps.module.scss';
import { SaveBtn } from '../SaveBtn';
import { ReturnBtn } from '../ReturnBtn';
import { FieldErrors, SetFieldValue, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { RegistrationFieldValues } from '../Registration';
import { AvatarUpload } from '../../../UI/formControls/AvatarUpload';

type PropsType = {
	errors: FieldErrors<RegistrationFieldValues>,
	setValue: UseFormSetValue<RegistrationFieldValues>,
	getValues: UseFormGetValues<RegistrationFieldValues>,
}

export const AvatarStep: React.FC<PropsType> = ({errors, setValue, getValues}) => {
	const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);

	const [name, surname] = getValues('fullName').split(' ');

	//run after positive validiting in SaveBtn
	const handleSubmit = async () => {
		//set avatar to the firestore
		//we do it here, becouse in SaveBtn we must throw too many props
		if(selectedFile) {
			// console.log('send my current avatar');
			// setIsLoading(true);
			//dispatch(sendMyCurrentAvatar(selectedFile, uid));
			setValue('avatar', selectedFile);

			console.log('value of avatar setted', selectedFile);
		}
	}

	return (
		<div className={`${classes.AvatarStep} ${classes.Step}`}>
			<AvatarUpload 
				selectedFile={selectedFile}
				setSelectedFile={setSelectedFile}
				name={name}
				surname={surname}
			/>
			<div className={classes.buttons}>
				<ReturnBtn />
				<SaveBtn 
					errors={errors}
					fieldsNames={['avatar']}
					className={classes.saveBtn}
					onSubmitFunctions={[handleSubmit]}
					submit={true}
				/>
			</div>
		</div>
	)
}
