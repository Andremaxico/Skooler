import React from 'react'
import { ReturnBtn } from '../ReturnBtn'
import { SaveBtn } from '../SaveBtn'
import classes from './Steps.module.scss';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { UpdatedAccountDataType } from '../../../utils/types';
import { AboutField } from '../../../UI/formControls/AboutField';
import { ABOUT_ME_MAX_LENGTH } from '../../../utils/constants';
import { RegistrationFieldValues } from '../Registration';

type PropsType = {
	errors: FieldErrors<UpdatedAccountDataType>,
	control: Control<RegistrationFieldValues, any>,
	
}

export const AboutStep: React.FC<PropsType> = ({errors, control}) => {

  return (
	 <div className={classes.Step}>
		<h2 className={classes.title}>Додайте більше інформації</h2>
		<Controller
			control={control}
			name='aboutMe'
			rules={{
				maxLength: {value: ABOUT_ME_MAX_LENGTH, message: `Повинно бути менше ${ABOUT_ME_MAX_LENGTH} символів`}
			}}
			render={({field: {value, onChange}}) => (
				<AboutField
					error={errors.aboutMe?.message}
					onChange={onChange}
					value={value || ''}
					className={classes.textarea}
				/>
			)}
		/>
		<div className={classes.buttons}>
			<ReturnBtn />
			<SaveBtn
				errors={errors}
				fieldsNames={['aboutMe']}
				className={classes.saveBtn}
			/>
	
		</div>
	 </div>
  )
}