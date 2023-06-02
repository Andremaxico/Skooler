import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Control, FieldErrors, UseFormTrigger, useForm } from 'react-hook-form';
import { AccountDataType } from '../../utils/types';
import { InitialsFields } from './Steps/InitialsFields';
import classes from './Registration.module.scss';
import { InfoFields } from './Steps/InfoFields';
import { SchoolFields } from './Steps/SchoolFields';
import { AppDispatchType, useAppDispatch } from '../../Redux/store';
import { loginDataReceived } from '../../Redux/account/account-reducer';
import { LoginFields } from './Steps/LoginFields';
import { AvatarUpload } from './Steps/AvatarUpload/AvatarUpload';
import { useSelector } from 'react-redux';
import { selectMyUid } from '../../Redux/account/account-selectors';
import { FirebaseContext } from '../../main';
import { createUserWithEmailAndPassword } from 'firebase/auth';

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
}

//context for all steps
export const FormContext = createContext<ContextType | null>(null);

export const Registration: React.FC<PropsType> = ({}) => {
	//number of step
	const [step, setStep] = useState<number>(1);
	const { control, handleSubmit, reset, formState: {errors}, trigger, watch, setValue, register, getValues, getFieldState} = useForm<RegistrationFieldValues>();

	const dispatch: AppDispatchType = useAppDispatch();
	const uid = useSelector(selectMyUid);		
	const {auth} = useContext(FirebaseContext);

	const formRef= useRef<HTMLFormElement>(null);
	const submit = () => {
		formRef.current?.submit();
	}
	//TODO:
	//Delete this

	// //перетворення файлу аватара в посилання на нього
	// useEffect(() => {
	// 	console.log('uploadig file', getValues('avatar') ? getValues('avatar')[0] : undefined, 'uid', uid);

	// 	if(uid) {
	// 		dispatch(sendMyCurrentAvatar(getValues('avatar')[0], uid));
	// 	}

	// //@ts-ignore// капець із цим каллером !!!
	// }, [getValues('avatar')]);

	//надсилання даних на сервер
	const onSubmit = async (data: AccountDataType) => {
		console.log('submit data', data);
		//dispatch(accountDataReceived(data));
		//Реєстрація акаунту на базі

		if(auth) {
			try {
				const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
				const user = userCredential.user;
				console.log('user', user);
				dispatch(loginDataReceived(user));
			} catch (error: any) {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log('register error', errorMessage);
			}
		}
	}

	useEffect(() => {
		console.log('errros changed', errors);
	}, [errors.password]);

	//перейти на наступний крок
	const nextStep = () => setStep((currStep) => currStep + 1); //+1 to curr Step

	//step element
	let currStep: JSX.Element | null = null;

	switch (step) {
		case 0: 
			currStep = <LoginFields errors={errors} control={control} nextStep={nextStep} trigger={trigger}/>
			break;
		case 1:
			currStep = <InitialsFields control={control} nextStep={nextStep}/>
			break;
		case 2:
			currStep = <InfoFields errors={errors} control={control} nextStep={nextStep} />
			break;
		case 3:
			currStep = <SchoolFields setValue={setValue} errors={errors} control={control} nextStep={nextStep} trigger={trigger}/>
			break;
		case 4:
			currStep = <AvatarUpload register={register} getValues={getValues} setValue={setValue} submit={submit}/>
			break;
	}

	return (
		<form ref={formRef} className={classes.Registration} onSubmit={handleSubmit(onSubmit)}>
			<FormContext.Provider value={{
				control, errors, nextStep, trigger
			}}>
				{currStep}
			</FormContext.Provider>
		</form>
	)
}
