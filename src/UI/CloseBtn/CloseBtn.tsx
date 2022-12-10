import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import classes from './CloseBtn.module.scss';
import cn from 'classnames';

type PropsType = {
	onClick: () => void,
	className?: string,
}

export const CloseBtn: React.FC<PropsType> = ({onClick, className}) => {
	return (
		<button className={cn(classes.CloseBtn, className)} onClick={onClick}>
			<CloseIcon className={classes.icon} />
		</button>
	)
}
