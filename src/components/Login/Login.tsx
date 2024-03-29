
import React, { useContext, useEffect } from 'react';
import { FirebaseContext } from '../../main';
import classes from './Login.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../Redux/store';
import { useSelector } from 'react-redux';
import { selectAuthedStatus, selectMyAccountData, selectMyLoginData } from '../../Redux/account/account-selectors';
import { Button } from '@mui/joy';
import { selectPrevPage } from '../../Redux/app/appSelectors';
import { SignInForm } from './SignInForm';
import { OtherLoginMethods } from './OtherLoginMethods';
import { Links } from './Links';

type PropsType = {}

const Login: React.FC<PropsType> = ({}) => {
	const accountData = useSelector(selectMyAccountData);
	const isAuthed = useSelector(selectAuthedStatus);
	const prevPage = useSelector(selectPrevPage);

	const navigate = useNavigate();

	useEffect(() => {
		//if we went to this page accidantly(we have authData) -> come back
		//it happens after first site's opening beacause we getting authData
		//and it cant load in the time
		console.log('is authed', isAuthed);
		if(!!accountData && isAuthed) {
			if(prevPage === '/login') {
				navigate('/', {replace: true});	
			} else  {
				navigate((prevPage || '/'), {replace: true});
			}
		}
	}, [accountData, isAuthed]);


	
	const toNavigation = ()   => {
		console.log('to navigation');
		navigate('/registration', {replace: true});
	}

	return (
		<div className={classes.Login}>
			<div className={classes.content}>
				<h1 className={classes.title}>З поверненням!</h1>
				<SignInForm />
				<OtherLoginMethods />
				<Links />
			</div>
		</div>
	)
}

export default Login