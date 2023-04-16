import React from 'react';
import classes from './SaveBtn.module.scss';
import EastIcon from '@mui/icons-material/East';
import cn from 'classnames';
<<<<<<< HEAD

=======
import { IconButton } from '@mui/material';
>>>>>>> f0a0e1dc5720320ac046ce0a9489471ff300868f

type PropsType = {
	onClick: () => void,
	className?: string,
}

export const SaveBtn: React.FC<PropsType> = ({onClick, className}) => {
  return (
	<button className={cn(classes.SaveBtn, className)} onClick={onClick}>
		<span>Зберегти</span>
<<<<<<< HEAD
		<div color='warning' className={classes.iconWrapper}>
			<EastIcon color='inherit' className={classes.icon} />
		</div>
=======
		<IconButton color='warning' className={classes.iconWrapper}>
			<EastIcon color='inherit' className={classes.icon} />
		</IconButton>
>>>>>>> f0a0e1dc5720320ac046ce0a9489471ff300868f
	</button>
  )
}
