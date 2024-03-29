import { IconButton, SvgIcon } from '@mui/joy';
import React, { ElementType } from 'react';
import { NavLink } from 'react-router-dom';
import { PathsType } from '../../../utils/types';

import classes from './FooterLink.module.scss';

type PropsType = {
	icon: ElementType,
	to: PathsType,
	bigger?: boolean,
};

export const FooterLink: React.FC<PropsType> = ({icon: Icon, to, bigger}) => {
	//for shorter code
	const baseClassname = bigger ? `${classes.link} ${classes._bigger}` : classes.link

	return (
		<NavLink className={({isActive}) => (
			isActive ? `${classes._active} ${baseClassname}` : baseClassname
		)} to={to} >
			<IconButton 
				className={classes.btn}
				variant='plain'
			>
				<Icon className={classes.icon} />
			</IconButton>
		</NavLink>
	)
}
