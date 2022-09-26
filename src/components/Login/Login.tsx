import Icon, { HomeOutlined } from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { Button } from 'antd';
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useContext } from 'react';
import { FirebaseContext } from '../..';
import { UserType } from '../../utils/types';
import classes from './Login.module.scss';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import Preloader from '../../UI/Preloader';
import { GoogleIcon } from '../../UI/Icons';
import { useAppDispatch } from '../../Redux/store';
import { loginDataReceived, sendMyAccountData } from '../../Redux/account/account-reducer';
import { useSelector } from 'react-redux';
import { selectMyLoginData } from '../../Redux/account/account-selectors';

type PropsType = {}

const Login: React.FC<PropsType> = ({}) => {
	const { auth } = useContext(FirebaseContext);

	const authData = useSelector(selectMyLoginData);

	console.log('Login', authData);

	const dispatch = useAppDispatch();
	const setAccountData = (data: UserType) => {
		dispatch(loginDataReceived(data));
		dispatch(sendMyAccountData(null));
	}

	if(!!authData) return <Navigate to='/account' replace={true}/>	

	const login = async () => {
		const provider = new GoogleAuthProvider();
		const { user } = await signInWithPopup(auth as Auth, provider);

		setAccountData(user);
	}

	return (
		<div className={classes.Login}>
			<Button block onClick={login} className={classes.loginBtn}>
				Увійти 
				<GoogleIcon className={classes.googleIcon}/>
			</Button>
		</div>
	)
}

export default Login