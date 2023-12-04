import React from 'react';
import { useAppDispatch } from '../../Redux/store';
import classes from './LoginMethodsBtns.module.scss';
import cn from 'classnames';
import { IconButton } from '@mui/joy';
import { loginDataReceived, loginWithFacebook, sendMyAccountData } from '../../Redux/account/account-reducer';
import { FacebookIcon } from '../Icons/Icons';

type PropsType = {
	className?: string,
};

export const FacebookBtn: React.FC<PropsType> = ({className}) => {
	const dispatch = useAppDispatch();

	const loginFacebook = async () => {
		dispatch(loginWithFacebook()); 
	}

	return (
		<IconButton className={cn(classes.iconBtn, className)} onClick={loginFacebook}>
			<FacebookIcon className={classes.icon}/>
		</IconButton>
	)
}
