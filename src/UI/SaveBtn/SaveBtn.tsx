import React, {useContext, useEffect, useState} from 'react';
import classes from './SaveBtn.module.scss';
import EastIcon from '@mui/icons-material/East';
import cn from 'classnames';
import { IconButton } from '@mui/joy';
import { FieldErrors, UseFormTrigger, useWatch } from 'react-hook-form';
import { FormContext, RegistrationFieldValues } from '../../components/Registration/Registration';

type KeysType = keyof RegistrationFieldValues;

type PropsType = {
	className?: string,
	errors: FieldErrors<RegistrationFieldValues>,
	fieldsNames: Array<KeysType>,
}

export const SaveBtn: React.FC<PropsType> = ({className,fieldsNames, errors}) => {
	// we use trigger and nextStep, because they dont changing
	const {trigger, nextStep, control} = useContext(FormContext) || {};
	//const [errorsDeps, setErrorsDeps] = useState(second)

	let errorsDeps = fieldsNames.map(name => errors[name]);

	const values = useWatch({
		control,
		name: fieldsNames
	});

	console.log('use watch value', values);

	console.log('errors', errors, 'trigger', !!trigger, 'nextStep', !!nextStep);

	console.log('errors deps', errorsDeps);

	const [isValid, setIsValid] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isTriggerred, setIsTriggerred] = useState<boolean>(false);

	//set is valid after errors changing
	useEffect(() => { 
		console.log('errors deps changed', errors);

		let isError: boolean = false;

		//we check errors by fieldsNames
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
	}, [errorsDeps]);

	//if we are submitting and isValid changed -> checkValidity and submit
	useEffect(() => {
		console.log('isSubmitting(validity changed)', isSubmitting, isValid);
		if(isSubmitting) {
			setIsSubmitting(false);
			checkValidity();
		}
	}, [isValid]);

	useEffect(() => {
		console.log('values changed', values);
		if(trigger && isTriggerred) trigger(fieldsNames);
	}, [values, isTriggerred])

	//if isValid -> nextStep
	const checkValidity = () => {
		if(isValid && nextStep) nextStep();
	}


	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		if(!isTriggerred && trigger) {
			setIsSubmitting(true);
			setIsTriggerred(true);
		} else {
			checkValidity();
		}
		e.preventDefault();
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

	return (
		<button className={cn(classes.SaveBtn, className)} onClick={handleSubmit} >
			<span>Зберегти</span>
			<IconButton color='warning' className={classes.iconWrapper}>
				<EastIcon color='primary' className={classes.icon} />
			</IconButton>
		</button>
	)
}
