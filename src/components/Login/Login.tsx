import { Button } from 'antd';
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useContext } from 'react';
import { FirebaseContext } from '../..';
import { UserType } from '../../utils/types';
import classes from './Login.module.scss';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import Preloader from '../../UI/Preloader';

type PropsType = {
	setAccountData: (data: UserType) => void,
}

const Login: React.FC<PropsType> = ({setAccountData}) => {
	const { auth } = useContext(FirebaseContext);
	const [authData, loading, error] = useAuthState(auth as Auth);

	if(loading) return <Preloader />
	if(authData) return <Navigate to='/chat' replace={true}/>	

	const login = async () => {
		const provider = new GoogleAuthProvider();
		const { user } = await signInWithPopup(auth as Auth, provider);
		console.log('auth data', user);
		setAccountData(user);
	}

	return (
		<div className={classes.Login}>
			<Button block onClick={login}>Login</Button>
		</div>
	)
}

export default Login