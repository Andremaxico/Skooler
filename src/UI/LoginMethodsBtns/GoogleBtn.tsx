import React from 'react';
import classes from './LoginMethodsBtns.module.scss';
import { IconButton } from '@mui/joy';
import { GoogleAuthProvider, signInWithPopup, Auth } from 'firebase/auth';
import { loginDataReceived, sendMyAccountData, setMyAccountData } from '../../Redux/account/account-reducer';
import { UserType } from '../../utils/types';
import { GoogleIcon } from '../Icons';
import { auth } from '../../firebase/firebaseApi';
import { useAppDispatch } from '../../Redux/store';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectMyAccountData } from '../../Redux/account/account-selectors';

type PropsType = {
	className?: string,
}

export const GoogleBtn: React.FC<PropsType> = ({className}) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const setLoginData = async (data: UserType) => {
		dispatch(loginDataReceived(data));

		//snavigate('/registration/1', {replace: true});
		//dispatch(sendMyAccountData(data));
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
