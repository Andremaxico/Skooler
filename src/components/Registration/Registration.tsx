import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Control, FieldErrors, UseFormSetError, UseFormSetValue, UseFormTrigger, useForm } from 'react-hook-form';
import { AccountDataType } from '../../utils/types';
import { InitialsFields } from './Steps/InitialsFields';
import classes from './Registration.module.scss';
import { InfoFields } from './Steps/InfoFields';
import { SchoolFields } from './Steps/SchoolFields';
import { AppDispatchType, useAppDispatch } from '../../Redux/store';
import { authActionStatusRemoved, authErrorRemoved, createAccountByEmail, logOut, loginDataReceived, myAccountDataReceived, removeAccount, sendMyAccountData } from '../../Redux/account/account-reducer';
import { LoginFields } from './Steps/LoginFields';
import { AvatarUpload } from './Steps/AvatarUpload/AvatarUpload';
import { useSelector } from 'react-redux';
import { selectAuthActionsStatuses, selectAuthErrors, selectAuthedStatus, selectMyAccountData, selectMyUid } from '../../Redux/account/account-selectors';
import { FirebaseContext } from '../../main';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { AboutField } from './Steps/AboutField';
import { Welcoming } from './Steps/Welcoming';
import { ActionStatus } from '../../UI/ActionStatus';
import { selectPrevPage } from '../../Redux/app/appSelectors';
import { useNavigate } from 'react-router-dom';
import { returnBtnShowStatusChanged } from '../../Redux/app/appReducer';
import { EmailField } from './Steps/EmailField';
import { EmailVerirficationField } from './Steps/EmailVerirficationField';
import { createPortal } from 'react-dom';
import { CancelRegistrationBtn } from './CancelRegistrationBtn';
import e from 'express';
import { Modal } from '../../UI/Modal';
import { Button } from '@mui/joy';
import { CancelConfirmModal } from './CancelConfirmModal';

type PropsType = {};

export type RegistrationFieldValues = AccountDataType & {
	emailCode: number,
};

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

const headerAccountLink = document.getElementById('headerAccountLink');

export const Registration: React.FC<PropsType> = ({}) => {
	//number of step
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [step, setStep] = useState<number>(0);
	const [headerAccountLink, setHeaderAccountLink] = useState<HTMLElement | null>(null);
	const [isCancelModalShow, setIsCancelModalShow] = useState<boolean>(false);
	const { 
		control, handleSubmit, reset, formState: {errors}, 
		trigger, watch, setValue, register, getValues, 
		getFieldState, setError
	} = useForm<RegistrationFieldValues>();

	const authErrors = useSelector(selectAuthErrors);
	const authActionsStatuses = useSelector(selectAuthActionsStatuses);
	const prevPage = useSelector(selectPrevPage);
	const isAuthed = useSelector(selectAuthedStatus);
	const myAccountData = useSelector(selectMyAccountData);

	const serverError = authErrors['register'];
	const actionStatus = authActionsStatuses['register'];

	const dispatch: AppDispatchType = useAppDispatch();

	const navigate = useNavigate();

	const formRef= useRef<HTMLFormElement>(null);
	const submit = () => {
		formRef.current?.submit();
	}

	const lastStep = 4;

	console.log('header accouynt link', headerAccountLink);

	useEffect(() => {
		//if we went to this page accidantly(we have authData) -> come back
		//it happens after first site's opening beacause we getting authData
		//and it cant load in the time
		console.log('is authed', isAuthed);
		if(isAuthed && myAccountData) {
			if(!prevPage || prevPage.includes('login')) {
				navigate('/', {replace: true});	
			} else {
				navigate(prevPage, {replace: true});
			}
		}
		setIsLoading(false);
	}, [isAuthed]);

	//get accountLink emement in header for portal
	useEffect(() => {
		const el = document.getElementById('headerAccountLink');

		if(el) {
			setHeaderAccountLink(el);
		}
	}, [document.getElementById('headerAccountLink')]);

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

	const closeModal = () => {
		setIsCancelModalShow(false);
	}

	const clearAfterRegistration = () => {
		dispatch(authActionStatusRemoved('register'));
		dispatch(authErrorRemoved('register'));
		reset();
	}

	const cancelRegistration = async () => {
		clearAfterRegistration();
		closeModal();
		await dispatch(removeAccount());
		navigate(prevPage || '/');
	}

	useEffect(() => {
		//TODO:
		//delete this
		dispatch(logOut());

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
			currStep = <LoginFields errors={errors} />
			break;
		case 1:
			currStep = <EmailVerirficationField errors={errors}/>
			break;
		case 2:
			currStep = <InitialsFields errors={errors} />
			break;
		case 3:
			currStep = <AboutField errors={errors} />
			break;
		case 4:
			currStep = <InfoFields errors={errors} />
			break;
		case 5:
			currStep = <SchoolFields setValue={setValue} errors={errors} control={control} nextStep={nextStep} trigger={trigger}/>
			break;
		case 6:
			currStep = <AvatarUpload register={register} getValues={getValues} setValue={setValue} submit={submit} errors={errors}/>
			break;
		case 7:
			currStep = <Welcoming isLoading={isLoading} />
			break; 
	}

	useEffect(() => {
		console.log('curr auth action status', actionStatus);
	}, [actionStatus]);
	return (
		<form ref={formRef} className={classes.Registration} onSubmit={handleSubmit(onSubmit)}>
			<FormContext.Provider value={{
				control, errors, nextStep, trigger, setValue,
				lastStep, currStep: step, setError, prevStep
			}}>
				{currStep}
				<ActionStatus 
					successText=''
					status={serverError ? 'error' : null}
					errorText={serverError?.message}
				/>
				{headerAccountLink && createPortal(
					<CancelRegistrationBtn
						setIsCancelModalShow={setIsCancelModalShow}
					/>,
					headerAccountLink
				)}
				<CancelConfirmModal 
					isShow={isCancelModalShow}
					closeModal={closeModal}
					cancelRegistration={cancelRegistration}
				/>
			</FormContext.Provider>
		</form>
	)
}
