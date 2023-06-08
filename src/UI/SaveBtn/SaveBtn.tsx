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
	const {trigger, nextStep, control, setValue} = useContext(FormContext) || {};
	//const [errorsDeps, setErrorsDeps] = useState(second)

	let errorsDeps = fieldsNames.map(name => errors[name]);

	const values = useWatch({
		control,
		name: fieldsNames
	});

	const [isValid, setIsValid] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isTriggerred, setIsTriggerred] = useState<boolean>(false);

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
	const checkValidity = () => {
		if(isValid && nextStep) {
			//we turned off submit
			//have to set values menually
			for (let i = 0; i < fieldsNames.length; i++) {
				//values - array based on fieldsNames, so order is right
				//setValue can be null
				if(setValue) {
					setValue(fieldsNames[i], values[i]);
				}
			}
			nextStep();
		};
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
