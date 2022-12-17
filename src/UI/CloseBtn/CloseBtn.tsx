import React from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import classes from './CloseBtn.module.scss';
import cn from 'classnames';

type PropsType = {
	onClick: () => void,
	className?: string,
}

export const CloseBtn: React.FC<PropsType> = ({onClick, className}) => {
	return (
		<button className={cn(classes.CloseBtn, className)} onClick={onClick}>
			<HighlightOffIcon className={classes.icon} color='error'/>
		</button>
	)
}
