import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/joy';
import classes from './CancelRegistrationBtn.module.scss';

type PropsType = {
	setIsCancelModalShow: (value: boolean) => void,
};

export const CancelRegistrationBtn: React.FC<PropsType> = ({setIsCancelModalShow}) => {
	const handleClick = () => {
		setIsCancelModalShow(true);
	}

	return (
		<IconButton className={classes.CancelRegistrationBtn} variant='plain' onClick={handleClick}> 
			<CloseIcon className={classes.icon} />
		</IconButton>
	)
}
