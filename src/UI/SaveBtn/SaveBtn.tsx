import React, {useContext, useEffect, useState} from 'react';
import classes from './SaveBtn.module.scss';
import EastIcon from '@mui/icons-material/East';
import cn from 'classnames';
import { IconButton } from '@mui/joy';
import { FieldErrors, UseFormTrigger } from 'react-hook-form';
import { FormContext, RegistrationFieldValues } from '../../components/Registration/Registration';

type KeysType = keyof RegistrationFieldValues;

type PropsType = {
	className?: string,
	errors: FieldErrors<RegistrationFieldValues>,
	fieldsNames: Array<KeysType>,
}

export const SaveBtn: React.FC<PropsType> = ({className,fieldsNames, errors}) => {
	// we use trigger and nextStep, because they dont changing
	const {trigger, nextStep} = useContext(FormContext) || {};

	console.log('errors', errors, 'trigger', !!trigger, 'nextStep', !!nextStep);



	const [isValid, setIsValid] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isTriggerred, setIsTriggerred] = useState<boolean>(false);


	useEffect(() => { 
		console.log('errors', errors);

		let isError: boolean = false;

		fieldsNames.forEach(name => {
			console.log('errors', errors);

			if(errors) {
				isError = !!errors[name];
			}
			console.log('is error', isError);
		});

		if(!isError) {
			console.log('change validity true');
			setIsValid(true);
		} else {
			console.log('change validity false');
			setIsValid(false);
		}
	}, [errors?.password, errors?.email]);

	//if isValid -> nextStep
	const checkValidity = () => {
		console.log('is valid', isValid);
		if(isValid && nextStep) nextStep();
	}

	//if we are submitting and isValid changed -> checkValidity and submit
	useEffect(() => {
		console.log('isSubmitting', isSubmitting);
		if(isSubmitting) {
			setIsSubmitting(false);
			checkValidity();
		}
	}, [isValid]);

	const handleSubmit = async () => {
		console.log('is triggered', isTriggerred);
		if(!isTriggerred && trigger) {
			setIsSubmitting(true);
			for(let i = 0; i < fieldsNames.length; i++) {
				await trigger(fieldsNames[i]);
			}
			setIsTriggerred(true);
		} else {
			checkValidity();
		}
	}


	// const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
	// 	e.preventDefault();
	// 	console.log('disabled', disabled);
	// 	if(!disabled) {
	// 		onClick();
	// 	} else {
	// 		//треба анімашку намутити  
	// 	}
	// }

	console.log('savebtn rerender');

	return (
		<button className={cn(classes.SaveBtn, className)} onClick={handleSubmit} disabled={!isValid}>
			<span>Зберегти</span>
			<IconButton color='warning' className={classes.iconWrapper}>
				<EastIcon color='primary' className={classes.icon} />
			</IconButton>
		</button>
	)
}
