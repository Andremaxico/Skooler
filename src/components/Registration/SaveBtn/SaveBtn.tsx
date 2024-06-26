import React, {useContext, useEffect, useState} from 'react';
import classes from './SaveBtn.module.scss';
import EastIcon from '@mui/icons-material/East';
import cn from 'classnames';
import { IconButton } from '@mui/joy';
import { FieldErrors, UseFormTrigger, useWatch } from 'react-hook-form';
import { FormContext, RegistrationFieldValues } from '../Registration';
import { useAppDispatch } from '../../../Redux/store';
import { authActionStatusRemoved, authActionStatusUpdated, authErrorRemoved, createAccountByEmail, sendEmailVerificationLink } from '../../../Redux/account/account-reducer';
import { useSelector } from 'react-redux';
import { selectAuthActionsStatuses, selectAuthErrors, selectMyLoginData } from '../../../Redux/account/account-selectors';

type KeysType = keyof RegistrationFieldValues;

//for preventing errors mixing and overlapping
//onSubmitFunctions - array,
//every function -> await -> status chnaged -> success -> next function

type PropsType = {
	className?: string,
	errors: FieldErrors<RegistrationFieldValues>,
	fieldsNames: Array<KeysType>,
	isSubmit?: boolean,
	waitForAction?: boolean, //if we dispatching thunk that have validation out of form
	onSubmitFunctions?: Array<() => Promise<void>>, //after click on btn, while validation
	onValid?: (() => Promise<void>) | (() => void), //after positive validation
}

export const SaveBtn: React.FC<PropsType> = ({className, fieldsNames, errors, isSubmit, onSubmitFunctions, onValid, waitForAction}) => {
	//we set null as a initial value of valid status 
	//for effect with isValid dependency work for the first time
	const [isValid, setIsValid] = useState<boolean | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isTriggerred, setIsTriggerred] = useState<boolean>(false);
	const [currSubmitIndex, setCurrSubmitIndex] = useState<number>(0);
	//to prevent double function call if action status changes
	const [isOnValidFuncCalled, setIsOnValidFuncCalled] = useState<boolean>(false);

	// we use trigger and nextStep, because they are static
	const { 
		trigger, nextStep, control, setValue, submit
	} = useContext(FormContext) || {};
	//const [errorsDeps, setErrorsDeps] = useState(second)

	const authErrors = useSelector(selectAuthErrors);
	const actionsStatuses = useSelector(selectAuthActionsStatuses);
	const loginData = useSelector(selectMyLoginData);

	const serverError = authErrors['register'];
	const actionStatus = actionsStatuses['register'];

	//its for error following and valid status change 
	let errorsDeps = fieldsNames.map(name => errors[name]);

	const values = useWatch({
		control,
		name: fieldsNames,
	});

	const dispatch = useAppDispatch();

	const increaseSubmitIndex = () => setCurrSubmitIndex(i => i + 1);
	const decreaseSubmitIndex = () => setCurrSubmitIndex(i => i > 0 ? i - 1 : i); 

	const getCurrentSubmitFunc = () => {
		return onSubmitFunctions ? onSubmitFunctions[currSubmitIndex] : undefined;
	}

	const clearStatus = () => {
		dispatch(authActionStatusRemoved('register'));
		dispatch(authErrorRemoved('register'));
	}

	const endSubmit = () => {
		if(onValid) onValid();
		clearStatus();
		if(isSubmit) {
			if(!!submit) submit();
		} else {
			console.log('end submit');
			if(nextStep) nextStep();
		}
	}

	//set is valid after errors changing
	useEffect(() => { 
		let isError: boolean = false;

		//we check errors by fieldsNames
		fieldsNames.forEach(name => {
			if(errors) {
				isError = !!errors[name];
			}
		});

		if(isTriggerred) {
			if(!isError) {
				console.log('set is valid', true);
				setIsValid(true);
			} else {
				setIsValid(false);
			}
		}
	}, [errorsDeps]);

	//if we are submitting and isValid changed -> checkValidity and submit
	useEffect(() => {
		console.log('vaditity chnaged', isSubmitting, isValid);
		if(isSubmitting) {
			setIsSubmitting(false);
			checkValidity();
		}
	}, [isValid]);

	useEffect(() => {
		if(trigger && isTriggerred) trigger(fieldsNames);
	}, [values, isTriggerred])

	//if isValid -> nextStep
	const checkValidity = async () => {
		if(isValid && nextStep) {
			//we turned off submit
			//have to set values manually
			for (let i = 0; i < fieldsNames.length; i++) {
				//values - array based on fieldsNames, so order is right
				//setValue can be null
				if(setValue) {
					setValue(fieldsNames[i], values[i]);
				}
			}

			//if it is end step
			//we first check server errors 
			//then submitting if we havent next function

			//here we un only first func
			//rest after actionStatus change
			const currOnSubmitFunc = getCurrentSubmitFunc();
			console.log('currsubmitIndex', currSubmitIndex, currOnSubmitFunc, onSubmitFunctions ? onSubmitFunctions[0] : null);
			if(currSubmitIndex == 0 && currOnSubmitFunc) {
				console.log('curr on submit func', currOnSubmitFunc);
				increaseSubmitIndex();
				await currOnSubmitFunc();
			}
			//if we have waitForActtion = true
			//so we  waiting for some async function
			//and in the end it must set new action status
			if(!waitForAction) {
				endSubmit();
			}
		};
	} 

	//when we submit login fields and register new accocunt
	//we can have an error
	//and then we cant do nextStep();
	//but in submit function we always havent an error
	// generally, this is the fuse
	useEffect(() => {
		console.log('action status', actionStatus, waitForAction, isOnValidFuncCalled, isValid);

		if((actionStatus === 'success' || isValid) && waitForAction && !isOnValidFuncCalled) {
			if(onValid) {
				(async () => {
					console.log('on valid finction call', onValid);
					//setIsOnValidFuncCalled(true);
					increaseSubmitIndex();
					await onValid();
				})();
				endSubmit();
				console.log('on valid func called');
				setIsOnValidFuncCalled(true);
			}
		} else if(actionStatus === 'error') {
			setCurrSubmitIndex(0);
		}
	//need to change use action status in all actions that can cause an error
	}, [actionStatus, serverError, isValid]);

	useEffect(() => {
		if(actionStatus === 'error') {
			//2s - time for actionStatus hide
			//if user entered invalid data again
			//actionStatus dont showing because status(error) dont changing
			//to solvwe this error we removing status for his updating
			setTimeout(() => {
				clearStatus();
			}, 2000);
		}
	}, [actionStatus]);

	useEffect(() => {
		return () => {
			console.log('destroy submit btn');
			clearStatus();
		}
	}, []);

	const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		//we cant check validity from first time
		//beacause validity status cant update in time
		//so from first we set submitting and triggering
		//for the next times we triggering after every update in inputs
		console.log('is trihggered', isTriggerred);
		if(!isTriggerred && trigger) {
			setIsSubmitting(true);
			setIsTriggerred(true);
		} else {
			debugger;
			checkValidity();
		}

		e.preventDefault();
	}

	return (
		<div className={cn(classes.SaveBtn, className)}>
			<span>{isSubmit ? 'Завершити реєстрацію' : 'Зберегти'}</span>
			<IconButton
				className={classes.iconBtn} 
				onClick={handleClick} 
				type={'button'} 
				disabled={actionStatus === 'loading'}
			>
				<EastIcon color='primary' className={classes.icon} />
			</IconButton>
		</div>
	)
}
