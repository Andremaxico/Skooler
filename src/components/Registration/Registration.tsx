import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Control, FieldErrors, UseFormSetError, UseFormSetValue, UseFormTrigger, useForm } from 'react-hook-form';
import { AccountDataType } from '../../utils/types';
import { InitialsFields } from './Steps/InitialsFields';
import classes from './Registration.module.scss';
import { InfoFields } from './Steps/InfoFields';
import { SchoolFields } from './Steps/SchoolFields';
import { AppDispatchType, useAppDispatch } from '../../Redux/store';
import { authActionStatusRemoved, authErrorRemoved, createAccountByEmail, loginDataReceived, myAccountDataReceived, removeAccount, sendMyAccountData } from '../../Redux/account/account-reducer';
import { LoginFields } from './Steps/LoginFields';
import { AvatarUpload } from './Steps/AvatarUpload/AvatarUpload';
import { useSelector } from 'react-redux';
import { selectAuthErrors, selectAuthedStatus, selectMyUid } from '../../Redux/account/account-selectors';
import { FirebaseContext } from '../../main';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { AboutField } from './Steps/AboutField';
import { Welcoming } from './Steps/Welcoming';
import { ActionStatus } from '../../UI/ActionStatus';
import { selectPrevPage } from '../../Redux/app/appSelectors';
import { useNavigate } from 'react-router-dom';
import { returnBtnShowStatusChanged } from '../../Redux/app/appReducer';

type PropsType = {};

export type RegistrationFieldValues = AccountDataType;

type ContextType = {
	errors: FieldErrors<RegistrationFieldValues>,
	trigger: UseFormTrigger<RegistrationFieldValues>,
	nextStep: () => void,
	control: Control<RegistrationFieldValues, any>,
	setValue:  UseFormSetValue<RegistrationFieldValues>,
	lastStep: number,
	currStep: number,
	setError: UseFormSetError<RegistrationFieldValues>,
	prevStep: () => void,
}

//context for all steps
export const FormContext = createContext<ContextType | null>(null);

export const Registration: React.FC<PropsType> = ({}) => {
	//number of step
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [step, setStep] = useState<number>(0);
	const { 
		control, handleSubmit, reset, formState: {errors}, 
		trigger, watch, setValue, register, getValues, 
		getFieldState, setError
	} = useForm<RegistrationFieldValues>();

	const authErrors = useSelector(selectAuthErrors);
	const prevPage = useSelector(selectPrevPage);
	const isAuthed = useSelector(selectAuthedStatus);

	const serverError = authErrors['register'];

	const dispatch: AppDispatchType = useAppDispatch();

	const navigate = useNavigate();

	const formRef= useRef<HTMLFormElement>(null);
	const submit = () => {
		formRef.current?.submit();
	}

	const lastStep = 4;

	useEffect(() => {
		//if we went to this page accidantly(we have authData) -> come back
		//it happens after first site's opening beacause we getting authData
		//and it cant load in the time
		console.log('is authed', isAuthed);
		if(isAuthed) {
			if(!prevPage || prevPage.includes('login')) {
				navigate('/', {replace: true});	
			} else {
				navigate(prevPage, {replace: true});
			}
		}
		setIsLoading(false);
	}, [isAuthed]);

	useEffect(() => {
		console.log('avatar value', watch('avatar'));
	}, [watch('avatar')]);

	//надсилання даних на сервер
	const onSubmit = async (data: AccountDataType) => {
		console.log('submit data', data);
		setIsLoading(true);
		//another properties setting in redux
		await dispatch(sendMyAccountData(data));
		setIsLoading(false);
		//account register in firestore run after 1 step 
		//because we need new uid in 5 step(avatarupload )

	}

	const clearAfterRegistration = () => {
		dispatch(authActionStatusRemoved('register'));
		dispatch(authErrorRemoved('register'));
		reset();
	}

	const cancelRegistration = () => {
		clearAfterRegistration();
		dispatch(removeAccount());
	}

	useEffect(() => {
		dispatch(returnBtnShowStatusChanged(false));
		return () => {
			clearAfterRegistration();
		}
	}, []);

	//перейти на наступний крок
	const nextStep = () => {
		if(!serverError) setStep((currStep) => currStep + 1);
	}; //+1 to curr Step

	//return to previous step
	const prevStep = () => {
		if(step > 0) setStep((currStep) => currStep - 1);
	}

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
			currStep = <InfoFields errors={errors} />
			break;
		case 4:
			currStep = <SchoolFields setValue={setValue} errors={errors} control={control} nextStep={nextStep} trigger={trigger}/>
			break;
		case 5:
			currStep = <AvatarUpload register={register} getValues={getValues} setValue={setValue} submit={submit} errors={errors}/>
			break;
		case 6:
			currStep = <Welcoming isLoading={isLoading} />
			break; 
	}

	return (
		<form ref={formRef} className={classes.Registration} onSubmit={handleSubmit(onSubmit)}>
			<FormContext.Provider value={{
				control, errors, nextStep, trigger, setValue,
				lastStep, currStep: step, setError, prevStep
			}}>
				{currStep}
				<ActionStatus 
					successText=''
					status={authErrors['register'] ? 'error' : null}
					errorText={authErrors['register']?.message}
				/>
			</FormContext.Provider>
		</form>
	)
}
