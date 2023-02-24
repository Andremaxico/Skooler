import Icon, { HomeOutlined } from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

import { Auth, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useContext, useEffect } from 'react';
import { FirebaseContext } from '../..';
import { UserType } from '../../utils/types';
import classes from './Login.module.scss';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import Preloader from '../../UI/Preloader';
import { GoogleIcon } from '../../UI/Icons';
import { useAppDispatch } from '../../Redux/store';
import { loginDataReceived, sendMyAccountData } from '../../Redux/account/account-reducer';
import { useSelector } from 'react-redux';
import { selectMyLoginData } from '../../Redux/account/account-selectors';
import { Button } from '@mui/joy';
import { Registration } from '../Registration';
import { selectPrevPage } from '../../Redux/app/appSelectors';

type PropsType = {}

const Login: React.FC<PropsType> = ({}) => {
	const { auth } = useContext(FirebaseContext);

	const authData = useSelector(selectMyLoginData);
	const prevPage = useSelector(selectPrevPage);

	const dispatch = useAppDispatch();
	const setAccountData = (data: UserType) => {
		dispatch(loginDataReceived(data));
		dispatch(sendMyAccountData(null));
	}

	const navigate = useNavigate();

	useEffect(() => {
		console.log('auth data', authData);
		if(!!authData && prevPage) {
			if(prevPage === '/login') {
				navigate('/', {replace: true});	
			} else {
				navigate(prevPage, {replace: true});
			}
		}
	}, [authData])

	const login = async () => {
		const provider = new GoogleAuthProvider();
		const { user } = await signInWithPopup(auth as Auth, provider);

		setAccountData(user);
	}

	
	const handleClick = () => {
		console.log('handle click');
		return <Registration />
	}

	return (
		<div className={classes.Login}>
			<Button onClick={login} className={classes.loginBtn}>
				Увійти 
				<GoogleIcon className={classes.googleIcon}/>
			</Button>
			<Button onClick={handleClick} className={classes.registerBtn}>
				Зареєструватися
			</Button>
		</div>
	)
}

export default Login