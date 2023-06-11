import Icon, { HomeOutlined } from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

import { Auth, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { startTransition, useContext, useEffect } from 'react';
import { FirebaseContext } from '../../main';
import { UserType } from '../../utils/types';
import classes from './Login.module.scss';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import Preloader from '../../UI/Preloader';
import { GoogleIcon } from '../../UI/Icons';
import { useAppDispatch } from '../../Redux/store';
import { createAccountByEmail, loginDataReceived, sendMyAccountData, signInByEmail } from '../../Redux/account/account-reducer';
import { useSelector } from 'react-redux';
import { selectMyLoginData } from '../../Redux/account/account-selectors';
import { Button } from '@mui/joy';
import { Registration } from '../Registration';
import { selectPrevPage } from '../../Redux/app/appSelectors';
import { useForm } from 'react-hook-form';
import { LoginForm } from '../../UI/LoginForm/LoginForm';

type PropsType = {}

export type LoginFieldsValues = {
	email: string,
	password: string,
};

const Login: React.FC<PropsType> = ({}) => {
	const { control, formState: { errors }, handleSubmit } = useForm<LoginFieldsValues>();

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
		//if we went to this page accidantly(we have authData) -> come back
		//it happens after first site's opening beacause we getting authData
		//and it cant load in the time
		if(!!authData && prevPage) {
			if(prevPage === '/login') {
				navigate('/', {replace: true});	
			} else {
				navigate(prevPage, {replace: true});
			}
		}
	}, [authData]);

	const login = async () => {
		const provider = new GoogleAuthProvider();
		const { user } = await signInWithPopup(auth as Auth, provider);

		setAccountData(user);
	}

	
	const handleClick = () => {
		console.log('handle click');
		return <Registration />
	}

	const onSubmit = (data: LoginFieldsValues) => {
		console.log('submit data', data);
		dispatch(signInByEmail(data.email, data.password));
	}

	useEffect(() => {
		console.log('errros', errors);
	}, [errors])

	return (
		<div className={classes.Login}>
			<form className={classes.loginForm} onSubmit={handleSubmit(onSubmit)}>
				<LoginForm 
					control={control}
					errors={errors}
					className={classes.loginFields}
				/>
				<Button type='submit' className={classes.submitBtn}>
					Увійти
				</Button>
			</form>


			<Button onClick={login} className={classes.loginBtn} variant={'solid'}>
				Увійти 
				<GoogleIcon className={classes.googleIcon}/>
			</Button>
			<Button onClick={handleClick} className={classes.registerBtn} variant={'solid'}>
				Зареєструватися
			</Button>
		</div>
	)
}

export default Login