
import React, { useContext, useEffect } from 'react';
import { FirebaseContext } from '../../main';
import classes from './Login.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../Redux/store';
import { useSelector } from 'react-redux';
import { selectAuthedStatus, selectMyAccountData, selectMyLoginData } from '../../Redux/account/account-selectors';
import { Button } from '@mui/joy';
import { selectLastPrevPage } from '../../Redux/app/appSelectors';
import { SignInForm } from './SignInForm';
import { OtherLoginMethods } from './OtherLoginMethods';
import { Links } from './Links';
import { authErrorRemoved } from '../../Redux/account/account-reducer';
import { allPostsReceived } from '../../Redux/stream/stream-reducer';

type PropsType = {}

const Login: React.FC<PropsType> = ({}) => {
	const accountData = useSelector(selectMyAccountData);
	const isAuthed = useSelector(selectAuthedStatus);
	const prevPage = useSelector(selectLastPrevPage);

	const navigate = useNavigate();

	const dispatch = useAppDispatch();

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

	//remove sign-in error when leving Login page
	useEffect(() => {
		return () => {
			dispatch(authErrorRemoved('signin'));
		}
	}, []);

	//first posts fetching twice, 
	//because we visit /(1x) -> /login -> /(2x) 
	//we need to clear posts in login page
	useEffect(() => {
		dispatch(allPostsReceived(null));
	}, [])
	
	const toNavigation = ()   => {
		console.log('to navigation');
		navigate('/registration/1', {replace: true});
	}

	return (
		<div className={classes.Login}>
			<div className={classes.content}>
				<h1 className={classes.title}>Вітаємо!</h1>
				<SignInForm />
				<OtherLoginMethods />
				<Links />
			</div>
		</div>
	)
}

export default Login