import React, { useContext } from 'react';
import classes from './ReturnBtn.module.scss';
import cn from 'classnames';
import { IconButton } from '@mui/joy';
import WestIcon from '@mui/icons-material/West';
import { FormContext } from '../Registration';

type PropsType = {
	className?: string,
};

export const ReturnBtn: React.FC<PropsType> = ({className}) => {
	const { prevStep } = useContext(FormContext) || {};

	const handleSubmit = () => {
		if( prevStep ) prevStep();
	}

	return (
		<div className={cn(classes.ReturnBtn, className)}>
			<IconButton
				className={classes.iconBtn} 
				onClick={handleSubmit}
				color='primary'
			>
				<WestIcon className={classes.icon} />
			</IconButton>
			<p className={classes.text}>{'Назад'}</p>
		</div>
	)
}
