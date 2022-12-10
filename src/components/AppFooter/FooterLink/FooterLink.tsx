import { IconButton, SvgIcon } from '@mui/material';
import React, { ElementType } from 'react';
import { NavLink } from 'react-router-dom';
import { PathsType } from '../../../utils/types';

import classes from './FooterLink.module.scss';

type PropsType = {
	icon: ElementType,
	to: PathsType,
};

export const FooterLink: React.FC<PropsType> = ({icon: Icon, to}) => {
	return (
		<NavLink className={({isActive}) => (
			isActive ? `${classes._active} ${classes.link}` : classes.link
		)} to={to} >
			<IconButton className={classes.btn}>
				<Icon className={classes.icon} />
			</IconButton>
		</NavLink>
	)
}
