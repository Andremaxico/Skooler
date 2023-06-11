import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Control, FieldErrors, UseFormSetValue, UseFormTrigger, useForm } from 'react-hook-form';
import { AccountDataType } from '../../utils/types';
import { InitialsFields } from './Steps/InitialsFields';
import classes from './Registration.module.scss';
import { InfoFields } from './Steps/InfoFields';
import { SchoolFields } from './Steps/SchoolFields';
import { AppDispatchType, useAppDispatch } from '../../Redux/store';
import { loginDataReceived, myAccountDataReceived, sendMyAccountData } from '../../Redux/account/account-reducer';
import { LoginFields } from './Steps/LoginFields';
import { AvatarUpload } from './Steps/AvatarUpload/AvatarUpload';
import { useSelector } from 'react-redux';
import { selectMyUid } from '../../Redux/account/account-selectors';
import { FirebaseContext } from '../../main';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { AboutField } from './Steps/AboutField';
import { Welcoming } from './Steps/Welcoming';

type PropsType = {};

export type RegistrationFieldValues = AccountDataType & {
	avatar: FileList,
	name: string, 
	surname: string,
};

type ContextType = {
	errors: FieldErrors<RegistrationFieldValues>,
	trigger: UseFormTrigger<RegistrationFieldValues>,
	nextStep: () => void,
	control: Control<RegistrationFieldValues, any>,
	setValue:  UseFormSetValue<RegistrationFieldValues>,
}

//context for all steps
export const FormContext = createContext<ContextType | null>(null);

export const Registration: React.FC<PropsType> = ({}) => {
	//number of step
	const [step, setStep] = useState<number>(5);
	const { control, handleSubmit, reset, formState: {errors}, trigger, watch, setValue, register, getValues, getFieldState} = useForm<RegistrationFieldValues>();

	const dispatch: AppDispatchType = useAppDispatch();

	const formRef= useRef<HTMLFormElement>(null);
	const submit = () => {
		formRef.current?.submit();
	}

	//надсилання даних на сервер
	const onSubmit = async (data: AccountDataType) => {
		console.log('submit data', data);
		//another properties setting in redux
		dispatch(sendMyAccountData(data));
		//account register in firestore run after 1 step 
		//because we need new uid in 5 step(avatarupload )

	}

	useEffect(() => {
		console.log('errros changed in registration', errors);
	}, [errors.name]);

	//перейти на наступний крок
	const nextStep = () => setStep((currStep) => currStep + 1); //+1 to curr Step

	//step element
	let currStep: JSX.Element | null = null;

	switch (step) {
		case 0: 
			currStep = <LoginFields errors={errors} control={control} nextStep={nextStep} trigger={trigger}/>
			break;
		case 1:
			currStep = <InitialsFields errors={errors} control={control} nextStep={nextStep}/>
			break;
		case 2:
			currStep = <AboutField errors={errors} />
			break;
		case 3:
			currStep = <SchoolFields setValue={setValue} errors={errors} control={control} nextStep={nextStep} trigger={trigger}/>
			break;
		case 4:
			currStep = <AvatarUpload register={register} getValues={getValues} setValue={setValue} submit={submit} errors={errors}/>
			break;
		case 5:
			currStep = <Welcoming />
			break; 
	}

	return (
		<form ref={formRef} className={classes.Registration} onSubmit={handleSubmit(onSubmit)}>
			<FormContext.Provider value={{
				control, errors, nextStep, trigger, setValue
			}}>
				{currStep}
			</FormContext.Provider>
		</form>
	)
}
