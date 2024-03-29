import React from 'react';
import classes from './LoginMethodsBtns.module.scss';
import { IconButton } from '@mui/joy';
import { GoogleAuthProvider, signInWithPopup, Auth } from 'firebase/auth';
import { loginDataReceived, sendMyAccountData } from '../../Redux/account/account-reducer';
import { UserType } from '../../utils/types';
import { GoogleIcon } from '../Icons';
import { auth } from '../../firebase/firebaseApi';
import { useAppDispatch } from '../../Redux/store';
import cn from 'classnames';

type PropsType = {
	className?: string,
}

export const GoogleBtn: React.FC<PropsType> = ({className}) => {
	const dispatch = useAppDispatch();

	const setLoginData = (data: UserType) => {
		dispatch(loginDataReceived(data));
		dispatch(sendMyAccountData(null));
	}

	const loginGoogle = async () => {
		const provider = new GoogleAuthProvider();
		const { user } = await signInWithPopup(auth as Auth, provider);

		setLoginData(user);
	}

	return (
		<IconButton className={cn(className, classes.iconBtn)} onClick={loginGoogle}>
			<GoogleIcon className={classes.icon}/>
		</IconButton>
	)
}
