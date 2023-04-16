import React from 'react';
import classes from './SaveBtn.module.scss';
import EastIcon from '@mui/icons-material/East';
import cn from 'classnames';
import { IconButton } from '@mui/material';

type PropsType = {
	onClick: () => void,
	className?: string,
}

export const SaveBtn: React.FC<PropsType> = ({onClick, className}) => {
  return (
	<button className={cn(classes.SaveBtn, className)} onClick={onClick}>
		<span>Зберегти</span>
		<div color='warning' className={classes.iconWrapper}>
			<EastIcon color='inherit' className={classes.icon} />
		</div>
		<IconButton color='warning' className={classes.iconWrapper}>
			<EastIcon color='inherit' className={classes.icon} />
		</IconButton>
	</button>
  )
}
